const defaultRequestOptions: RequestInit = {
	credentials: "include",
};

const get = async (url: string): Promise<Response> => {
	return await fetch(`${API_URL}${url}`, defaultRequestOptions);
};

const post = async (url: string, body: unknown): Promise<Response> => {
	return await fetch(`${API_URL}${url}`, {
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		...defaultRequestOptions,
	});
};

/**
 * Holds a collection of methods to make requests to the server.
 */
export const Api = {
	get,
	post,
};
