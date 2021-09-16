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
	let strategy = getStrategies().find((x) => {
		if (x.shouldProcess) {
			return x.shouldProcess.call(this, bookmark);
		}
		return false;
	});

	if (!strategy) {
		strategy = getDefaultStrategy();
	}

	const { minuteEstimate } = await strategy.getAdvancedMetadata(bookmark);

	if (minuteEstimate) bookmark.minuteEstimate = minuteEstimate;

	try {
		bookmark.state = BookmarkState.PROCESSED;

		await getRepository(BookmarkEntity).save(bookmark);
	} catch (ex) {
		console.error("Failed to populate bookmarks", ex);
	}
};
