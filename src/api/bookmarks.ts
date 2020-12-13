import express from "express";
import { getBookmarks } from "../services";
const router = express.Router();

router.get("/", async (req, res) => {
	const results = await getBookmarks();

	res.send(results);
});

export { router as bookmarksRouter };
