import { ElementHandle, EvaluateFn, Page } from "puppeteer";
import readingTime from "reading-time";

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
