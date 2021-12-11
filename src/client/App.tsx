import React, { useEffect } from "react";
import { CreateBookmark, Dashboard, Login } from "./pages";
import {
	Redirect,
	Route,
	BrowserRouter as Router,
	Switch,
} from "react-router-dom";
import { useAuth } from "./hooks";
import { QueryClient, QueryClientProvider } from "react-query";
import { DarkModeToggle } from "./components";

const queryClient = new QueryClient();

export const App: React.FC = () => {
	const auth = useAuth();

	useEffect(() => {
		// Check that service workers are supported before registering
		if ("serviceWorker" in navigator && PRODUCTION) {
			void navigator.serviceWorker.register("/worker.js"); // Same name as webpack bundle
		}
	}, []);

	// If auth is null (still fetching data)
	// then show loading indicator.
	if (!auth) {
		return <>Loading...</>;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<DarkModeToggle />
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
