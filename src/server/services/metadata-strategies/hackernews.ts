import { Bookmark } from "core/models";
import { AdvancedMetadataProps, IMetadataStrategy, MetadataProps } from ".";
import fetch from "node-fetch";
import { estimateReadingTime, openWebpage } from "../puppeteer";

const LINK_REGEXES: RegExp[] = [/news\.ycombinator\.com\/item\?id=(.*)/];

/**
 * A metadata strategy for handling HackerNews urls (https://news.ycombinator.com/)
 */
export class HackerNewsStrategy implements IMetadataStrategy {
	shouldProcess(bookmark: Readonly<Bookmark>): boolean {
		return LINK_REGEXES.some((x) => x.test(bookmark.url));
	}

	async getMetadata(url: string): Promise<MetadataProps> {
		try {
			const match = url.match(LINK_REGEXES[0]);

			if (!match) {
				throw new Error("Could not match url");
			}

			const id = match[1];

			if (!id) {
				throw new Error("Could not find id in url");
			}

			// Retrieve the title and target url
			const response = await fetch(
				`https://hacker-news.firebaseio.com/v0/item/${id}.json`
			);
			const data = await response.json();
			return {
				title: data.title,
				targetURL: data.url,
				specialType: "hacker-news",
			};
		} catch (error) {
			console.error(error);
			return {};
		}
	}

	async getAdvancedMetadata(url: string): Promise<AdvancedMetadataProps> {
		let minuteEstimate: number | undefined = undefined;

		const page = await openWebpage(url);
		if (page) minuteEstimate = await estimateReadingTime(page);

		return {
			minuteEstimate,
		};
	}
}
