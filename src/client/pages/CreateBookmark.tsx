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

	// The following params will be used to pick up the URL.
	const textParam = new URLSearchParams(search).get("text");
	const urlParam = new URLSearchParams(search).get("url");

	// `url` would be priority, however some platforms (Android) will populate the `text` params.
	const url = urlParam ?? textParam ?? undefined;

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
			) : url === undefined ? (
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
							await mutateAsync(url);
						}}
					>
						Save Bookmark
					</button>
				</>
			)}
		</>
	);
};
