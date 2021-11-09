const defaultRequestOptions: RequestInit = {
	credentials: "include",
};

const get = async (
	url: string,
	params?: Record<string, string | number>
): Promise<Response> => {
	let query = `${API_URL}${url}`;

	if (params) {
		const queryParams = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			queryParams.append(key, `${value}`);
		}
		query += `?${queryParams.toString()}`;
	}

	return await fetch(query, defaultRequestOptions);
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

const del = async (url: string): Promise<Response> => {
	return await fetch(`${API_URL}${url}`, {
		method: "DELETE",
		...defaultRequestOptions,
	});
};

/**
 * Holds a collection of methods to make requests to the server.
 */
export const Api = {
	get,
	post,
	del,
};
