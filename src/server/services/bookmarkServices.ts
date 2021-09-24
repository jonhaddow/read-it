import { BookmarkEntity, BookmarkState } from "../entities";
import { ResultSet, Response } from "../interfaces";
import { getRepository } from "typeorm";
import { getEmitter } from "../events";
import { Bookmark, User } from "core/models";
import { isWebUri } from "valid-url";
import { populateBookmark } from "./populateBookmark";

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
): Promise<Response<Bookmark>> => {
	const validateResult = validateBookmark(bookmark);

	if (!validateResult.isSuccess) {
		return Response.FromResponse<Bookmark>(validateResult);
	}

	bookmark.user = user;
	bookmark.state = BookmarkState.CREATED;

	bookmark = await populateBookmark(bookmark);

	bookmark = await getRepository(BookmarkEntity).save(bookmark);

	getEmitter().emit("addBookmark", bookmark);

	return Response.Create(bookmark);
};

export const deleteBookmark = async (user: User, id: number): Promise<void> => {
	await getRepository(BookmarkEntity).delete({ id, user });
};

function validateBookmark(bookmark: Bookmark): Response {
	if (bookmark.url) {
		if (isWebUri(bookmark.url) === undefined) {
			return Response.BadRequest("Bookmark URL invalid");
		}
	} else {
		return Response.BadRequest("Bookmark URL required");
	}

	return Response.Ok();
}
