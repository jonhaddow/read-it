import { Api } from "client/services";
import { Bookmark } from "core/models";
import { UseQueryResult, useQuery } from "react-query";
import { ResultSet } from "server/interfaces";

interface BookmarkParams {
	skip: number;
	take: number;
}
export const useBookmarks = ({
	skip,
	take,
}: BookmarkParams): UseQueryResult<ResultSet<Bookmark>> => {
	return useQuery(
		"bookmarks",
		async () => {
			const response = await Api.get("/api/bookmarks", { skip, take });
			if (!response.ok) {
				throw new Error("Network request failed.");
			}
			return (await response.json()) as ResultSet<Bookmark>;
		},
		{
			refetchInterval: 3000,
		}
	);
};
