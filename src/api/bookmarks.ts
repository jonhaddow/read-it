import express from "express";
import { getBookmarks } from "../services";

const router = express.Router();

router.get("/", async (req, res) => {
	const bookmarksResponse = await getBookmarks();

	if (!bookmarksResponse.isSuccess) {
		res
			.status(bookmarksResponse.statusCode ?? 500)
			.send(bookmarksResponse.error);
	}

	res.send(bookmarksResponse.body);
});

export { router as bookmarksRouter };
