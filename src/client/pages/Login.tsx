import React from "react";
import { useLocation } from "react-router-dom";
import { Location } from "history";
import {
	GithubLoginButton,
	GoogleLoginButton,
} from "react-social-login-buttons";

export const Login: React.FC = () => {
	const from = useLocation<{ from?: Location } | undefined>()?.state?.from;
	const returnTo = from ? encodeURIComponent(from.pathname + from.search) : "/";

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="p-4 shadow-xl">
				<h1 className="mb-4 text-lg font-bold text-center">
					<span role="img" aria-label="alligator">
						🐊
					</span>{" "}
					Alligator
				</h1>
				<p className="mb-4 text-sm font-light text-center">
					Save links from across the web.
				</p>
				<ul>
					<li>
						<GoogleLoginButton
							onClick={() =>
								(window.location.href = `${API_URL}/api/auth/google?returnTo=${returnTo}`)
							}
						/>
					</li>
					<li>
						<GithubLoginButton
							onClick={() =>
								(window.location.href = `${API_URL}/api/auth/github?returnTo=${returnTo}`)
							}
						/>
					</li>
				</ul>
			</div>
		</div>
	);
};
