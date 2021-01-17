import { Bookmark } from "../../entities";
import { IMetadataStrategy, MetadataProps } from ".";
import snoowrap, { SnoowrapOptions } from "snoowrap";
import { getMetadata } from "../../services";
import config from "config";

const REDDIT_LINK_REGEXES: RegExp[] = [
	/reddit\.com\/r\/.*?\/comments\/(.{6})(?:$|\/)/,
	/redd\.it\/(.{6})(?:$|\/)/,
	/reddit\.com\/(.{6})(?:$|\/)/,
];

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
			...config.get<Partial<SnoowrapOptions>>("redditAPI"),
		});

		let metadata: MetadataProps = {
			specialType: "reddit",
		};

		// Process the metadata of the full article link of the reddit submission.
		await r
			.getSubmission(shortId)
			.fetch()
			.then(async (postData) => {
				metadata = {
					...metadata,
					targetURL: postData.url,
					...(await getMetadata(postData.url)),
				};
			});

		return metadata;
	}
}
