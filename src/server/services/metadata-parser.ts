import { JSDOM } from "jsdom";

type MetadataType = "title" | "description" | "thumbnail";
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
	thumbnail: [
		{
			selector: `meta[property="og:image"]`,
			extractor: (el) => el.getAttribute("content"),
		},
		{
			selector: `meta[name="image"]`,
			extractor: (el) => el.getAttribute("content"),
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

	console.log(`Failed to find a suitable ${type}.`);
};

/**
 * Finds metadata given a html string.
 */
export function findAllMetadata(
	html: string
): {
	[key in MetadataType]: string | undefined;
} {
	const dom = new JSDOM(html);

	return {
		title: findMetadata("title", dom),
		description: findMetadata("description", dom),
		thumbnail: findMetadata("thumbnail", dom),
	};
}
