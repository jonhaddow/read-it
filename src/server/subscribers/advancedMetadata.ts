import { BookmarkEntity, BookmarkState } from "../entities";
import { getRepository } from "typeorm";
import {
	getDefaultStrategy,
	getStrategies,
} from "../services/metadata-strategies";
import { Bookmark } from "core/models";

/**
 * Updates a bookmark with advanced metadata properties.
 * Various strategies may be used to handle particular links.
 * @param bookmark The bookmark to populate.
 */
export const advancedMetadata = async (bookmark: Bookmark): Promise<void> => {
	const strategy = getStrategies().find((x) => x.shouldProcess(bookmark.url));

	let minuteEstimate: number | undefined;
	if (strategy) {
		const metaDataProps = await strategy.getAdvancedMetadata?.(
			bookmark.targetURL ?? bookmark.url
		);
		if (metaDataProps) {
			minuteEstimate = metaDataProps.minuteEstimate;
		}
	} else {
		const defaultMetadataProps =
			await getDefaultStrategy().getAdvancedMetadata?.(
				bookmark.targetURL ?? bookmark.url
			);
		if (defaultMetadataProps) {
			minuteEstimate = defaultMetadataProps.minuteEstimate;
		}
	}

	if (minuteEstimate) bookmark.minuteEstimate = minuteEstimate;

	try {
		bookmark.state = BookmarkState.PROCESSED;

		await getRepository(BookmarkEntity).save(bookmark);
	} catch (ex) {
		console.error("Failed to populate bookmarks", ex);
	}
};
