import { EventEmitter } from "events";

let eventEmitter: EventEmitter;

/**
 * Get the single instance of the event emitter for this server
 */
export const getEmitter = (): EventEmitter => {
	if (!eventEmitter) {
		eventEmitter = new EventEmitter();
	}

	return eventEmitter;
};
