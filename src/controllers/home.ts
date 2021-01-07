import { Router } from "express";
import { User } from "../entities";
import { getBookmarks } from "../services";

export const homeRouter = Router();

homeRouter.get(
	"/",
	async (req, res): Promise<void> => {
		if (!req.isAuthenticated()) {
			res.redirect("/login");
		}

		const bookmarks = await getBookmarks(req.user as User);

		res.render("home", { bookmarks: bookmarks.results });
	}
);

homeRouter.get("/login", (req, res): void => {
	res.render("login");
});
