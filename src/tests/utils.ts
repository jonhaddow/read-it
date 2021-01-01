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
 * Add user to database with the details provided.
 * @param email The email to use.
 * @param password The password to use.
 */
export const addUserToDatabase = async (
	email: string,
	password: string
): Promise<void> => {
	const user = new User(email);
	user.hashedPassword = await hash(password, 10);
	await getRepository(User).insert(user);
};

/**
 * Logins in with the agent and credentials provided.
 * @param agent The super agent to use.
 * @param email The email to use.
 * @param password The password to use.
 */
export const login = async (
	agent: SuperAgentTest,
	email: string,
	password: string
): Promise<void> => {
	await agent
		.post("/login")
		.send({ username: email, password: password })
		.set("Accept", "application/json");
};

/**
 * Create a Super Agent authenticated with the app and credentials provided.
 * @param app The express app to authenticate with.
 * @param email The email to use.
 * @param password The password to use.
 */
export const createSuperAgent = async (
	app: Express,
	email = "test_user@email.com",
	password = "testPassword"
): Promise<SuperAgentTest> => {
	await addUserToDatabase(email, password);

	const agent = request.agent(app);

	await login(agent, email, password);

	return agent;
};

/**
 * Creates and connects to a database and starts the express app.
 * @param databaseName The database name to use.
 */
export const startTestServer = async (
	databaseName: string
): Promise<Express> => {
	await createDatabase(databaseName);
	await createDBConnection(databaseName);
	return createApp();
};

/**
 * Closes and drops a database.
 * @param databaseName The database name to use.
 */
export const stopTestServer = async (databaseName: string): Promise<void> => {
	await getConnection().close();
	await dropDatabase(databaseName);
};
