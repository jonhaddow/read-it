import puppeteer, { Browser, Page } from "puppeteer";

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

/**
 * Opens a Puppeteer webpage with the provided URL.
 */
export const openWebpage = async (url: string): Promise<Page | undefined> => {
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

	try {
		await page.goto(url);
	} catch (error) {
		console.error(
			`Failed to open site with the following URL: ${url}. Error: ${
				error as string
			}`
		);
		return;
	}

	return page;
};
