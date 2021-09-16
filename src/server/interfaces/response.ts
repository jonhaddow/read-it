/**
 * A generic response wrapper for use between server services.
 */
export class Response<T = unknown> {
	status: number;
	error?: string;
	body?: T | null;

	constructor(status: number, body?: T | null, error?: string) {
		this.status = status;
		this.body = body;
		this.error = error;
	}

	public isSuccess(): boolean {
		return this.status < 400;
	}

	/**
	 * Returns an OK status code response with the specified body.
	 */
	static Ok<T = unknown>(body?: T): Response<T> {
		return new Response<T>(200, body);
	}
	/**
	 * Returns an CREATED status code response with the specified body.
	 */
	static Create<T = unknown>(body?: T): Response<T> {
		return new Response<T>(201, body);
	}
	/**
	 * Returns an INTERNAL ERROR status code response with the specified message.
	 */
	static ServerError<T = unknown>(message?: string): Response<T> {
		return new Response<T>(500, null, message);
	}
	/**
	 * Returns an BadRequest status code response with the specified message.
	 */
	static BadRequest<T = unknown>(message?: string): Response<T> {
		return new Response<T>(400, null, message);
	}
	/**
	 * Returns an Response based on the response provided.
	 */
	static FromResponse<T = unknown>(response: Response): Response<T> {
		return new Response<T>(response.status, null, response.error);
	}
}
