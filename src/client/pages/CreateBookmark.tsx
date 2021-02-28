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
	const { search } = useLocation();

	const textParam = new URLSearchParams(search).get("text");
	const urlParam = new URLSearchParams(search).get("url");
	const titleParam = new URLSearchParams(search).get("title");

	// Url would be priority, however some platforms will populate the text, or title params.
	const [url, setUrl] = useState<string>(
		urlParam ?? textParam ?? titleParam ?? ""
	);

	return (
		<form>
			<label htmlFor="url">Bookmark URL</label>
			<input
				id="url"
				value={url}
				onChange={(e) => setUrl(e.currentTarget.value)}
			/>
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
