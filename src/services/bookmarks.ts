import { Pool } from "pg";

import config from "config";

const pool = new Pool(config.get("db_config"));

interface Bookmark {
	id: string;
	url: string;
}

class ResultSet<T> {
	constructor(results: T[]) {
		this.results = results;
	}

	results: T[];
}

class Response<T> {
	constructor(body: T | null, code?: number, error?: string) {
		this.body = body;
		this.isSuccess = error === undefined;
		this.statusCode = code;
		this.error = error;
	}

	isSuccess: boolean;
	body: T | null;
	statusCode?: number;
	error?: string;
}

export const getBookmarks = async (): Promise<
	Response<ResultSet<Bookmark>>
> => {
	try {
		const client = await pool.connect();
		try {
			const res = await client.query<Bookmark>("SELECT * FROM bookmarks");
			return new Response(new ResultSet(res.rows));
		} finally {
			// Make sure to release the client before any error handling,
			// just in case the error handling itself throws an error.
			client.release();
		}
	} catch (ex) {
		console.error(ex);
		return new Response<ResultSet<Bookmark>>(
			null,
			500,
			`Failed to connect to database. ${ex}`
		);
	}
};
