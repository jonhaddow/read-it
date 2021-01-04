import { Bookmark } from "../entities";
import fetch from "node-fetch";
import { getEmitter } from "../events";

const populateBookmark = async (data: Bookmark): Promise<void> => {
	try {
		const response = await fetch(data.url);
		await response.text();

		// TODO: Parse HTML for title and description
	} catch (ex) {
		console.error("Failed to fetch the URL.", ex);
	}
};

getEmitter().on("addBookmark", populateBookmark);
getEmitter().on("updateBookmark", populateBookmark);
