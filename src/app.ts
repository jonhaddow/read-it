import express from "express";
import { bookmarksRouter } from "./api";

const app = express();

const hostname = "0.0.0.0";
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use("/api/bookmarks", bookmarksRouter);

app.listen(port, hostname, () => {
	console.log(`Express server running at http://${hostname}:${port}/`);
});
