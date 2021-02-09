import { getEmitter } from "../events";
import { populateBookmark } from "./populateBookmark";

export const registerSubscribers = (): void => {
	getEmitter().on("addBookmark", populateBookmark);
	getEmitter().on("updateBookmark", populateBookmark);
};

export const deregisterSubscribers = (): void => {
	getEmitter().off("addBookmark", populateBookmark);
	getEmitter().off("updateBookmark", populateBookmark);
};
