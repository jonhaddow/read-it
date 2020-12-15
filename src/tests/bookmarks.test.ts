import request from "supertest";
import { app, server } from "../app";

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
