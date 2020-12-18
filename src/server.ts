import config from "config";
import express, { NextFunction, Request, Response } from "express";
import { createConnection } from "typeorm";
import { Bookmark } from "./entities";
import { AppRoutes } from "./routes";

export const startServer = async (): Promise<void> => {
	try {
		await createConnection({
			type: "postgres",
			entities: [Bookmark],
			synchronize: true,
			logging: ["warn", "error"],
			...config.get("db_config"),
		});

		const app = express();

		const hostname = "0.0.0.0";
		const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

		// register all application routes
		AppRoutes.forEach((route) => {
			app[route.method](
				route.path,
				// eslint-disable-next-line @typescript-eslint/no-misused-promises -- Express support async handlers.
				async (
					request: Request,
					response: Response,
					next: NextFunction
				): Promise<void> => {
					try {
						await route.action(request, response);
						next();
					} catch (err) {
						next(err);
					}
				}
			);
		});

		app.listen(port, hostname, () => {
			console.log(`Express server running at http://${hostname}:${port}/`);
		});
	} catch (ex) {
		console.error(ex);
	}
};
