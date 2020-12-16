import config from "config";
import { Pool, PoolClient } from "pg";
import request from "supertest";
import { app, server } from "../app";

const pool = new Pool(config.get("db_config"));

beforeAll(async () => {
	let client: PoolClient | null = null;
	try {
		client = await pool.connect();
		await client.query("DROP TABLE IF EXISTS bookmarks");
		await client.query(`
			CREATE TABLE bookmarks (
				id char(36),
				url varchar(2000)
			)
		`);
	} finally {
		client?.release();
	}
});

describe("bookmarks", () => {
	it("should return empty list of bookmarks", async () => {
		const response = await request(app).get("/api/bookmarks");

		expect(response.status).toBe(200);

		expect(response.body).toHaveProperty("results");
		expect(response.body.results).toHaveLength(0);
	});
});

afterAll(() => {
	server.close();
});
