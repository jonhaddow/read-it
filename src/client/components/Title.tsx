import React from "react";

interface TitleProps {
	as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	children: React.ReactNode;
	className?: string;
}

export const Title = ({
	children,
	as,
	className,
}: TitleProps): React.ReactElement =>
	React.createElement(
		as,
		{
			className: `uppercase text-gray-700 text-sm font-bold ${className ?? ""}`,
		},
		children
	);
