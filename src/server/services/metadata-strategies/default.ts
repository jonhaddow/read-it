import { Bookmark } from "core/models";
import { AdvancedMetadataProps, IMetadataStrategy, MetadataProps } from ".";
import { estimateReadingTime, openWebpage } from "../../services/puppeteer";
import { findAllMetadata } from "../metadata-parser";
import fetch from "node-fetch";

/**
 * The default strategy for bookmarks.
 * Each link is opened in a headless browser and the metadata is abstracted
 * from open graph and meta tags.
 */
export class DefaultStrategy implements IMetadataStrategy {
	async getMetadata(bookmark: Readonly<Bookmark>): Promise<MetadataProps> {
		try {
			const response = await fetch(bookmark.url);
			const html = await response.text();

			return findAllMetadata(html);
		} catch (ex) {
			console.error(`Failed to fetch html from url ${bookmark.url}`);
			console.error(ex);
			return {};
		}
	}

	async getAdvancedMetadata(
		bookmark: Readonly<Bookmark>
	): Promise<AdvancedMetadataProps> {
		const page = await openWebpage(bookmark.url);
		if (!page) {
			return {};
		}
		return {
			minuteEstimate: await estimateReadingTime(page),
		};
	}
}
