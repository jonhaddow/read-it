import React from "react";
import { useLocation } from "react-router-dom";
import { Location } from "history";

export const Login: React.FC = () => {
	const location = useLocation<{ from?: Location }>();
	const { from } = location.state;

	return (
		<>
			<h1>Login methods</h1>
			<ul>
				<li>
					<a
						href={`${API_URL}/api/auth/google?returnTo=${
							from ? from.pathname + from.search : "/"
						}`}
					>
						Login with Google
					</a>
				</li>
				<li>
					<a href={`${API_URL}/api/auth/github`}>Login with Github</a>
				</li>
			</ul>
		</>
	);
};
