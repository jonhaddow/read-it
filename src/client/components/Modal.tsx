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
		<div className="bg-opacity-70 bg-gray-400 fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
			<div
				ref={modal}
				role="dialog"
				aria-labelledby="dialog_label"
				aria-modal="true"
				className="p-6 bg-white relative shadow-lg rounded-md"
			>
				{title && (
					<h2 id="dialog_label" className="hidden">
						{title}
					</h2>
				)}
				<button className="absolute top-0 right-0 p-2" onClick={close}>
					<FaTimes size={24} className="fill-current text-gray-600" />
				</button>
				<div>{children}</div>
			</div>
		</div>,
		modalRootNode
	);
};
