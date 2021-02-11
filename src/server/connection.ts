import config from "config";
import { Connection, createConnection } from "typeorm";
import { BookmarkEntity, Session, UserEntity } from "./entities";

export const createDBConnection = (name?: string): Promise<Connection> => {
	const dbName = name ?? config.get<string>("db_config.database");

	return createConnection({
		type: "postgres",
		entities: [BookmarkEntity, Session, UserEntity],
		synchronize: true,
		logging: ["warn", "error"],
		...config.get("db_config"),
		database: dbName,
	});
};
