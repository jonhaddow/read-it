import React, { useEffect, useState } from "react";
import { Bookmark } from "core/models";

export const BookmarksList: React.FC = () => {
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
	const [url, setUrl] = useState<string>();

	useEffect(() => {
		async function getBookmarks(): Promise<void> {
			const response = await fetch(`${API_URL}/api/bookmarks`, {
				credentials: "same-origin",
			});
			if (response.status == 200) {
				const b = (await response.json()) as { results: Bookmark[] };
				setBookmarks(b.results);
			}
		}

		void getBookmarks();
	}, []);

	const addBookmark = async (): Promise<void> => {
		const response = await fetch(`${API_URL}/api/bookmarks`, {
			body: JSON.stringify({
				url,
			}),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			credentials: "same-origin",
		});
		const newBookmark = (await response.json()) as Bookmark;
		setBookmarks([...bookmarks, newBookmark]);
	};

	if (!bookmarks) return null;

	return (
		<>
			<a href="/api/logout">Log out</a>
			<h1>Bookmarks</h1>
			{bookmarks.length ? (
				<ul>
					{bookmarks.map((x) => (
						<li key={x.id}>
							<a href={x.url}>
								<span>{x.title}</span>
							</a>
						</li>
					))}
				</ul>
			) : (
				<p>No bookmarks</p>
			)}
			<label htmlFor="url">Bookmark URL</label>
			<input
				id="url"
				value={url}
				onChange={(e) => setUrl(e.currentTarget.value)}
			/>
			<button onClick={addBookmark}>Add bookmark</button>
		</>
	);
};
