import {
	AdvancedMetadataProps,
	IDefaultMetadataStrategy,
	MetadataProps,
} from ".";
import { estimateReadingTime, openWebpage } from "../../services/puppeteer";
import fetch from "node-fetch";
import { Bookmark } from "core/models";
import { JSDOM } from "jsdom";

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

type MetadataType = keyof Pick<
	Bookmark,
	"title" | "description" | "thumbnailUrl" | "favicon"
>;

interface ElementChecker {
	selector: string;
	extractor: (el: Element) => string | null | undefined;
}

/**
 * A register of metadata types along with a collection of element selectors
 * and a methods to extract text content from them.
 *
 * Each array of matchers is ordered by most recommended (or most popular) selectors first.
 *
 */
const ELEMENT_MATCHERS: {
	[key in MetadataType]: ElementChecker[];
} = {
	title: [
		{
			selector: `meta[property="og:title"]`,
			extractor: (el) => el.getAttribute("content"),
		},
		{
			selector: `title`,
			extractor: (el) => el.textContent,
		},
	],
	description: [
		{
			selector: `meta[property="og:description"]`,
			extractor: (el) => el.getAttribute("content"),
		},
		{
			selector: `meta[name="description"]`,
			extractor: (el) => el.getAttribute("content"),
		},
	],
	thumbnailUrl: [
		{
			selector: `meta[property="og:image"]`,
			extractor: (el) => el.getAttribute("content"),
		},
		{
			selector: `meta[name="image"]`,
			extractor: (el) => el.getAttribute("content"),
		},
	],
	favicon: [
		{
			selector: `link[rel="icon"],link[rel="shortcut icon"]`,
			extractor: (el) => el.getAttribute("href"),
		},
	],
};

/**
 * Finds the appropriate metadata from a html string.
 */
const findMetadata = (type: MetadataType, dom: JSDOM): string | undefined => {
	for (const { extractor, selector } of ELEMENT_MATCHERS[type]) {
		const el = dom.window.document.querySelector(selector);
		if (el) {
			const content = extractor(el);
			if (content) return content;
		}
	}
};

/**
 * Finds metadata given a html string.
 */
function findAllMetadata(
	html: string,
	url: string
): {
	[key in MetadataType]: string | undefined;
} {
	const dom = new JSDOM(html);

	const title = findMetadata("title", dom);
	const description = findMetadata("description", dom);
	const thumbnailUrl = findMetadata("thumbnailUrl", dom);

	let favicon = findMetadata("favicon", dom);
	if (favicon) {
		// Ensure favicon is a full valid URL
		if (favicon.startsWith("//")) {
			favicon = `https:${favicon}`;
		}
		try {
			const url = new URL(favicon);
			favicon = url.href;
		} catch (_) {
			favicon = `${new URL(url).origin}${favicon}`;
		}
	} else {
		favicon = `${new URL(url).origin}/favicon.ico`;
	}

	return {
		title,
		description,
		thumbnailUrl,
		favicon,
	};
}
