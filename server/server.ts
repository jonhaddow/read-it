import { createApp } from "./app";
import { createDBConnection } from "./connection";
import { registerSubscribers } from "./subscribers";

void (async () => {
	await createDBConnection();

	const app = createApp();

	// Register subscribers outside of app creation to prevent
	// long running asynchronous tasks during integration tests.
	registerSubscribers();

	const hostname = "0.0.0.0";
	const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
	app.listen(port, hostname, () => {
		console.log(`Express server running at http://${hostname}:${port}/`);
	});
})();
