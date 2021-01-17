import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";
import readingTime from "reading-time";
import { MetadataProps } from "../subscribers/metadata-strategies";

let instance: Browser | null = null;

/**
 * Get a single puppeteer browser instance.
 */
export const getBrowser = async (): Promise<Browser> => {
	if (!instance) {
		instance = await puppeteer.launch({
			args: ["--no-sandbox", "--disable-gpu"],
		});
	}
	return instance;
};

/**
 * Close the single puppeteer browser instance.
 */
export const closeBrowser = async (): Promise<void> => {
	if (instance) {
		await instance.close();
	}
};

const getTitle = async (page: Page): Promise<string | undefined> => {
	let titleEl = await page.$('[property="og:title"]');
	if (titleEl) {
		const titleContent = await titleEl.evaluate((node) =>
			node.getAttribute("content")
		);
		if (titleContent) return titleContent;
	}
	titleEl = await page.$("title");
	if (titleEl) {
		const titleContent = await titleEl.evaluate((node) => node.textContent);
		if (titleContent) return titleContent;
	}
	console.log("Failed to find a suitable description.");
};

const getDescription = async (page: Page): Promise<string | undefined> => {
	const descriptionEl = await page.$('[property="og:description"]');
	if (descriptionEl) {
		const descriptionContent = await descriptionEl.evaluate((node) =>
			node.getAttribute("content")
		);
		if (descriptionContent) return descriptionContent;
	}

	console.log("Failed to find a suitable description.");
};

const getReadingTime = async (page: Page): Promise<number | undefined> => {
	let results: number | undefined = undefined;
	const body = (await page.$("body")) as ElementHandle<HTMLElement>;
	if (body) {
		const text = await body.evaluate((b) => b.innerText);
		results = readingTime(text).minutes;
	}

	return results;
};

export const getMetadata = async (url: string): Promise<MetadataProps> => {
	const browser = await getBrowser();
	const page = await browser.newPage();

	// Disable requests for images
	await page.setRequestInterception(true);
	page.on("request", async (request) => {
		if (request.resourceType() === "image") {
			await request.abort();
		} else {
			await request.continue();
		}
	});

	await page.goto(url);

	return {
		title: await getTitle(page),
		description: await getDescription(page),
		minuteEstimate: await getReadingTime(page),
	};
};
