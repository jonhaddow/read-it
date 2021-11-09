import path from "path";
import { SuperAgentTest } from "supertest";
import { createSuperAgent, startTestServer, stopTestServer } from "./utils";
import { readFileSync } from "fs";

// Mocking the fetch API response.
// Not important for the test, but speeds up test.
const mockHtml = readFileSync(__dirname + "/eff.html");
jest.mock("node-fetch", () =>
	jest.fn().mockImplementation(() => ({
		text: jest.fn().mockResolvedValue(mockHtml),
	}))
);

describe("bookmarks paging", () => {
	let agent: SuperAgentTest;

	beforeAll(async () => {
		const app = await startTestServer(path.basename(__filename));
		agent = await createSuperAgent(app);

		// Create multiple bookmarks
		for (let i = 0; i < 60; i++) {
			const bookmark = {
				url: `http://example.com/${i}`,
			};
			const response = await agent.post("/api/bookmarks").send(bookmark);
			expect(response.status).toBe(201);
		}
	});

	afterAll(async () => {
		await stopTestServer(path.basename(__filename));
	});

	it("should return the correct page of results", () => {
		return agent
			.get(`/api/bookmarks?skip=${20}&take=${25}`)
			.expect(200)
			.expect((response) => {
				expect(response.body.total).toBe(60);
				expect(response.body.results.length).toBe(25);

				for (let i = 0; i < 25; i++) {
					expect(response.body.results[i].url).toBe(
						`http://example.com/${39 - i}`
					);
				}
			});
	});
});
