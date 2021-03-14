import { IMetadataStrategy, MetadataProps } from ".";
import snoowrap from "snoowrap";
import {
	estimateReadingTime,
	findMetadata,
	openWebpage,
} from "../../services/puppeteer";
import { Bookmark } from "core/models";

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
	shouldProcess(bookmark: Bookmark): boolean {
		return REDDIT_LINK_REGEXES.some((x) => x.test(bookmark.url));
	}

	async getMetadata(bookmark: Readonly<Bookmark>): Promise<MetadataProps> {
		let shortId: string | undefined;

		for (const regex of REDDIT_LINK_REGEXES) {
			const match = regex.exec(bookmark.url);
			if (match) {
				shortId = match[1];
				break;
			}
		}

		if (!shortId) {
			console.error("failed to detect Reddit shortId.");
			return {};
		}

		const r = new snoowrap({
			userAgent: "read-it v0 /u/read-it-bot",
			clientId: process.env.REDDIT_CLIENT_ID,
			clientSecret: process.env.REDDIT_CLIENT_SECRET,
			username: process.env.REDDIT_USERNAME,
			password: process.env.REDDIT_PASSWORD,
		});

		const metadata: MetadataProps = {
			specialType: "reddit",
		};

		// Process the metadata of the full article link of the reddit submission.
		await r
			.getSubmission(shortId)
			.fetch()
			.then(async (postData) => {
				const { title, url, thumbnail, selftext } = postData;

				metadata.title = title;
				metadata.thumbnailUrl = thumbnail !== "default" ? thumbnail : undefined;

				if (url) {
					metadata.targetURL = url;

					const page = await openWebpage(url);
					if (!page) return;
					metadata.minuteEstimate = await estimateReadingTime(page);
					metadata.description = await findMetadata("description", page);
					metadata.thumbnailUrl =
						metadata.thumbnailUrl || (await findMetadata("thumbnail", page));
				} else {
					metadata.description = selftext;
				}
			});

		return metadata;
	}
}
