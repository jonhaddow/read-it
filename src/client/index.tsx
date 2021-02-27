import "regenerator-runtime/runtime";

import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { ProvideAuth } from "./services";

ReactDOM.render(
	<ProvideAuth>
		<App />
	</ProvideAuth>,
	document.getElementById("root")
);
