import React from "react";
import { Login, Dashboard, CreateBookmark } from "./pages";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import { useAuth } from "./hooks";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

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
		<QueryClientProvider client={queryClient}>
			<Router>
				<Switch>
					<Route path="/login">
						<Login />
					</Route>
					<Route
						render={({ location }) =>
							auth.user !== null ? (
								<Switch>
									<Route path="/create-bookmark">
										<CreateBookmark />
									</Route>
									<Route path="/">
										<Dashboard />
									</Route>
								</Switch>
							) : (
								<Redirect
									to={{
										pathname: "/login",
										state: { from: location },
									}}
								/>
							)
						}
					/>
				</Switch>
			</Router>
		</QueryClientProvider>
	);
};
