const dev = {
	entities: ["src/server/entities/*.ts"],
	migrations: ["src/server/migrations/*.js"],
};

const prod = {
	entities: ["dist/server/entities/*.js"],
	migrations: ["dist/server/migrations/*.js"],
};

const isTS =
	process[Symbol.for("ts-node.register.instance")] ||
	process.env.JEST_WORKER_ID;

module.exports = Object.assign(
	{
		type: "postgres",

		host: process.env.DB_HOST || "localhost",
		database: process.env.DB_NAME || "postgres",
		username: process.env.DB_USER || "postgres",
		password: process.env.DB_PASS || "postgres",
		port: process.env.DB_PORT || 5432,

		migrationsRun: true,
		logging: ["error", "warn"],
		cli: {
			entitiesDir: "./src/server/entities",
			migrationsDir: "./src/server/migrations",
		},
	},
	isTS ? dev : prod
);
