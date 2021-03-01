import { Api } from "client/services";
import { Bookmark } from "core/models";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link, useHistory, useLocation } from "react-router-dom";
import { string } from "yup";

export const CreateBookmark: React.FC = () => {
	const { search } = useLocation();
	const history = useHistory();

	// This page will used as a share target meaning that app across platform
	// can support sharing to this PWA.
	// In those cases, the following params will be used to pick up the URL.
	const textParam = new URLSearchParams(search).get("text");
	const urlParam = new URLSearchParams(search).get("url");
	const titleParam = new URLSearchParams(search).get("title");
	// `url` would be priority, however some platforms will populate the `text`, or `title` params.
	const [url, setUrl] = useState(urlParam ?? textParam ?? titleParam ?? "");

	const [isValid, setIsValid] = useState(false);

	const queryClient = useQueryClient();

	const { mutateAsync } = useMutation((url: string) => {
		return Api.post("/api/bookmarks", { url });
	});

	React.useEffect(() => {
		const validateUrl = async (): Promise<void> => {
			setIsValid(await string().required().url().isValid(url));
		};

		void validateUrl();
	}, [url]);

	const onSubmit = async (): Promise<void> => {
		const response = await mutateAsync(url);
		const data = await response.json();
		queryClient.setQueryData<{ results: Bookmark[] }>("bookmarks", (old) => ({
			results: [data, ...(old?.results ?? [])],
		}));
		history.push("/");
	};

	return (
		<>
			<Link to="/">Dashboard</Link>
			<form>
				<label htmlFor="url">Bookmark URL:</label>
				<input
					id="url"
					value={url}
					onChange={(e) => setUrl(e.currentTarget.value)}
				/>
				<button
					type="submit"
					disabled={!isValid}
					onClick={(e) => {
						e.preventDefault();
						void onSubmit();
					}}
				>
					Add bookmark
				</button>
			</form>
		</>
	);
};
