import { Api } from "client/services";
import React from "react";
import { useMutation } from "react-query";
import { Link, useLocation } from "react-router-dom";

/**
 * This page will used as a share target meaning that apps across platforms
 * can support sharing to this PWA.
 */
export const CreateBookmark: React.FC = () => {
	const { search } = useLocation();

	// There are some defined params which should be passed by the share mechanism.
	// https://web.dev/web-share-target/

	// `url` would be priority so check that first
	const urlParam = new URLSearchParams(search).get("url");
	let url = urlParam;

	if (!url) {
		// however some platforms (Android) will populate the `text` params with a combination of title and URL instead.
		// We just need to extract the URL part to save the bookmark.
		const textParam = new URLSearchParams(search).get("text");
		if (textParam) {
			const result = /(https?:\/\/[^\s]+)/g.exec(textParam);
			if (result?.length) {
				url = result[0];
			}
		}
	}

	const { mutateAsync, isSuccess, isLoading } = useMutation((url: string) => {
		return Api.post("/api/bookmarks", { url });
	});

	return (
		<>
			<Link to="/">Dashboard</Link>
			{isLoading ? (
				<p>Saving...</p>
			) : isSuccess ? (
				<p>Saved!</p>
			) : url === undefined || url === null ? (
				<p>Failed to detect URL</p>
			) : (
				<>
					<p>
						Save the following URL? <strong>{url}</strong>
					</p>
					<button
						type="submit"
						onClick={async (e) => {
							e.preventDefault();
							if (url) await mutateAsync(url);
						}}
					>
						Save Bookmark
					</button>
				</>
			)}
		</>
	);
};
