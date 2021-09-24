import path from "path";
import { SuperAgentTest } from "supertest";
import { ResultSet } from "../interfaces";
import { Bookmark } from "core/models";
import { createSuperAgent, startTestServer, stopTestServer } from "./utils";

describe("bookmarks_crud", () => {
	let agent: SuperAgentTest;
	let bookmark: Bookmark;

	beforeAll(async () => {
		const app = await startTestServer(path.basename(__filename));
		agent = await createSuperAgent(app);
	});

	afterAll(async () => {
		await stopTestServer(path.basename(__filename));
	});

	it("should return empty list of bookmarks", async () => {
		const response = await agent.get("/api/bookmarks");

		expect(response.status).toBe(200);

		const resultSet = response.body as ResultSet<Bookmark>;
		expect(resultSet.results).toHaveLength(0);
	});

	it("should allow a bookmark to be added", async () => {
		const response = await agent.post("/api/bookmarks").send({
			url: "https://test.com/route1/route2?queryParam=qp",
		});

		expect(response.status).toBe(201);

		expect(response.body.id).toBeDefined();

		bookmark = response.body;
	});

	it("should return a list of bookmarks with 1 item", async () => {
		const response = await agent.get("/api/bookmarks");

		expect(response.status).toBe(200);

		const resultSet = response.body as ResultSet<Bookmark>;
		expect(resultSet.results).toHaveLength(1);

		const bookmark = resultSet.results[0];
		expect(bookmark).toHaveProperty("title", "customTitle");
		expect(bookmark).toHaveProperty("description", "customDescription");
	});

	it("should allow a single bookmark to be retrieved", async () => {
		if (!bookmark.id) throw new Error("Bookmark should have an ID.");
		const response = await agent.get(`/api/bookmarks/${bookmark.id}`);

		expect(response.status).toBe(200);

		expect(response.body).toHaveProperty("title", "customTitle");
		expect(response.body).toHaveProperty("description", "customDescription");
	});

	it("should allow a bookmark to be removed", async () => {
		if (!bookmark.id) throw new Error("Bookmark should have an ID.");
		const response = await agent.delete(`/api/bookmarks/${bookmark.id}`);

		expect(response.status).toBe(204);
	});

	it("should not find the single bookmark", async () => {
		if (!bookmark.id) throw new Error("Bookmark should have an ID.");
		const response = await agent.get(`/api/bookmarks/${bookmark.id}`);

		expect(response.status).toBe(404);
	});
});
