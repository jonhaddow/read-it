import { BookmarkEditor, BookmarkList, Modal } from "client/components";
import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";

export const Dashboard: React.FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<div className="p-4 m-auto my-4 max-w-screen-md">
			<header className="flex flex-wrap items-center mb-6">
				<h1 className="flex-grow text-sm font-bold text-text-main uppercase">
					Bookmarks
				</h1>
				<button
					className="flex items-center py-1 px-2 mr-4 text-sm text-text-secondary hover:text-text-main focus:outline-none"
					onClick={() => setIsOpen(true)}
				>
					<AiOutlinePlus className="inline mr-1" />
					Create bookmark
				</button>
				<a className="text-sm hover:underline" href={`${API_URL}/api/logout`}>
					<FiLogOut size={24} />
					<span className="sr-only">Log out</span>
				</a>
			</header>
			<BookmarkList />
			{isOpen && (
				<Modal title="Create Bookmark" close={() => setIsOpen(false)}>
					<BookmarkEditor onSave={() => setIsOpen(false)} />
				</Modal>
			)}
		</div>
	);
};
