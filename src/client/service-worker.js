import {
	pageCache,
	imageCache,
	staticResourceCache,
	offlineFallback,
} from "workbox-recipes";
import { precacheAndRoute } from "workbox-precaching";
import fetch from "node-fetch";
import { registerRoute } from "workbox-routing";

// Include offline.html in the manifest
precacheAndRoute(self.__WB_MANIFEST);

pageCache();

staticResourceCache();

imageCache();

offlineFallback();

// Handle POST to /bookmark which is registered in the manifest as a share target.
// When received, grab the info and pass it to the server.
const shareTargetHandler = async ({ event }) => {
	const formData = await event.request.formData();

	// No clue what platform is going to send what parameter...
	const url =
		formData.get("url") || formData.get("title") || formData.get("text");

	// eslint-disable-next-line no-undef
	await fetch(`${API_URL}/api/bookmark`, {
		method: "POST",
		body: JSON.stringify({ url }),
	});

	// After the POST succeeds, redirect to the main page.
	return Response.redirect("/", 303);
};

registerRoute("/_share-target", shareTargetHandler, "POST");
