import { getEmitter } from "../events";
import { populateBookmark } from "./populateBookmark";

export const registerSubscribers = (): void => {
	getEmitter().on("addBookmark", populateBookmark);
	getEmitter().on("updateBookmark", populateBookmark);
};
