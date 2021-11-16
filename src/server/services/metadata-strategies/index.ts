import { Bookmark } from "core/models";
import { DefaultStrategy } from "./default";
import { HackerNewsStrategy } from "./hackernews";
import { RedditStrategy } from "./reddit";
import { YouTubeStrategy } from "./youtube";

export type MetadataProps = Partial<
	Pick<
		Bookmark,
		| "title"
		| "description"
		| "specialType"
		| "targetURL"
		| "thumbnailUrl"
		| "minuteEstimate"
		| "favicon"
	>
>;

export type AdvancedMetadataProps = Partial<Pick<Bookmark, "minuteEstimate">>;

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
	getAdvancedMetadata?(url: string): Promise<AdvancedMetadataProps>;
}
export type IDefaultMetadataStrategy = Omit<
	IMetadataStrategy,
	"shouldProcess" | "favicon"
>;

export const getStrategies = (): IMetadataStrategy[] => [
	new RedditStrategy(),
	new HackerNewsStrategy(),
	new YouTubeStrategy(),
];

export const getDefaultStrategy = (): IDefaultMetadataStrategy =>
	new DefaultStrategy();
