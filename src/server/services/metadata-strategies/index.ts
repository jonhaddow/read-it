import { Bookmark } from "core/models";
import { DefaultStrategy } from "./default";
import { HackerNewsStrategy } from "./hackernews";
import { RedditStrategy } from "./reddit";

export type MetadataProps = Pick<
	Bookmark,
	| "title"
	| "description"
	| "specialType"
	| "targetURL"
	| "thumbnailUrl"
	| "favicon"
>;

export type AdvancedMetadataProps = Pick<Bookmark, "minuteEstimate">;

export interface IMetadataStrategy {
	/**
	 * Determines whether the strategy should process this particular bookmark.
	 */
	shouldProcess(bookmark: Readonly<Bookmark>): boolean;

	/**
	 * Gets the metadata given a URL.
	 */
	getMetadata(url: string): Promise<MetadataProps>;

	/**
	 * Gets the advanced metadata given a URL.
	 */
	getAdvancedMetadata(url: string): Promise<AdvancedMetadataProps>;

	/**
	 * Gets the favicon to use for this type of link.
	 */
	favicon(): string;
}
export type IDefaultMetadataStrategy = Omit<
	IMetadataStrategy,
	"shouldProcess" | "favicon"
>;

export const getStrategies = (): IMetadataStrategy[] => [
	new RedditStrategy(),
	new HackerNewsStrategy(),
];

export const getDefaultStrategy = (): IDefaultMetadataStrategy =>
	new DefaultStrategy();
