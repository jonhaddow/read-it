import { Pool } from "pg";

const pool = new Pool();

export const getBookmarks = async () => {
	const client = await pool.connect();
	try {
		const res = await client.query("SELECT * FROM bookmarks");
		return { results: res.rows };
	} finally {
		// Make sure to release the client before any error handling,
		// just in case the error handling itself throws an error.
		client.release();
	}
};
