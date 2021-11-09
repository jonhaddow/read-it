/**
 * A wrapper for a list of results.
 */
export interface ResultSet<T> {
	/**
	 * The array of results.
	 */
	results: T[];

	/**
	 * The total number of results.
	 */
	total: number;
}
