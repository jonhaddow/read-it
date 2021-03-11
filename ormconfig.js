module.exports = {
	type: "postgres",

	host: process.env.DB_HOST || "localhost",
	database: process.env.DB_NAME || "postgres",
	username: process.env.DB_USER || "postgres",
	password: process.env.DB_PASS || "postgres",
	port: process.env.DB_PORT || 5432,

	entities: ["./src/server/entities/*.ts"],
	migrations: ["./src/server/migrations/*.js"],
	migrationsRun: true,

	logging: ["error", "warn"],

	cli: {
		entitiesDir: "./src/server/entities",
		migrationsDir: "./src/server/migrations",
	},
};
