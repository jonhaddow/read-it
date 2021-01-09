import { Router } from "express";
import { Bookmark, User } from "../entities";
import {
	addBookmark,
	deleteBookmark,
	getBookmark,
	getBookmarks,
	updateBookmark,
} from "../services";

export const bookmarksRouter = Router();

bookmarksRouter.get(
	"/",
	async (req, res): Promise<void> => {
		try {
			const user = req.user as User;
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
	}
);

bookmarksRouter.post(
	"/",
	async (req, res): Promise<void> => {
		try {
			const bookmark = Object.assign(new Bookmark(), req.body) as Bookmark;

			const validateResult = bookmark.validate();
			if (validateResult.error) {
				res.status(400).send(validateResult.error);
				return;
			}

			const user = req.user as User;
			const response = await addBookmark(user, req.body);
			res.status(201).json(response);
		} catch (ex) {
			console.error(ex);
			res.status(500).send("Failed to add bookmark");
		}
	}
);

bookmarksRouter.put(
	"/:id",
	async (req, res): Promise<void> => {
		try {
			if (!req.params.id) {
				res.status(400).send("Bookmark ID required");
				return;
			}
			const id = parseInt(req.params.id);

			const bookmark = Object.assign(new Bookmark(), req.body) as Bookmark;
			bookmark.id = id;
			const validateResult = bookmark.validate();
			if (validateResult.error) {
				res.status(400).send(validateResult.error);
				return;
			}

			const user = req.user as User;

			// Check the entity exists for the current user
			const currentBookmark = await getBookmark(user, id);
			if (!currentBookmark) {
				res.status(404).end();
				return;
			}

			const updatedBookmark = await updateBookmark(user, bookmark);
			res.json(updatedBookmark);
		} catch (ex) {
			console.error(ex);
			res.status(500).send("Failed to update bookmark");
		}
	}
);

bookmarksRouter.delete(
	"/:id",
	async (req, res): Promise<void> => {
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
	}
);
