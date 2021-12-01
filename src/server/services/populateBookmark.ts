import {
	IMetadataStrategy,
	MetadataProps,
	getDefaultStrategy,
	getStrategies,
} from "./metadata-strategies";
import { Bookmark } from "core/models";

/**
 * Populates a bookmark with metadata.
 * Various strategies may be used to handle particular links.
 * @param bookmark The bookmark to populate.
 */
export const populateBookmark = async (
	bookmark: Readonly<Bookmark>
): Promise<Bookmark> => {
	// First, find a strategy to handle this particular link and use it to populate metadata.
	const strategy = getStrategies().find((x) => x.shouldProcess(bookmark.url));

	let metadataProps: MetadataProps = {};
	if (strategy) {
		metadataProps = await strategy.getMetadata(bookmark.url);
	}

	// If the link was a news aggregation site, then we may now have a target link.
	// If we have a target URL, populate further metadata from that.
	// We may have other strategies available to process that target URL.
	const targetUrl = metadataProps.targetURL;
	let targetStrategy: IMetadataStrategy | undefined;
	if (targetUrl) {
		targetStrategy = getStrategies().find((x) => x.shouldProcess(targetUrl));

		if (targetStrategy) {
			const targetMetadataProps = await targetStrategy.getMetadata(targetUrl);
			metadataProps = {
				...targetMetadataProps,
				...metadataProps,
			};
		}
	}

	// If there wasn't a target URL or strategy, then use the default link processor to get the remaining metadata.
	if (!targetStrategy) {
		// Use the targetUrl if we've got it.
		const url = metadataProps.targetURL ?? bookmark.url;
		const defaultMetadataProps = await getDefaultStrategy().getMetadata(url);
		metadataProps = {
			...defaultMetadataProps,
			...metadataProps,
		};
	}

	return { ...bookmark, ...metadataProps };
};
