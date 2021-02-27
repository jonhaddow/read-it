import React from "react";
import { Login, Dashboard, CreateBookmark } from "./pages";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import { useAuth } from "./hooks";

export const App: React.FC = () => {
	const auth = useAuth();

	// If auth is null (still fetching data)
	// then show loading indicator.
	if (!auth) {
		return <>Loading...</>;
	}

	// Check that service workers are supported
	if ("serviceWorker" in navigator && PRODUCTION) {
		// Use the window load event to keep the page load performant
		window.addEventListener("load", () => {
			void navigator.serviceWorker.register("/service-worker.js");
		});
	}

	return (
		<Router>
			<Switch>
				<Route path="/login">
					<Login />
				</Route>
				{auth.user !== null ? (
					<>
						<Route path="/create-bookmark">
							<CreateBookmark
								addBookmark={() => {
									// TODO
								}}
							/>
						</Route>
						<Route exact path="/">
							<Dashboard />
						</Route>
					</>
				) : (
					<Redirect to="/login" />
				)}
			</Switch>
		</Router>
	);
};
