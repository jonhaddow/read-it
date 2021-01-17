import { Bookmark } from "../../entities";
import { Metadata } from "../../interfaces";
import { DefaultStrategy } from "./default";
import { RedditStrategy } from "./reddit";

export interface IMetadataStrategy {
	/**
	 * Determines whether the strategy should process this particular bookmark.
	 */
	shouldProcess?(bookmark: Bookmark): boolean;

	/**
	 * Gets the provided bookmarks metadata and updates the bookmark
	 */
	getMetadata(bookmark: Readonly<Bookmark>): Promise<Metadata>;
}

export const getStrategies = (): IMetadataStrategy[] => [new RedditStrategy()];

export const getDefaultStrategy = (): IMetadataStrategy =>
	new DefaultStrategy();
