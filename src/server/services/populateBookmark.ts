import {
	getDefaultStrategy,
	getStrategies,
	MetadataProps,
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
	const strategy = getStrategies().find((x) => x.shouldProcess(bookmark));

	let metadataProps: MetadataProps = {};

	if (strategy) {
		metadataProps = await strategy.getMetadata(bookmark.url);
	}

	const defaultMetadataProps = await getDefaultStrategy().getMetadata(
		bookmark.targetURL ?? bookmark.url
	);

	return { ...bookmark, ...defaultMetadataProps, ...metadataProps };
};
