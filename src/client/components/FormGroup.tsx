import React from "react";

interface FormGroupProps {
	children: React.ReactNode;
}

export const FormGroup = ({ children }: FormGroupProps): React.ReactElement => {
	return <div className="block pb-5 mb-5">{children}</div>;
};
