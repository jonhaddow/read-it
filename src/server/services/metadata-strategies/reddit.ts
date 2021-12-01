import { AdvancedMetadataProps, IMetadataStrategy, MetadataProps } from ".";
import snoowrap from "snoowrap";
import { estimateReadingTime, openWebpage } from "../../services/puppeteer";

const REDDIT_LINK_REGEXES: RegExp[] = [
	/reddit\.com\/r\/.*?\/comments\/(.{6})(?:$|\/)/,
	/redd\.it\/(.{6})(?:$|\/)/,
	/reddit\.com\/(.{6})(?:$|\/)/,
];

/**
 * A metadata strategy for handling Reddit urls.
 * This uses the Reddit API to gather metadata about the submission.
 * It additional finds missing metadata from the submission url through Puppeteer.
 */
export class RedditStrategy implements IMetadataStrategy {
	shouldProcess(url: string): boolean {
		return REDDIT_LINK_REGEXES.some((x) => x.test(url));
	}

	async getMetadata(url: string): Promise<MetadataProps> {
		const metadata: MetadataProps = {
			specialType: "reddit",
			favicon: "https://www.redditstatic.com/favicon.ico",
		};
		let shortId: string | undefined;

		for (const regex of REDDIT_LINK_REGEXES) {
			const match = regex.exec(url);
			if (match) {
				shortId = match[1];
				break;
			}
		}

		if (!shortId) {
			console.error("failed to detect Reddit shortId.");
			return metadata;
		}

		const r = new snoowrap({
			userAgent: "read-it v0 /u/read-it-bot",
			clientId: process.env.REDDIT_CLIENT_ID,
			clientSecret: process.env.REDDIT_CLIENT_SECRET,
			username: process.env.REDDIT_USERNAME,
			password: process.env.REDDIT_PASSWORD,
		});

		// Process the metadata of the full article link of the reddit submission.
		await r
			.getSubmission(shortId)
			.fetch()
			.then(async (postData) => {
				const { title, url, thumbnail, selftext } = postData;

				metadata.title = title;

				if (thumbnail !== "default") {
					metadata.thumbnailUrl = thumbnail;
				}

				if (url) {
					metadata.targetURL = url;
				} else {
					metadata.description = selftext;
				}
			});

		return metadata;
	}

	async getAdvancedMetadata(url: string): Promise<AdvancedMetadataProps> {
		let minuteEstimate: number | undefined = undefined;

		const page = await openWebpage(url);
		if (page) minuteEstimate = await estimateReadingTime(page);

		return {
			minuteEstimate,
		};
	}
}
