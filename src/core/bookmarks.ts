import { User } from "./user";

export interface Bookmark {
	id: string;
	url: string;
	title?: string;
	description?: string;
	minuteEstimate?: number;
	dateCreated: Date;
	state: "created" | "processed" | "archived";
	targetURL?: string;
	thumbnailUrl?: string;
	specialType?: string;
	user: User;
}
