import { useBookmarks } from "client/hooks";
import React from "react";

export const BookmarkList: React.FC = () => {
	const { data, isLoading } = useBookmarks();

	if (isLoading) return <p>Loading...</p>;

	return (
		<>
			{data?.results.length ? (
				<ul>
					{data.results.map((x) => (
						<li key={x.id}>
							<a href={x.url}>
								<span>{x.url}</span> - <span>{x.title}</span>
							</a>
						</li>
					))}
				</ul>
			) : (
				<p>No bookmarks</p>
			)}
		</>
	);
};
