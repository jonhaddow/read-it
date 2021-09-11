import React from "react";

interface StateMessageProps {
	children?: string;
}

export const StateMessage = (props: StateMessageProps): React.ReactElement => {
	return <p className="text-lg text-center text-gray-700">{props.children}</p>;
};
