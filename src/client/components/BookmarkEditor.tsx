import { Api } from "client/services";
import { Bookmark } from "core/models";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ResultSet } from "server/interfaces";
import { string } from "yup";

export const BookmarkEditor: React.FC = () => {
	const [title, setTitle] = useState<string>("");
	const [url, setUrl] = useState<string>("");

	const [isValid, setIsValid] = useState<boolean>(false);

	const queryClient = useQueryClient();

	const { mutateAsync, isSuccess, isLoading, isError } = useMutation(
		async (createBookmarkModel: { url: string; title?: string }) => {
			const response = await Api.post("/api/bookmarks", {
				url: createBookmarkModel.url,
				title: createBookmarkModel.title,
			});
			if (!response.ok) {
				throw new Error("Network response failed");
			}
			return response;
		}
	);

	React.useEffect(() => {
		setIsValid(() => string().required().url().isValidSync(url));
	}, [url]);

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				const response = await mutateAsync({ url, title });
				const data = (await response.json()) as Bookmark;
				queryClient.setQueryData<ResultSet<Bookmark>>(
					"bookmarks",
					(bookmarks) => ({
						results: [data, ...(bookmarks?.results ?? [])],
					})
				);
			}}
		>
			<label htmlFor="url">Url:</label>
			<input
				id="url"
				name="url"
				type="url"
				value={url}
				onChange={(e) => setUrl(e.target.value)}
			/>
			<label htmlFor="title">Title:</label>
			<span>(optional)</span>
			<input
				id="title"
				name="title"
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			{!isValid && <p>Invalid</p>}
			<button disabled={!isValid} type="submit">
				Save
			</button>
			<p>
				{isLoading
					? "Saving..."
					: isSuccess
					? "Saved!"
					: isError
					? "Failed"
					: ""}
			</p>
		</form>
	);
};
