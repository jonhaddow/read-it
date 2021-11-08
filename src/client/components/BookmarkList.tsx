import { useBookmarks } from "client/hooks";
import React from "react";
import { BookmarkListItem, Pagination, StateMessage } from ".";

export const BookmarkList: React.FC = () => {
	const { data, isLoading } = useBookmarks({ skip: 0, take: 25 });

	if (isLoading) return <StateMessage>Loading...</StateMessage>;

	return (
		<>
			{data?.results.length ? (
				<>
					<ul>
						{data.results.map((bookmark) => (
							<BookmarkListItem key={bookmark.id} {...bookmark} />
						))}
					</ul>
					<Pagination itemsPerPage={25} totalItems={data.total} />
				</>
			) : (
				<StateMessage>No bookmarks</StateMessage>
			)}
		</>
	);
};
