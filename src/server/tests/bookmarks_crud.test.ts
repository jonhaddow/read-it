import path from "path";
import { SuperAgentTest } from "supertest";
import { ResultSet } from "../interfaces";
import { Bookmark } from "core/models";
import fs from "fs";
import { createSuperAgent, startTestServer, stopTestServer } from "./utils";

const mockHtml = fs.readFileSync(__dirname + "/eff.html");

// Mocking the fetch API response.
jest.mock("node-fetch", () =>
	jest.fn().mockImplementation(() => ({
		text: jest.fn().mockResolvedValue(mockHtml),
	}))
);

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
		expect(bookmark).toHaveProperty("title", "Electronic Frontier Foundation");
		expect(bookmark).toHaveProperty(
			"description",
			"Defending your rights in the digital world"
		);
	});

	it("should allow a single bookmark to be retrieved", async () => {
		if (!bookmark.id) throw new Error("Bookmark should have an ID.");
		const response = await agent.get(`/api/bookmarks/${bookmark.id}`);

		expect(response.status).toBe(200);

		expect(bookmark).toHaveProperty("title", "Electronic Frontier Foundation");
		expect(bookmark).toHaveProperty(
			"description",
			"Defending your rights in the digital world"
		);
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
