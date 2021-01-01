import { Bookmark, User } from "../entities";
import { ResultSet } from "../interfaces";
import { getRepository } from "typeorm";
import { eventEmitter } from "../server";

export const getBookmarks = async (
	user: User
): Promise<ResultSet<Bookmark>> => {
	const results = await getRepository(Bookmark).find({ where: { user: user } });
	return { results };
};

export const getBookmark = async (
	user: User,
	id: number
): Promise<Bookmark | undefined> => {
	const result = await getRepository(Bookmark).findOne({
		where: { user: user, id: id },
	});
	return result;
};

export const addBookmark = async (
	user: User,
	bookmark: Bookmark
): Promise<Bookmark> => {
	bookmark.dateCreated = new Date();
	bookmark.user = user;

	bookmark = await getRepository(Bookmark).save(bookmark);

	eventEmitter.emit("addBookmark", bookmark);

	return bookmark;
};

export const updateBookmark = async (
	user: User,
	bookmark: Bookmark
): Promise<Bookmark> => {
	bookmark.user = user;

	bookmark = await getRepository(Bookmark).save(bookmark);

	eventEmitter.emit("updateBookmark", bookmark);

	return bookmark;
};

export const deleteBookmark = async (user: User, id: number): Promise<void> => {
	await getRepository(Bookmark).delete({ id, user });
};
