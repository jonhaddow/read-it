import { Bookmark } from "core/models";
import { IMetadataStrategy, MetadataProps } from ".";
import {
	estimateReadingTime,
	findMetadata,
	openWebpage,
} from "../../services/puppeteer";

/**
 * The default strategy for bookmarks.
 * Each link is opened in a headless browser and the metadata is abstracted
 * from open graph and meta tags.
 */
export class DefaultStrategy implements IMetadataStrategy {
	async getMetadata(bookmark: Readonly<Bookmark>): Promise<MetadataProps> {
		const page = await openWebpage(bookmark.url);
		if (!page) {
			return {};
		}
		return {
			title: await findMetadata("title", page),
			description: await findMetadata("description", page),
			thumbnailUrl: await findMetadata("thumbnail", page),
			minuteEstimate: await estimateReadingTime(page),
		};
	}
}
