import config from "config";
import { Connection, createConnection } from "typeorm";
import { Bookmark, Session, User } from "./entities";

export const createDBConnection = (name?: string): Promise<Connection> => {
	const dbName = name ?? config.get<string>("db_config.database");
	return createConnection({
		type: "postgres",
		entities: [Bookmark, Session, User],
		synchronize: true,
		logging: ["warn", "error"],
		...config.get("db_config"),
		database: dbName,
	});
};
