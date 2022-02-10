import {
	BookmarkEditor,
	BookmarkListItem,
	Dropdown,
	Modal,
	Pagination,
	StateMessage,
} from "client/components";
import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { useBookmarks, useSortOptions } from "client/hooks";

export const Dashboard: React.FC = () => {
	const [skip, setSkip] = React.useState<number>(0);
	const [take, setTake] = React.useState<number>(10);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

	const { options, selected, selectedParams, setSelected } = useSortOptions();

	const { data, isLoading } = useBookmarks({
		skip,
		take,
		...selectedParams,
	});

	React.useEffect(() => {
		// If the current page of results is empty, then we need to go back a page.
		// We can get into this state when deleting the last item on the last page.
		if (data && data.total !== 0 && data.results.length === 0) {
			setSkip(skip - take);
		}
	}, [data, skip, take]);

	return (
		<div className="p-4 m-auto my-4 max-w-screen-md">
			<header className="flex flex-wrap items-center mb-6">
				<h1 className="grow text-sm font-bold text-text-main uppercase">
					Bookmarks
				</h1>
				<Dropdown
					items={options}
					selectedItem={selected}
					onSelect={(i) => {
						setSelected(i);
						setSkip(0);
					}}
				/>
				<button
					className="flex items-center py-1 px-2 mr-4 text-sm text-text-secondary hover:text-text-main focus:outline-none"
					onClick={() => setIsCreateModalOpen(true)}
				>
					<AiOutlinePlus className="inline mr-1" />
					Create bookmark
				</button>
				<a className="text-sm hover:underline" href={`${API_URL}/api/logout`}>
					<FiLogOut size={24} />
					<span className="sr-only">Log out</span>
				</a>
			</header>
			{isLoading ? (
				<StateMessage>Loading...</StateMessage>
			) : data?.results.length ? (
				<>
					<ul>
						{data.results.map((bookmark) => (
							<BookmarkListItem key={bookmark.id} {...bookmark} />
						))}
					</ul>
					<Pagination
						skip={skip}
						take={take}
						total={data.total}
						onChange={(s, t) => {
							setSkip(s);
							setTake(t);
						}}
					/>
				</>
			) : (
				<StateMessage>No bookmarks</StateMessage>
			)}
			{isCreateModalOpen && (
				<Modal
					title="Create Bookmark"
					close={() => setIsCreateModalOpen(false)}
				>
					<BookmarkEditor onSave={() => setIsCreateModalOpen(false)} />
				</Modal>
			)}
		</div>
	);
};
