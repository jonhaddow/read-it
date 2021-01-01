import request, { SuperAgentTest } from "supertest";
import { getConnection, getRepository } from "typeorm";
import { Express } from "express";
import {
	createDatabase as pgGodCreateDatabase,
	dropDatabase as pgGodDropDatabase,
} from "pg-god";
import config from "config";
import { User } from "../entities";
import { hash } from "bcrypt";
import { createDBConnection } from "../connection";
import { createApp } from "../app";

/**
 * Creates a database with the provided name.
 * @param name The name of the database.
 */
export const createDatabase = async (name: string): Promise<void> => {
	await pgGodCreateDatabase(
		{
			databaseName: name,
			errorIfExist: true,
		},
		{
			...config.get("db_config"),
		}
	);
};

/**
 * Drops the database with the provided name.
 * @param name The name of the database.
 */
export const dropDatabase = async (name: string): Promise<void> => {
	await pgGodDropDatabase(
		{
			databaseName: name,
			dropConnections: true,
			errorIfNonExist: true,
		},
		{
			...config.get("db_config"),
		}
	);
};

/**
 * Starts the express server and creates an authenticated "agent"
 * to use to make requests.
 */
export const getAuthenticatedAgent = async (
	app: Express
): Promise<SuperAgentTest> => {
	const agent = request.agent(app);

	// Add test user to database.
	const user = new User(`test_user@email.com`);
	user.hashedPassword = await hash("testPassword", 10);
	await getRepository(User).insert(user);

	// Login as default user to store session cookie on the agent
	await agent
		.post("/login")
		.send({ username: user.email, password: "testPassword" })
		.set("Accept", "application/json");

	return agent;
};

/**
 * Creates and connects to a database, starts the express app and authenticates a test user.
 * @param databaseName The database name to use.
 */
export const startTestServer = async (
	databaseName: string
): Promise<SuperAgentTest> => {
	await createDatabase(databaseName);
	await createDBConnection(databaseName);
	const app = createApp();
	return await getAuthenticatedAgent(app);
};

/**
 * Closes and drops a database, starts the express app and authenticates a test user.
 * @param databaseName The database name to use.
 */
export const stopTestServer = async (databaseName: string): Promise<void> => {
	await getConnection().close();
	await dropDatabase(databaseName);
};
