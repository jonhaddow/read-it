import { Bookmark } from "core/models";
import { IMetadataStrategy, MetadataProps } from ".";
import fetch from "node-fetch";
import { parse } from "iso8601-duration";
import duration from "dayjs/plugin/duration";
import dayjs from "dayjs";
dayjs.extend(duration);

const LINK_REGEXES: RegExp[] = [
	/www\.youtube\.com\/watch\?v=(.*)/,
	/youtu\.be\/(.*)/,
];

/**
 * A metadata strategy for handling YouTube urls
 */
export class YouTubeStrategy implements IMetadataStrategy {
	shouldProcess(bookmark: Readonly<Bookmark>): boolean {
		return LINK_REGEXES.some((x) => x.test(bookmark.url));
	}

	async getMetadata(url: string): Promise<MetadataProps> {
		const metadata: MetadataProps = {
			specialType: "youtube",
			favicon: "https://www.youtube.com/favicon.ico",
		};
		try {
			const match = url.match(LINK_REGEXES[0]);

			if (!match) {
				throw new Error("Could not match url");
			}

			const id = match[1];

			if (!id) {
				throw new Error("Could not find id in url");
			}

			if (!process.env.YOUTUBE_API_KEY && process.env.NODE_ENV !== "test") {
				throw new Error("Missing YouTube API key");
			}

			const getVideo = await fetch(
				`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${
					process.env.YOUTUBE_API_KEY ?? ""
				}&part=contentDetails&part=snippet`
			);
			const json = await getVideo.json();

			if (!json.items || !json.items[0]) {
				throw new Error("Could not find video");
			}

			const duration = json.items[0].contentDetails.duration as string;
			const { hours, minutes, seconds } = parse(duration);
			const minuteEstimate = dayjs
				.duration({
					hours,
					minutes,
					seconds,
				})
				.asMinutes();

			const { title, description, thumbnails } = json.items[0].snippet;

			return {
				minuteEstimate,
				description,
				title,
				thumbnailUrl: thumbnails.high.url,
				...metadata,
			};
		} catch (error) {
			console.error(error);
			return metadata;
		}
	}
}
