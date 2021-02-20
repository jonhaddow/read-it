import { BookmarkEntity } from "../entities";
import { ResultSet } from "../interfaces";
import { getRepository } from "typeorm";
import { getEmitter } from "../events";
import { Bookmark, User } from "core/models";
import { isWebUri } from "valid-url";

export const getBookmarks = async (
	user: User
): Promise<ResultSet<Bookmark>> => {
	const results = await getRepository(BookmarkEntity).find({
		where: { user: user },
	});
	return { results };
};

export const getBookmark = async (
	user: User,
	id: number
): Promise<Bookmark | undefined> => {
	const result = await getRepository(BookmarkEntity).findOne({
		where: { user: user, id: id },
	});
	return result;
};

export const addBookmark = async (
	user: User,
	bookmark: Bookmark
): Promise<Bookmark> => {
	bookmark.user = user;

	bookmark = await getRepository(BookmarkEntity).save(bookmark);

	getEmitter().emit("addBookmark", bookmark);

	return bookmark;
};

export const updateBookmark = async (
	user: User,
	bookmark: Bookmark
): Promise<Bookmark> => {
	bookmark.user = user;

	bookmark = await getRepository(BookmarkEntity).save(bookmark);

	getEmitter().emit("updateBookmark", bookmark);

	return bookmark;
};

export const deleteBookmark = async (user: User, id: number): Promise<void> => {
	await getRepository(BookmarkEntity).delete({ id, user });
};

export const validateBookmark = (bookmark: Bookmark): { error?: string } => {
	if (bookmark.url) {
		if (isWebUri(bookmark.url) === undefined) {
			return { error: "Bookmark URL invalid" };
		}
	} else {
		return { error: "Bookmark URL required" };
	}
	return {};
};
