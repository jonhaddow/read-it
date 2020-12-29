import request from "supertest";
import { getConnection, getRepository } from "typeorm";
import { ResultSet } from "../interfaces";
import { Bookmark, User } from "../entities";
import { startServer } from "../server";
import { hash } from "bcrypt";

const BASE_URL = "http://0.0.0.0:3000";

describe("bookmarks", () => {
	const agent = request.agent(BASE_URL);

	beforeAll(async () => {
		// Starts up the express server
		await startServer();

		// Clears existing DB and re-syncs
		await getConnection().synchronize(true);

		// Add test user to DB
		const user = new User("test@email.com");
		user.hashedPassword = await hash("testPassword", 10);
		await getRepository(User).insert(user);

		// Login to store session cookie on the agent
		await agent
			.post("/login")
			.send({ username: user.email, password: "testPassword" })
			.set("Accept", "application/json");
	});

	it("should return empty list of bookmarks", async () => {
		const response = await agent.get("/api/bookmarks");

		expect(response.status).toBe(200);

		const resultSet = response.body as ResultSet<Bookmark>;
		expect(resultSet.results).toHaveLength(0);
	});
});
