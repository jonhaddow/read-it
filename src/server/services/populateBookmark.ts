import { BookmarkEntity } from "../entities";
import { getRepository } from "typeorm";
import { getDefaultStrategy, getStrategies } from "./metadata-strategies";
import { Bookmark } from "core/models";

/**
 * Populates a bookmark with metadata.
 * Various strategies may be used to handle particular links.
 * @param bookmark The bookmark to populate.
 */
export const populateBookmark = async (
	bookmark: Bookmark
): Promise<Bookmark> => {
	let strategy = getStrategies().find((x) => {
		if (x.shouldProcess) {
			return x.shouldProcess.call(this, bookmark);
		}
		return false;
	});

	if (!strategy) {
		strategy = getDefaultStrategy();
	}

	const metadataProps = await strategy.getMetadata(bookmark);

	return { ...bookmark, ...metadataProps };
};
