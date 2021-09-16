import { getEmitter } from "../events";
import { advancedMetadata } from "./advancedMetadata";

export const registerSubscribers = (): void => {
	getEmitter().on("addBookmark", advancedMetadata);
	getEmitter().on("updateBookmark", advancedMetadata);
};

export const deregisterSubscribers = (): void => {
	getEmitter().off("addBookmark", advancedMetadata);
	getEmitter().off("updateBookmark", advancedMetadata);
};
