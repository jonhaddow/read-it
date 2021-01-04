import { createApp } from "./app";
import { createDBConnection } from "./connection";

void (async () => {
	await createDBConnection();

	const app = createApp();

	const hostname = "0.0.0.0";
	const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
	app.listen(port, hostname, () => {
		console.log(`Express server running at http://${hostname}:${port}/`);
	});
})();
