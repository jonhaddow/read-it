import { Bookmark, BookmarkState } from "../entities";
import puppeteer from "puppeteer";
import { getRepository } from "typeorm";

const getTitle = async (page: puppeteer.Page): Promise<string | undefined> => {
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

const getDescription = async (
	page: puppeteer.Page
): Promise<string | undefined> => {
	const descriptionEl = await page.$('[property="og:description"]');
	if (descriptionEl) {
		const descriptionContent = await descriptionEl.evaluate((node) =>
			node.getAttribute("content")
		);
		if (descriptionContent) return descriptionContent;
	}

	console.log("Failed to find a suitable description.");
};

export const populateBookmark = async (bookmark: Bookmark): Promise<void> => {
	let browser: puppeteer.Browser | undefined = undefined;
	try {
		browser = await puppeteer.launch({ args: ["--no-sandbox"] });
		const page = await browser.newPage();
		await page.goto(bookmark.url);

		const title = await getTitle(page);
		if (title) bookmark.title = title;

		const description = await getDescription(page);
		if (description) bookmark.description = description;

		bookmark.state = BookmarkState.PROCESSED;

		await getRepository(Bookmark).save(bookmark);
	} catch (ex) {
		console.error("Failed to populate bookmarks", ex);
	} finally {
		await browser?.close();
	}
};
