import path from "path";
import { SuperAgentTest } from "supertest";
import { Bookmark } from "core/models";
import { createSuperAgent, startTestServer, stopTestServer } from "./utils";

// Mocking the node fetch
jest.mock("node-fetch", () => {
	return jest.fn().mockImplementation(() => {
		return {
			json: jest.fn().mockResolvedValue({
				items: [
					{
						snippet: {
							title: "How to be a Pirate: Captain Edition",
							description: "Arr...",
							thumbnails: {
								default: {
									url: "https://thumbnail.default.test.com",
								},
								high: {
									url: "https://thumbnail.high.test.com",
								},
							},
						},
						contentDetails: {
							duration: "PT1M30S",
						},
					},
				],
			}),
			text: jest.fn().mockResolvedValue(""),
		};
	});
});

describe("bookmarks_populate_youtube", () => {
	let agent: SuperAgentTest;

	beforeAll(async () => {
		const app = await startTestServer(path.basename(__filename));
		agent = await createSuperAgent(app);
	});

	afterAll(async () => {
		await stopTestServer(path.basename(__filename));
	});

	describe(`when the URL is from youtube`, () => {
		let bookmark: Bookmark;

		it("should retrieve the bookmark metadata without error", async () => {
			// Add a test bookmark to the app.
			const response = await agent.post("/api/bookmarks").send({
				url: `https://www.youtube.com/watch?v=3YFeE1eDlD0`,
			});

			expect(response.status).toBe(201);

			bookmark = response.body;
		});

		it("should have the correct details", async () => {
			if (!bookmark.id) throw new Error("Bookmark should have an ID.");

			const response = await agent.get(`/api/bookmarks/${bookmark.id}`);
			bookmark = response.body as Bookmark;

			expect(bookmark.title).toEqual("How to be a Pirate: Captain Edition");
			expect(bookmark.description).toEqual("Arr...");
			expect(bookmark.specialType).toEqual("youtube");
			expect(bookmark.favicon).toEqual("https://www.youtube.com/favicon.ico");
			expect(bookmark.thumbnailUrl).toEqual("https://thumbnail.high.test.com");
			expect(bookmark.minuteEstimate).toEqual("1.5");
		});
	});
});
