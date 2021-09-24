import { Bookmark } from "core/models";
import { JSDOM } from "jsdom";

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
export const findMetadata = (
	type: MetadataType,
	dom: JSDOM
): string | undefined => {
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
export function findAllMetadata(
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
	if (favicon?.startsWith("/")) {
		favicon = `${new URL(url).origin}${favicon}`;
	} else if (favicon == undefined) {
		favicon = `${new URL(url).origin}/favicon.ico`;
	}

	return {
		title,
		description,
		thumbnailUrl,
		favicon,
	};
}
