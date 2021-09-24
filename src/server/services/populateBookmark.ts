import { BookmarkEntity } from "../entities";
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
		specialType,
		targetURL,
		thumbnailUrl,
		favicon,
	} = await strategy.getMetadata(bookmark);

	if (title) bookmark.title = title;
	if (description) bookmark.description = description;
	if (specialType) bookmark.specialType = specialType;
	if (targetURL) bookmark.targetURL = targetURL;
	if (thumbnailUrl) bookmark.thumbnailUrl = thumbnailUrl;
	if (favicon) bookmark.favicon = favicon;

	try {
		await getRepository(BookmarkEntity).save(bookmark);
	} catch (ex) {
		console.error("Failed to populate bookmarks", ex);
	}
};
