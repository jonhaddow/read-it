import { Router } from "express";
import { Bookmark, User } from "../entities";
import { addBookmark, getBookmark, getBookmarks } from "../services";

export const bookmarksRouter = Router();

bookmarksRouter.get(
	"/",
	async (req, res): Promise<void> => {
		const user = req.user as User;
		try {
			const bookmarks = await getBookmarks(user);
			res.json(bookmarks);
		} catch (ex) {
			console.error(ex);
			res.status(500).send("Failed to get bookmarks");
		}
	}
);

bookmarksRouter.get(
	"/:id",
	async (req, res): Promise<void> => {
		if (!req.params.id) {
			res.status(400).send("Bookmark ID required");
		}

		const id = parseInt(req.params.id);
		const user = req.user as User;
		try {
			const bookmark = await getBookmark(user, id);
			if (!bookmark) {
				res.status(404);
			}
			res.json(bookmark);
		} catch (ex) {
			console.error(ex);
			res.status(500).send("Failed to get bookmark");
		}
	}
);

bookmarksRouter.post(
	"/",
	async (req, res): Promise<void> => {
		// URL validation
		const bookmark = req.body as Bookmark;
		if (!bookmark.url) {
			res.status(400).send("Bookmark URL required");
		}
		try {
			new URL(bookmark.url);
		} catch (_) {
			res.status(400).send("Invalid URL");
		}

		const user = req.user as User;
		try {
			const response = await addBookmark(user, req.body);
			res.json(response);
		} catch (ex) {
			console.error(ex);
			res.status(500).send("Failed to add bookmark");
		}
	}
);
