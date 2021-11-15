import path from "path";
import { SuperAgentTest } from "supertest";
import { Bookmark } from "core/models";
import { createSuperAgent, startTestServer, stopTestServer } from "./utils";

// Mocking the node fetch
jest.mock("node-fetch", () => {
	return jest.fn().mockImplementation((url) => {
		if (url.includes("https://my-target-url.com")) {
			return {
				text: () =>
					jest
						.fn()
						.mockResolvedValue(`<html><body><h1>Test</h1></body></html>`),
			};
		}
		return {
			json: jest.fn().mockResolvedValue({
				title: "Hacker news title",
				url: "https://my-target-url.com",
			}),
		};
	});
});

describe("bookmarks_populate_hackernews", () => {
	let agent: SuperAgentTest;

	beforeAll(async () => {
		const app = await startTestServer(path.basename(__filename));
		agent = await createSuperAgent(app);
	});

	afterAll(async () => {
		await stopTestServer(path.basename(__filename));
	});

	describe(`when the URL is from hacker news`, () => {
		let bookmark: Bookmark;

		it("should retrieve the bookmark metadata without error", async () => {
			// Add a test bookmark to the app.
			const response = await agent.post("/api/bookmarks").send({
				url: `https://news.ycombinator.com/item?id=29229200`,
			});

			expect(response.status).toBe(201);

			bookmark = response.body;
		});

		it("should have the correct details", async () => {
			if (!bookmark.id) throw new Error("Bookmark should have an ID.");

			const response = await agent.get(`/api/bookmarks/${bookmark.id}`);
			bookmark = response.body as Bookmark;

			expect(bookmark.title).toEqual("Hacker news title");
			expect(bookmark.targetURL).toEqual("https://my-target-url.com");
			expect(bookmark.specialType).toEqual("hacker-news");
		});
	});
});
