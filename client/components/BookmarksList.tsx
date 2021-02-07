import React, { useEffect, useState } from "react";

interface Bookmark {
	id: string;
	url: string;
}

export const BookmarksList: React.FC = () => {
	const [bookmarks, setBookmarks] = useState<Bookmark[]>();

	useEffect(() => {
		async function getBookmarks(): Promise<void> {
			const response = await fetch("/api/bookmarks");
			if (response.status == 200) {
				const b = (await response.json()) as { results: Bookmark[] };
				setBookmarks(b.results);
			}
		}

		void getBookmarks();
	}, []);

	if (!bookmarks) return null;

	return (
		<>
			<a href="/api/logout">Log out</a>
			<h1>Bookmarks</h1>
			<ul>
				{bookmarks.map((x) => (
					<li key={x.id}>{x.url}</li>
				))}
			</ul>
		</>
	);
};
