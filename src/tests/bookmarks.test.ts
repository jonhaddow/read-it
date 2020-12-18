import request from "supertest";
import { getConnection } from "typeorm";
import { ResultSet } from "../interfaces";
import { Bookmark } from "../entities";
import { startServer } from "../server";

beforeAll(async () => {
	// Starts up the express server
	await startServer();

	// Drops the bookmarks table.
	await getConnection().getRepository(Bookmark).clear();
});

describe("bookmarks", () => {
	it("should return empty list of bookmarks", async () => {
		const response = await request("http://0.0.0.0:3000").get("/api/bookmarks");

		expect(response.status).toBe(200);

		const resultSet = response.body as ResultSet<Bookmark>;
		expect(resultSet.results).toHaveLength(0);
	});
});
