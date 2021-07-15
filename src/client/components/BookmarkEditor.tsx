import { Api } from "client/services";
import { Bookmark } from "core/models";
import React, { ReactElement, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ResultSet } from "server/interfaces";
import { FormGroup } from "./FormGroup";

interface BookmarkEditorProps {
	onSave: () => void;
}

export const BookmarkEditor = ({
	onSave,
}: BookmarkEditorProps): ReactElement => {
	const [url, setUrl] = useState<string>("");

	const queryClient = useQueryClient();

	const { mutateAsync, isLoading } = useMutation(
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

	return (
		<form
			className="max-w-sm m-auto p-6"
			onSubmit={async (e) => {
				e.preventDefault();
				const response = await mutateAsync({ url });
				const data = (await response.json()) as Bookmark;
				queryClient.setQueryData<ResultSet<Bookmark>>(
					"bookmarks",
					(bookmarks) => ({
						results: [data, ...(bookmarks?.results ?? [])],
					})
				);
				onSave();
			}}
		>
			<FormGroup>
				<label
					htmlFor="url"
					className="block text-sm text-gray-800 py-2 px-2 uppercase tracking-wider leading-3"
				>
					Add a link
				</label>
				<input
					id="url"
					className="border-gray-500 border px-4 py-2 w-72 rounded-2xl focus:shadow-md outline-none"
					name="url"
					type="url"
					placeholder="https://"
					value={url}
					onChange={(e) => {
						setUrl(e.target.value);
					}}
				/>
			</FormGroup>
			<button
				disabled={!url}
				className={`${
					url && !isLoading
						? "text-gray-700 hover:bg-blue-300"
						: "text-gray-400 cursor-default"
				} focus:border-black outline-none bg-blue-100  py-2 px-3 rounded-lg`}
				type="submit"
			>
				Create
			</button>
		</form>
	);
};
