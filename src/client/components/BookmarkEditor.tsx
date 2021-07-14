import { Api } from "client/services";
import { Bookmark } from "core/models";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ResultSet } from "server/interfaces";
import { string } from "yup";
import { Label, Title } from ".";
import { FormGroup } from "./FormGroup";

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
			className="max-w-sm m-auto p-6 shadow-md"
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
			<Title as="h1" className="pb-3">
				Add bookmark
			</Title>
			<FormGroup>
				<Label htmlFor="url">Url</Label>
				<input
					id="url"
					className="border-gray-500 border rounded"
					name="url"
					type="url"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>
			</FormGroup>
			<FormGroup>
				<Label htmlFor="title">Title</Label>
				<span className="text-xs text-gray-700">(optional)</span>
				<input
					id="title"
					className="border-gray-500 border rounded"
					name="title"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</FormGroup>
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
