import React from "react";
import { Login } from "./Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { ProvideAuth } from "./Authentication";

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
