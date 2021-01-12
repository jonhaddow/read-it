import puppeteer, { Browser } from "puppeteer";

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
