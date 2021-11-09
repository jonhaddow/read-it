import { Api } from "client/services";
import { Bookmark } from "core/models";
import { UseQueryResult, useQuery } from "react-query";
import { ResultSet } from "server/interfaces";

export const bookmarkKeys = {
	all: () => ["bookmarks"],
	filter: (skip?: number, take?: number) => [...bookmarkKeys.all(), skip, take],
};

interface BookmarkParams {
	skip: number;
	take: number;
}
export const useBookmarks = ({
	skip,
	take,
}: BookmarkParams): UseQueryResult<ResultSet<Bookmark>> => {
	return useQuery(bookmarkKeys.filter(skip, take), async () => {
		const response = await Api.get("/api/bookmarks", { skip, take });
		if (!response.ok) {
			throw new Error("Network request failed.");
		}
		return (await response.json()) as ResultSet<Bookmark>;
	});
};
