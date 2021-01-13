import { Bookmark, BookmarkState } from "../entities";
import { ElementHandle, Page } from "puppeteer";
import { getRepository } from "typeorm";
import { getBrowser } from "../services";
import readingTime from "reading-time";

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

const getReadingTime = async (page: Page): Promise<number | null> => {
	let results: number | null = null;
	const body = (await page.$("body")) as ElementHandle<HTMLElement>;
	if (body) {
		const text = await body.evaluate((b) => b.innerText);
		results = readingTime(text).minutes;
	}

	return results;
};

export const populateBookmark = async (bookmark: Bookmark): Promise<void> => {
	try {
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

		await page.goto(bookmark.url);

		const title = await getTitle(page);
		if (title) bookmark.title = title;

		const description = await getDescription(page);
		if (description) bookmark.description = description;

		const minuteEstimate = await getReadingTime(page);
		if (minuteEstimate) bookmark.minuteEstimate = minuteEstimate;

		bookmark.state = BookmarkState.PROCESSED;

		await getRepository(Bookmark).save(bookmark);
	} catch (ex) {
		console.error("Failed to populate bookmarks", ex);
	}
};
