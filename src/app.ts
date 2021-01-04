import "reflect-metadata";
import config from "config";
import express, { Express } from "express";
import { Session } from "./entities";
import { authRouter, bookmarksRouter } from "./api";
import { setupPassport } from "./utils";
import { homeRouter } from "./controllers";
import session from "express-session";
import { TypeormStore } from "connect-typeorm/out";
import { isAuthenticated } from "./middleware";
import { getRepository } from "typeorm";

export const createApp = (): Express => {
	const app = express();

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json()); // for parsing application/json

	// View engine setup
	app.set("view engine", "ejs");
	app.set("views", "./src/views");

	// setup session
	app.use(
		session({
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

	// Controller routes
	app.use(homeRouter);

	return app;
};
