import { Bookmark, User } from "core/models";
import { Router } from "express";
import {
	addBookmark,
	deleteBookmark,
	getBookmark,
	getBookmarks,
} from "../services";

export const bookmarksRouter = Router();

bookmarksRouter.get("/", async (req, res): Promise<void> => {
	try {
		const user = req.user as User;
		const bookmarks = await getBookmarks(user);
		res.json(bookmarks);
	} catch (ex) {
		console.error(ex);
		res.status(500).send("Failed to get bookmarks");
	}
});

bookmarksRouter.get("/:id", async (req, res): Promise<void> => {
	try {
		if (!req.params.id) {
			res.status(400).send("Bookmark ID required");
			return;
		}

		const id = parseInt(req.params.id);
		const user = req.user as User;
		const bookmark = await getBookmark(user, id);
		if (!bookmark) {
			res.status(404).end();
			return;
		}
		res.json(bookmark);
	} catch (ex) {
		console.error(ex);
		res.status(500).send("Failed to get bookmark");
	}
});

bookmarksRouter.post("/", async (req, res): Promise<void> => {
	try {
		const bookmark = req.body as Bookmark;

		const user = req.user as User;
		const response = await addBookmark(user, bookmark);

		if (!response.isSuccess()) {
			res.status(response.status).send(response.error);
			return;
		}

		res.status(response.status).json(response.body);
	} catch (ex) {
		console.error(ex);
		res.status(500).send("Failed to add bookmark");
	}
});

bookmarksRouter.delete("/:id", async (req, res): Promise<void> => {
	try {
		if (!req.params.id) {
			res.status(400).send("Bookmark ID required");
			return;
		}
		const id = parseInt(req.params.id);

		const user = req.user as User;

		await deleteBookmark(user, id);

		res.status(204).end();
	} catch (ex) {
		console.error(ex);
		res.status(500).send("Failed to delete bookmark");
	}
});
