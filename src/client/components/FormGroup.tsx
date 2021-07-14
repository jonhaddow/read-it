import React from "react";

interface FormGroupProps {
	children: React.ReactNode;
}

export const FormGroup = ({ children }: FormGroupProps): React.ReactElement => {
	return <div className="block mb-5 pb-5 border-b">{children}</div>;
};
