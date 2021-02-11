import { Bookmark } from "core/models";
import { DefaultStrategy } from "./default";
import { RedditStrategy } from "./reddit";

export type MetadataProps = Pick<
	Bookmark,
	| "title"
	| "description"
	| "minuteEstimate"
	| "specialType"
	| "targetURL"
	| "thumbnailUrl"
>;

export interface IMetadataStrategy {
	/**
	 * Determines whether the strategy should process this particular bookmark.
	 */
	shouldProcess?(bookmark: Readonly<Bookmark>): boolean;

	/**
	 * Gets the provided bookmarks metadata and updates the bookmark
	 */
	getMetadata(bookmark: Readonly<Bookmark>): Promise<MetadataProps>;
}

export const getStrategies = (): IMetadataStrategy[] => [new RedditStrategy()];

export const getDefaultStrategy = (): IMetadataStrategy =>
	new DefaultStrategy();
