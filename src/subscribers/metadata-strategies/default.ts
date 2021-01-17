import { IMetadataStrategy, MetadataProps } from ".";
import { Bookmark } from "../../entities";
import { getMetadata } from "../../services";

/**
 * The default strategy for bookmarks.
 * Each link is opened in a headless browser and the metadata is abstracted
 * from open graph and meta tags.
 */
export class DefaultStrategy implements IMetadataStrategy {
	getMetadata(bookmark: Readonly<Bookmark>): Promise<MetadataProps> {
		return getMetadata(bookmark.url);
	}
}
