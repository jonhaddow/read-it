import { Bookmark } from "../entities";
import { ResultSet } from "../interfaces";
import { getManager } from "typeorm";

export const getBookmarks = async (): Promise<ResultSet<Bookmark>> => {
	const results = await getManager().getRepository(Bookmark).find();
	return { results };
};
