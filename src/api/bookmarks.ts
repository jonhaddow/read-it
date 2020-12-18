import { Request, Response } from "express";
import { getBookmarks } from "../services";

export const getBookmarksApi = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const bookmarksResponse = await getBookmarks();
		res.json(bookmarksResponse);
	} catch (ex) {
		console.error(ex);
		res.status(500).send("Failed to get bookmarks");
	}
};
