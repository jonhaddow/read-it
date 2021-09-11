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
			className="p-6 m-auto max-w-sm"
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
					className="block py-2 px-2 text-sm tracking-wider leading-3 text-gray-800 uppercase"
				>
					Add a link
				</label>
				<input
					id="url"
					className="py-2 px-4 w-72 rounded-2xl border border-gray-500 focus:shadow-md outline-none"
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
						? "text-gray-700 hover:bg-primary-300"
						: "text-gray-400 cursor-default"
				} focus:border-black outline-none bg-primary-100  py-2 px-3 rounded-lg`}
				type="submit"
			>
				Create
			</button>
		</form>
	);
};
