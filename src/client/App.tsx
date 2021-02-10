import React from "react";
import { Login, Dashboard } from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProvideAuth } from "./services";

export const App: React.FC = () => {
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
