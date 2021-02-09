import React from "react";

export const Login: React.FC = () => {
	return (
		<>
			<h1>Login methods</h1>
			<ul>
				<li>
					<a href="/api/auth/google">Login with Google</a>
				</li>
				<li>
					<a href="/api/auth/github">Login with Github</a>
				</li>
			</ul>
		</>
	);
};
