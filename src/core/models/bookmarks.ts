import { User } from "./user";

/**
 * Describes a bookmark of a website or web app.
 */
export interface Bookmark {
	/**
	 * A auto generated unique identifier for this bookmark.
	 */
	id?: number;

	/**
	 * The absolute url for the bookmark.
	 */
	url: string;

	/**
	 * The title of the page this bookmark points to.
	 */
	title?: string;

	/**
	 * The description of the page this bookmark points to.
	 */
	description?: string;

	/**
	 * The estimate number of minutes to read the contents of the page
	 * this bookmark links to.
	 */
	minuteEstimate?: number;

	/**
	 * The date the bookmark was created.
	 */
	dateCreated: Date;

	/**
	 * The processing state of this bookmark.
	 */
	state: "created" | "processed" | "archived";

	/**
	 * The URL of the submission (when a news aggregation site has been detected)
	 */
	targetURL?: string;

	/**
	 * The URL of the thumbnail associated with this bookmark.
	 */
	thumbnailUrl?: string;

	/**
	 * The name of the site when a "special case" has been detected.
	 *
	 * Special cases may have additional metadata gathered.
	 *
	 * E.g. this would be "reddit" if the `url` is a link to a reddit thread.
	 */
	specialType?: string;

	/**
	 * The user this bookmark belongs to.
	 */
	user: User;
}
