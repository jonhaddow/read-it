import { useBookmarks } from "client/hooks";
import React from "react";
import { BookmarkListItem, Pagination, StateMessage } from ".";

export const BookmarkList: React.FC = () => {
	const [skip, setSkip] = React.useState<number>(0);
	const [take, setTake] = React.useState<number>(10);
	const { data, isLoading } = useBookmarks({ skip, take });

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
					<Pagination
						skip={skip}
						take={take}
						total={data.total}
						onChange={(s, t) => {
							setSkip(s);
							setTake(t);
						}}
					/>
				</>
			) : (
				<StateMessage>No bookmarks</StateMessage>
			)}
		</>
	);
};
