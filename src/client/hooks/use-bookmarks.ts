import { Api } from "client/services";
import { Bookmark } from "core/models";
import { useQuery, UseQueryResult } from "react-query";
import { ResultSet } from "server/interfaces";

export const useBookmarks = (): UseQueryResult<ResultSet<Bookmark>> => {
	return useQuery("bookmarks", async () => {
		const response = await Api.get("/api/bookmarks");
		if (!response.ok) {
			throw new Error("Network request failed.");
		}
		return (await response.json()) as ResultSet<Bookmark>;
	});
};
