import { useBookmarks } from "client/hooks";
import React from "react";
import { BookmarkListItem, StateMessage } from ".";

export const BookmarkList: React.FC = () => {
	const { data, isLoading } = useBookmarks();

	if (isLoading) return <StateMessage>Loading...</StateMessage>;

	return (
		<>
			{data?.results.length ? (
				<ul>
					{data.results.map((bookmark) => (
						<BookmarkListItem key={bookmark.id} {...bookmark} />
					))}
				</ul>
			) : (
				<StateMessage>No bookmarks</StateMessage>
			)}
		</>
	);
};
