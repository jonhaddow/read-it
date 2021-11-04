import { Connection, createConnection, getConnectionOptions } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const createDBConnection = async (
	name?: string
): Promise<Connection> => {
	// read connection options from ENV variables.
	const connectionOptions =
		(await getConnectionOptions()) as PostgresConnectionOptions;

	const dbName = name ?? connectionOptions.database;

	return createConnection({
		...connectionOptions,
		database: dbName,
	});
};
