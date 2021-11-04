import path from "path";
import { SuperAgentTest } from "supertest";
import { ResultSet } from "../interfaces";
import { Bookmark } from "core/models";
import { createSuperAgent, startTestServer, stopTestServer } from "./utils";
import fs from "fs";
import { Express } from "express";

const mockHtml = fs.readFileSync(__dirname + "/eff.html");

// Mocking the fetch API response.
jest.mock("node-fetch", () =>
	jest.fn().mockImplementation(() => ({
		text: jest.fn().mockResolvedValue(mockHtml),
	}))
);

describe("bookmarks_multiple_users", () => {
	let app: Express;
	let bookmark: Bookmark;

	let user1: SuperAgentTest;
	let user2: SuperAgentTest;

	beforeAll(async () => {
		app = await startTestServer(path.basename(__filename));

		user1 = await createSuperAgent(app, "user1@email.com");
		user2 = await createSuperAgent(app, "user2@email.com");
	});

	afterAll(async () => {
		await stopTestServer(path.basename(__filename));
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
		if (!bookmark.id) throw new Error("Bookmark should have an ID.");

		const response = await user1.get(`/api/bookmarks/${bookmark.id}`);

		expect(response.status).toBe(200);
	});

	it("should not allow a single bookmark to be retrieved for user 2", async () => {
		if (!bookmark.id) throw new Error("Bookmark should have an ID.");

		const response = await user2.get(`/api/bookmarks/${bookmark.id}`);

		expect(response.status).toBe(404);
	});
});
