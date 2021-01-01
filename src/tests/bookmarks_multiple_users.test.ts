import { SuperAgentTest } from "supertest";
import { ResultSet } from "../interfaces";
import { Bookmark } from "../entities";
import { stopTestServer, startTestServer, createSuperAgent } from "./utils";
import { Express } from "express";

describe("bookmarks_multiple_users", () => {
	let app: Express;
	let bookmark: Bookmark;

	let user1: SuperAgentTest;
	let user2: SuperAgentTest;

	beforeAll(async () => {
		app = await startTestServer("bookmarks_multiple_users");

		user1 = await createSuperAgent(app, "user1@email.com");
		user2 = await createSuperAgent(app, "user2@email.com");
	});

	afterAll(async () => {
		await stopTestServer("bookmarks_multiple_users");
	});

	it("should return empty list of bookmarks for user 1", async () => {
		const response = await user1.get("/api/bookmarks");

		expect(response.status).toBe(200);

		const resultSet = response.body as ResultSet<Bookmark>;
		expect(resultSet.results).toHaveLength(0);
	});

	it("should return empty list of bookmarks for user 2", async () => {
		const response = await user2.get("/api/bookmarks");

		expect(response.status).toBe(200);

		const resultSet = response.body as ResultSet<Bookmark>;
		expect(resultSet.results).toHaveLength(0);
	});

	it("should allow a bookmark to be added for user 1", async () => {
		const response = await user1.post("/api/bookmarks").send({
			url: "https://test.com/route1/route2?queryParam=qp",
		});

		expect(response.status).toBe(201);

		expect(response.body.id).toBeDefined();

		bookmark = response.body;
	});

	it("should return a list of bookmarks with 1 item for user 1", async () => {
		const response = await user1.get("/api/bookmarks");

		expect(response.status).toBe(200);

		const resultSet = response.body as ResultSet<Bookmark>;
		expect(resultSet.results).toHaveLength(1);
	});

	it("should return empty list of bookmarks for user 2", async () => {
		const response = await user2.get("/api/bookmarks");

		expect(response.status).toBe(200);

		const resultSet = response.body as ResultSet<Bookmark>;
		expect(resultSet.results).toHaveLength(0);
	});

	it("should allow a single bookmark to be retrieved for user 1", async () => {
		const response = await user1.get(`/api/bookmarks/${bookmark.id}`);

		expect(response.status).toBe(200);
	});

	it("should allow a single bookmark to be retrieved for user 2", async () => {
		const response = await user2.get(`/api/bookmarks/${bookmark.id}`);

		expect(response.status).toBe(404);
	});
});
