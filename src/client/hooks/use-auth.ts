import { useContext } from "react";
import { AuthContextValue, authContext } from "../services";

export const useAuth = (): AuthContextValue | undefined => {
	return useContext(authContext);
};
