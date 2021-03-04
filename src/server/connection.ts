import { Connection, createConnection, getConnectionOptions } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { BookmarkEntity, Session, UserEntity } from "./entities";

export const createDBConnection = async (
	name?: string
): Promise<Connection> => {
	// read connection options from ENV variables.
	const connectionOptions = (await getConnectionOptions()) as PostgresConnectionOptions;

	const dbName = name ?? connectionOptions.database;

	return createConnection({
		...connectionOptions,
		type: "postgres",
		entities: [BookmarkEntity, Session, UserEntity],
		logging: ["warn", "error"],
		database: dbName,
		synchronize: true,
		migrations: ["src/server/migration/*.js"],
		cli: {
			migrationsDir: "src/server/migration",
		},
	});
};
