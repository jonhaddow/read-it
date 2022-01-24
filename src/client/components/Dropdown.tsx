import * as React from "react";
import { useSelect } from "downshift";
import { usePopper } from "react-popper";

export function Dropdown(): React.ReactElement | null {
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

	const [referenceElement, setReferenceElement] = React.useState(null);
	const [popperElement, setPopperElement] =
		React.useState<HTMLUListElement | null>(null);
	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement: "right",
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
			<button
				id="dropdown"
				ref={setReferenceElement}
				{...getToggleButtonProps()}
			>
				{selectedItem || "Default"}
			</button>
			<div {...getMenuProps()}>
				{isOpen && (
					<ul
						ref={setPopperElement}
						{...attributes.popper}
						style={styles.popper}
						className="bg-white"
					>
						{items.map((item, index) => (
							<li key={`${item}${index}`} {...getItemProps({ item, index })}>
								{item}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
