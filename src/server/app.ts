import "reflect-metadata";
import config from "config";
import express, { Express } from "express";
import { Session } from "./entities";
import { authRouter, bookmarksRouter, userRouter } from "./api";
import { setupPassport } from "./utils";
import session from "express-session";
import { TypeormStore } from "connect-typeorm/out";
import { isAuthenticated } from "./middleware";
import { getRepository } from "typeorm";
import cors from "cors";

export const createApp = (): Express => {
	const app = express();

	app.use(
		cors({
			origin: config.get<string>("client_url"),
			credentials: true,
		})
	);

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json()); // for parsing application/json

	// setup session
	app.use(
		session({
			cookie: {
				domain: config.get("cookie_domain"),
			},
			secret: config.get("session_secret"),
			resave: false,
			saveUninitialized: false,
			store: new TypeormStore({
				cleanupLimit: 2,
				ttl: 86400,
			}).connect(getRepository(Session)),
		})
	);

	// Setup auth middleware
	setupPassport(app);
	app.use(authRouter);

	// API routes
	app.use("/api/bookmarks", isAuthenticated, bookmarksRouter);
	app.use("/api/users", isAuthenticated, userRouter);

	return app;
};
