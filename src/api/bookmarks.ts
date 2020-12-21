import { Router } from "express";
import { getBookmarks } from "../services";

export const bookmarksRouter = Router();

bookmarksRouter.get(
	"/api/bookmarks",
	async (req, res): Promise<void> => {
		try {
			const bookmarksResponse = await getBookmarks();
			res.json(bookmarksResponse);
		} catch (ex) {
			console.error(ex);
			res.status(500).send("Failed to get bookmarks");
		}
	}
);
