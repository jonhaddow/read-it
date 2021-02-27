import { Api } from "client/services";
import { Bookmark } from "core/models";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

interface CreateBookmarkProps {
	addBookmark: (bookmark: Bookmark) => void;
}

export const CreateBookmark: React.FC<CreateBookmarkProps> = ({
	addBookmark,
}) => {
	const [url, setUrl] = useState<string>();
	const { search } = useLocation();

	const textParam = new URLSearchParams(search).get("text");
	const urlParam = new URLSearchParams(search).get("url");
	const titleParam = new URLSearchParams(search).get("title");

	return (
		<form>
			<label htmlFor="url">Bookmark URL</label>
			<input
				id="url"
				value={url}
				onChange={(e) => setUrl(e.currentTarget.value)}
			/>
			<pre>
				Suggested - text: &quot;{textParam}&quot; url: &quot;{urlParam}&quot;
				title: &quot;{titleParam}&quot;
			</pre>
			<button
				onClick={async () => {
					const response = await Api.post("/api/bookmarks", { url });
					const newBookmark = (await response.json()) as Bookmark;
					addBookmark(newBookmark);
				}}
			>
				Add bookmark
			</button>
		</form>
	);
};
