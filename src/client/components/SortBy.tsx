import * as React from "react";
import { useSelect } from "downshift";
import { usePopper } from "react-popper";

export function SortBy(): React.ReactElement | null {
	const items = [
		"Newly added",
		"Oldest added",
		"Longest content",
		"Shortest content",
	];

	const {
		isOpen,
		selectedItem,
		getLabelProps,
		getItemProps,
		getToggleButtonProps,
		getMenuProps,
	} = useSelect({
		items,
	});

	const [referenceElement, setReferenceElement] =
		React.useState<HTMLDivElement | null>(null);
	const [popperElement, setPopperElement] =
		React.useState<HTMLDivElement | null>(null);
	const [arrowElement, setArrowElement] = React.useState<HTMLDivElement | null>(
		null
	);

	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement: "bottom-end",
		modifiers: [{ name: "arrow", options: { element: arrowElement } }],
	});

	return (
		<div className="mx-2">
			<label
				htmlFor="dropdown"
				className="pr-2 text-text-secondary"
				{...getLabelProps()}
			>
				Sort by:
			</label>
			<div ref={setReferenceElement} className="inline">
				<button id="dropdown" {...getToggleButtonProps()}>
					{selectedItem || "Default"}
				</button>
			</div>
			{isOpen && (
				<div
					className="z-10"
					ref={setPopperElement}
					{...attributes.popper}
					style={styles.popper}
				>
					<div
						ref={setArrowElement}
						style={styles.arrow}
						className="border-8 border-x-transparent border-t-transparent border-b-card-shade border-solid rotate-[-135deg]"
					/>
					<ul
						{...getMenuProps()}
						className="overflow-hidden mt-4 bg-card-shade rounded-lg shadow-lg"
					>
						{items.map((item, index) => (
							<li
								key={`${item}${index}`}
								{...getItemProps({ item, index })}
								className="p-2 text-sm hover:bg-card-shade-hover cursor-pointer"
							>
								{item}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
