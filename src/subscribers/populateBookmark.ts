import { Bookmark } from "../entities";
import puppeteer from "puppeteer";
import { getRepository } from "typeorm";

export const populateBookmark = async (bookmark: Bookmark): Promise<void> => {
	const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
	const page = await browser.newPage();
	await page.goto(bookmark.url);

	const titleContent = await page.$eval('[property="og:title"]', (node) =>
		node.getAttribute("content")
	);

	const descriptionContent = await page.$eval(
		'[property="og:description"]',
		(node) => node.getAttribute("content")
	);

	if (titleContent) bookmark.title = titleContent;
	if (descriptionContent) bookmark.description = descriptionContent;

	await getRepository(Bookmark).save(bookmark);

	await browser.close();
};
