/**
 * Describes the metadata for a webpack.
 */
export interface Metadata {
	/**
	 * The title of a webpage.
	 */
	title?: string;

	/**
	 * The description of a webpage.
	 */
	description?: string;

	/**
	 * The estimated number of minutes to read the contents
	 * of a webpage.
	 */
	minuteEstimate?: number;
}
