import {
	AdvancedMetadataProps,
	IDefaultMetadataStrategy,
	MetadataProps,
} from ".";
import { estimateReadingTime, openWebpage } from "../../services/puppeteer";
import { findAllMetadata } from "../metadata-parser";
import fetch from "node-fetch";

/**
 * The default strategy for bookmarks.
 * The raw HTML is fetched and processed to retrieve the metadata
 * from open graph and meta tags.
 */
export class DefaultStrategy implements IDefaultMetadataStrategy {
	async getMetadata(url: string): Promise<MetadataProps> {
		try {
			const response = await fetch(url);
			const html = await response.text();

			return findAllMetadata(html, url);
		} catch (ex) {
			console.error(`Failed to fetch html from url ${url}`);
			console.error(ex);
			return {};
		}
	}

	async getAdvancedMetadata(url: string): Promise<AdvancedMetadataProps> {
		const page = await openWebpage(url);
		if (!page) {
			return {};
		}
		return {
			minuteEstimate: await estimateReadingTime(page),
		};
	}
}
