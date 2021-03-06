import { BookmarkEntity, BookmarkState } from "../entities";
import { getRepository } from "typeorm";
import { getDefaultStrategy, getStrategies } from "./metadata-strategies";
import { Bookmark } from "core/models";

/**
 * Populates a bookmark with metadata.
 * Various strategies may be used to handle particular links.
 * @param bookmark The bookmark to populate.
 */
export const populateBookmark = async (bookmark: Bookmark): Promise<void> => {
	let strategy = getStrategies().find((x) => {
		if (x.shouldProcess) {
			return x.shouldProcess.call(this, bookmark);
		}
		return false;
	});

	if (!strategy) {
		strategy = getDefaultStrategy();
	}

	const {
		title,
		description,
		minuteEstimate,
		specialType,
		targetURL,
		thumbnailUrl,
	} = await strategy.getMetadata(bookmark);

	if (title) bookmark.title = title;
	if (description) bookmark.description = description;
	if (minuteEstimate) bookmark.minuteEstimate = minuteEstimate;
	if (specialType) bookmark.specialType = specialType;
	if (targetURL) bookmark.targetURL = targetURL;
	if (thumbnailUrl) bookmark.thumbnailUrl = thumbnailUrl;

	try {
		bookmark.state = BookmarkState.PROCESSED;

		await getRepository(BookmarkEntity).save(bookmark);
	} catch (ex) {
		console.error("Failed to populate bookmarks", ex);
	}
};
