import { createServer } from "http";

const hostname = "0.0.0.0";
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/plain");
	res.end("Hello, World!\n");
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
