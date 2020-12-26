import config from "config";
import express from "express";
import { createConnection } from "typeorm";
import { Bookmark, Session, User } from "./entities";
import { authRouter, bookmarksRouter } from "./api";
import { setupPassport } from "./utils";
import { homeRouter } from "./controllers";
import session from "express-session";
import { TypeormStore } from "connect-typeorm/out";
import { isAuthenticated } from "./middleware";

export const startServer = async (): Promise<void> => {
	try {
		const connection = await createConnection({
			type: "postgres",
			entities: [Bookmark, Session, User],
			synchronize: true,
			logging: ["warn", "error"],
			...config.get("db_config"),
		});

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
				}).connect(connection.getRepository(Session)),
			})
		);

		// Setup auth middleware
		setupPassport(app);
		app.use(authRouter);

		// API routes
		app.use("/api/bookmarks", isAuthenticated, bookmarksRouter);

		// Controller routes
		app.use(homeRouter);

		const hostname = "0.0.0.0";
		const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
		app.listen(port, hostname, () => {
			console.log(`Express server running at http://${hostname}:${port}/`);
		});
	} catch (ex) {
		console.error(ex);
	}
};
