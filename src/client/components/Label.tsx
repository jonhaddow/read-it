import React from "react";

export const Label = (
	props: React.DetailedHTMLProps<
		React.LabelHTMLAttributes<HTMLLabelElement>,
		HTMLLabelElement
	>
): React.ReactElement => {
	return (
		<label
			{...props}
			className={`${props.className ?? ""} text-md text-gray-600 py-2 px-4`}
			htmlFor={props.htmlFor}
		/>
	);
};
