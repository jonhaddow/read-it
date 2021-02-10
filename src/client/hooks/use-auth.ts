import { useContext } from "react";
import { authContext, AuthContextValue } from "../services";

export const useAuth = (): AuthContextValue | undefined => {
	return useContext(authContext);
};
