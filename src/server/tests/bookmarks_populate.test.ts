import path from "path";
import { SuperAgentTest } from "supertest";
import { Bookmark } from "core/models";
import { createSuperAgent, startTestServer, stopTestServer } from "./utils";
import fs from "fs";

const mockHtml = fs.readFileSync(__dirname + "/eff.html");

// Mocking the fetch API response.
jest.mock("node-fetch", () =>
	jest.fn().mockImplementation(() => ({
		text: jest.fn().mockResolvedValue(mockHtml),
	}))
);

describe("populate_bookmarks", () => {
	let bookmark: Bookmark;

	let agent: SuperAgentTest;

	beforeAll(async () => {
		const app = await startTestServer(path.basename(__filename));
		agent = await createSuperAgent(app);
	});

	afterAll(async () => {
		await stopTestServer(path.basename(__filename));
	});

	it("should retrieve the bookmark metadata without error", async () => {
		// Add a test bookmark to the app.
		const response = await agent.post("/api/bookmarks").send({
			url: "https://www.eff.org",
		});
		bookmark = response.body;
	});

	it("should have the correct details", async () => {
		if (!bookmark.id) throw new Error("Bookmark should have an ID.");
		const response = await agent.get(`/api/bookmarks/${bookmark.id}`);
		bookmark = response.body as Bookmark;

		expect(bookmark.title).toEqual("Electronic Frontier Foundation");
		expect(bookmark.description).toEqual(
			"Defending your rights in the digital world"
		);
		expect(bookmark.thumbnailUrl).toEqual(
			"https://www.eff.org/files/eff-og.png"
		);
	});
});
