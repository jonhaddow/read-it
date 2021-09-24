import { getEmitter } from "../events";
import { advancedMetadata } from "./advancedMetadata";

export const registerSubscribers = (): void => {
	getEmitter().on("addBookmark", advancedMetadata);
};

export const deregisterSubscribers = (): void => {
	getEmitter().off("addBookmark", advancedMetadata);
};
