import { IMetadataStrategy } from ".";
import { Bookmark } from "../../entities";
import { Metadata } from "../../interfaces";
import { getMetadata } from "../../services";

/**
 * The default strategy for bookmarks.
 * Each link is opened in a headless browser and the metadata is abstracted
 * from open graph and meta tags.
 */
export class DefaultStrategy implements IMetadataStrategy {
	getMetadata(bookmark: Readonly<Bookmark>): Promise<Metadata> {
		return getMetadata(bookmark.url);
	}
}
