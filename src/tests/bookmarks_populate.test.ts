import { SuperAgentTest } from "supertest";
import { Bookmark } from "../entities";
import { createSuperAgent, startTestServer, stopTestServer } from "./utils";
import { populateBookmark } from "../subscribers/populateBookmark";

describe("populate_bookmarks", () => {
	let bookmark: Bookmark;

	let agent: SuperAgentTest;

	beforeAll(async () => {
		const app = await startTestServer("populate_bookmarks");
		agent = await createSuperAgent(app);

		// Add a test bookmark to the app.
		const response = await agent.post("/api/bookmarks").send({
			url: "https://jon.haddow.me/blog/setup-react-with-webpack",
		});
		bookmark = response.body;
	});

	afterAll(async () => {
		await stopTestServer("populate_bookmarks");
	});

	it("should retrieve the bookmark metadata without error", async () => {
		// Add a test bookmark to the app.
		const response = await agent.post("/api/bookmarks").send({
			url: "https://jon.haddow.me/blog/benefits-of-css-in-js",
		});
		bookmark = response.body;

		// We are manually triggering the event (which would be triggered
		// automatically within the app) so that Jest is aware of the task
		// itself and can await it before ending the test.
		await populateBookmark(bookmark);
	});

	it("should have the correct details", async () => {
		const response = await agent.get(`/api/bookmarks/${bookmark.id}`);
		bookmark = response.body as Bookmark;

		expect(bookmark.title).toEqual("Benefits of CSS-in-JS");
		expect(bookmark.description).toEqual(
			"5 reasons why you should consider writing CSS within your JSX"
		);
	});
});
