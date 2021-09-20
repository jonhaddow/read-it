import path from "path";
import { SuperAgentTest } from "supertest";
import { Bookmark } from "core/models";
import { createSuperAgent, startTestServer, stopTestServer } from "./utils";
import { Submission } from "snoowrap";

// Mocking the reddit API response.
jest.mock("snoowrap", () => {
	return jest.fn().mockImplementation(() => {
		return {
			getSubmission: jest.fn().mockReturnValue({
				fetch: jest.fn().mockResolvedValue({
					title: "Reddit Title",
					url: "https://www.eff.org",
					thumbnail: "https://thumbnail.test.com",
				} as Submission),
			}),
		};
	});
});

describe("bookmarks_populate_reddit", () => {
	let agent: SuperAgentTest;

	beforeAll(async () => {
		const app = await startTestServer(path.basename(__filename));
		agent = await createSuperAgent(app);
	});

	afterAll(async () => {
		await stopTestServer(path.basename(__filename));
	});

	[
		"https://www.reddit.com/r/news/comments/123456/more_content/",
		"https://www.reddit.com/123456",
		"https://redd.it/123456",
	].forEach((x) => {
		describe(`when the URL is ${x}`, () => {
			let bookmark: Bookmark;

			it("should retrieve the bookmark metadata without error", async () => {
				// Add a test bookmark to the app.
				const response = await agent.post("/api/bookmarks").send({
					url: x,
				});

				expect(response.status).toBe(201);

				bookmark = response.body;
			});

			it("should have the correct details", async () => {
				if (!bookmark.id) throw new Error("Bookmark should have an ID.");

				const response = await agent.get(`/api/bookmarks/${bookmark.id}`);
				bookmark = response.body as Bookmark;

				expect(bookmark.title).toEqual("Reddit Title");
				expect(bookmark.thumbnailUrl).toEqual("https://thumbnail.test.com");
				expect(bookmark.targetURL).toEqual("https://www.eff.org");
				expect(bookmark.specialType).toEqual("reddit");
			});
		});
	});
});
