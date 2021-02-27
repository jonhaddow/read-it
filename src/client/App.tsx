import React from "react";
import { Login, Dashboard } from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProvideAuth } from "./services";

export const App: React.FC = () => {
	// Check that service workers are supported
	if ("serviceWorker" in navigator && PRODUCTION) {
		// Use the window load event to keep the page load performant
		window.addEventListener("load", () => {
			void navigator.serviceWorker.register("/service-worker.js");
		});
	}
	return (
		<ProvideAuth>
			<Router>
				<Switch>
					<Route path="/login">
						<Login />
					</Route>
					<Route path="/">
						<Dashboard />
					</Route>
				</Switch>
			</Router>
		</ProvideAuth>
	);
};
