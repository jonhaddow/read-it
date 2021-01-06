import { Bookmark } from "../entities";
import puppeteer from "puppeteer";

export const populateBookmark = async (data: Bookmark): Promise<void> => {
	const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
	const page = await browser.newPage();
	await page.goto(data.url);

	// Scrap page...

	await browser.close();
};
