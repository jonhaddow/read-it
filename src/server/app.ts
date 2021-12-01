import "reflect-metadata";
import express, { Express } from "express";
import { SessionEntity } from "./entities";
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
			origin: process.env.CLIENT_URL,
			credentials: true,
		})
	);

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json()); // for parsing application/json

	// setup session
	app.use(
		session({
			cookie: {
				domain: process.env.COOKIE_DOMAIN,
				maxAge: 1000 * 60 * 60 * 24 * 7 * 4, // 4 weeks
			},
			secret: process.env.SESSION_SECRET || "session_secret",
			resave: false,
			saveUninitialized: false,
			store: new TypeormStore({
				cleanupLimit: 2,
				ttl: 60 * 60 * 24 * 7 * 4, // 4 weeks
			}).connect(getRepository(SessionEntity)),
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
