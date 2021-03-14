import { ElementHandle, EvaluateFn, Page } from "puppeteer";
import readingTime from "reading-time";

type MetadataType = "title" | "description" | "thumbnail";
interface ElementChecker {
	selector: string;
	extractor: (node: Element) => string | null | undefined;
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
			extractor: (node) => node.getAttribute("content"),
		},
		{
			selector: `title`,
			extractor: (node) => node.textContent,
		},
	],
	description: [
		{
			selector: `meta[property="og:description"]`,
			extractor: (node) => node.getAttribute("content"),
		},
		{
			selector: `meta[name="description"]`,
			extractor: (node) => node.getAttribute("content"),
		},
	],
	thumbnail: [
		{
			selector: `meta[property="og:image"]`,
			extractor: (node) => node.getAttribute("content"),
		},
		{
			selector: `meta[name="image"]`,
			extractor: (node) => node.getAttribute("content"),
		},
	],
};

/**
 * Finds the appropriate metadata from a Puppeteer webpage.
 */
export const findMetadata = async (
	type: MetadataType,
	page: Page
): Promise<string | undefined> => {
	for (const { extractor, selector } of ELEMENT_MATCHERS[type]) {
		const el = await page.$(selector);
		if (el) {
			const content = await el.evaluate(extractor);
			if (content) return content;
		}
	}

	console.log(`Failed to find a suitable ${type}.`);
};

/**
 * Estimates the reading time (in minutes) for the body of a Puppeteer webpage.
 */
export const estimateReadingTime = async (
	page: Page
): Promise<number | undefined> => {
	let results: number | undefined = undefined;
	const body = (await page.$("body")) as ElementHandle<HTMLElement>;
	if (body) {
		const text = await body.evaluate<EvaluateFn<HTMLElement>>(
			(b) => b.innerText
		);
		results = readingTime(text).minutes;
	}

	return results;
};
