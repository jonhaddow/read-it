import React, { createContext, useEffect, useState } from "react";
import { Api } from ".";

interface User {
	id: string;
	email: string;
}

export interface AuthContextValue {
	user?: User | null;
}

export const authContext = createContext<AuthContextValue | undefined>(
	undefined
);

export const ProvideAuth: React.FC = ({ children }) => {
	const [user, setUser] = useState<User | null>();

	useEffect(() => {
		const getUser = async (): Promise<void> => {
			const response = await Api.get("/api/users/me");
			if (response.status == 200) {
				const user = (await response.json()) as User;
				setUser(user);
			} else if (response.status == 401) {
				setUser(null);
			} else {
				throw new Error("Unknown status code");
			}
		};

		void getUser();
	}, []);

	return (
		<authContext.Provider value={{ user }}>
			{user === undefined || children}
		</authContext.Provider>
	);
};
