import { useContext } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- seems like a bug to me :(
import { authContext, AuthContextValue } from "../services";

export const useAuth = (): AuthContextValue | undefined => {
	return useContext(authContext);
};
