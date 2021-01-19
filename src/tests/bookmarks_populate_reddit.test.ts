import path from "path";
import { SuperAgentTest } from "supertest";
import { Bookmark } from "../entities";
import { createSuperAgent, startTestServer, stopTestServer } from "./utils";
import { populateBookmark } from "../subscribers/populateBookmark";

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
		"https://www.reddit.com/r/news/comments/kx9xx9/a_man_who_carried_a_confederate_flag_into_the/",
		"https://www.reddit.com/kx9xx9",
		"https://redd.it/kx9xx9",
	].forEach((x) => {
		describe(`when the URL is ${x}`, () => {
			let bookmark: Bookmark;

			it("should retrieve the bookmark metadata without error", async () => {
				// Add a test bookmark to the app.
				const response = await agent.post("/api/bookmarks").send({
					url: x,
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

				expect(bookmark.title).toEqual(
					"A man who carried a Confederate flag into the Capitol has been arrested."
				);
				expect(bookmark.description).toEqual(
					"A federal prosecutor said that a retired Air Force officer who stormed the Senate chamber holding zip ties had intended to “take hostages.”"
				);
				expect(bookmark.thumbnailUrl).toEqual(
					"https://static01.nyt.com/images/2021/01/14/us/14transition-briefing-confederate-flag-arrest/14transition-briefing-confederate-flag-arrest-facebookJumbo-v2.jpg"
				);
				expect(bookmark.targetURL).toEqual(
					"https://www.nytimes.com/2021/01/14/us/Kevin-Seefried-arrested.html"
				);
				expect(bookmark.specialType).toEqual("reddit");
			});
		});
	});
});
