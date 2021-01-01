import { Bookmark } from "../entities";
import { eventEmitter } from "../server";
import fetch from "node-fetch";

const populateBookmark = async (data: Bookmark): Promise<void> => {
	try {
		const response = await fetch(data.url);
		await response.text();

		// TODO: Parse HTML for title and description
	} catch (ex) {
		console.error("Failed to fetch the URL.", ex);
	}
};

eventEmitter.on("addBookmark", populateBookmark);
eventEmitter.on("updateBookmark", populateBookmark);
