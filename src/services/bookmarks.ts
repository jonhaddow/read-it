import { Bookmark, User } from "../entities";
import { ResultSet } from "../interfaces";
import { getManager } from "typeorm";

export const getBookmarks = async (
	user: User
): Promise<ResultSet<Bookmark>> => {
	const results = await getManager()
		.getRepository(Bookmark)
		.find({ where: { user: user } });
	return { results };
};

export const getBookmark = async (
	user: User,
	id: number
): Promise<Bookmark | undefined> => {
	const result = await getManager()
		.getRepository(Bookmark)
		.findOne({ where: { user: user, id: id } });
	return result;
};

export const addBookmark = async (
	user: User,
	bookmark: Bookmark
): Promise<Bookmark> => {
	bookmark.dateCreated = new Date();
	bookmark.user = user;

	const response = await getManager().getRepository(Bookmark).save(bookmark);
	return response;
};
