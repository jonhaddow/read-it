import React from "react";
import { Redirect } from "react-router-dom";
import { BookmarksList } from "../components";
import { useAuth } from "../hooks";

export const Dashboard: React.FC = () => {
	const auth = useAuth();

	// If auth is null (still fetching data)
	// or false (logged out, above hook will redirect)
	// then show loading indicator.
	if (!auth) {
		return <>Loading...</>;
	}

	return (
		<>{auth.user == null ? <Redirect to="/login" /> : <BookmarksList />}</>
	);
};
