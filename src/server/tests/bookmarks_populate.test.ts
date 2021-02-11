import path from "path";
import { SuperAgentTest } from "supertest";
import { Bookmark } from "core/models";
import { createSuperAgent, startTestServer, stopTestServer } from "./utils";
import { populateBookmark } from "../subscribers/populateBookmark";

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

		// We are manually triggering the event (which would be triggered
		// automatically within the app) so that Jest is aware of the task
		// itself and can await it before ending the test.
		await populateBookmark(bookmark);
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
