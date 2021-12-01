import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";
interface ModalProps {
	close: () => void;
	children: React.ReactNode;
	title?: string;
}

export const Modal = ({
	title,
	close,
	children,
}: ModalProps): React.ReactElement => {
	const modalRootNode = document.getElementById("modal");
	const modal = useRef<HTMLDivElement>(null);

	if (!modalRootNode) throw Error("Cannot find modal root node");

	// Close modal on "Escape"
	useEffect(() => {
		const onKeyDown = (k: KeyboardEvent): void => {
			if (k.key === "Escape") close();
		};

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [close]);

	return ReactDOM.createPortal(
		<div className="flex fixed top-0 right-0 bottom-0 left-0 justify-center items-center bg-gray-400 bg-opacity-70">
			<div
				ref={modal}
				role="dialog"
				aria-labelledby="dialog_label"
				aria-modal="true"
				className="relative p-6 bg-white rounded-md shadow-lg"
			>
				{title && (
					<h2 id="dialog_label" className="hidden">
						{title}
					</h2>
				)}
				<button className="absolute top-0 right-0 p-2" onClick={close}>
					<FaTimes
						size={24}
						className="text-gray-500 hover:text-gray-600 fill-current"
					/>
				</button>
				<div className="px-2 pt-2">{children}</div>
			</div>
		</div>,
		modalRootNode
	);
};
