import {
	pageCache,
	imageCache,
	staticResourceCache,
	offlineFallback,
} from "workbox-recipes";
import { precacheAndRoute } from "workbox-precaching";
import fetch from "node-fetch";

// Include offline.html in the manifest
precacheAndRoute(self.__WB_MANIFEST);

pageCache();

staticResourceCache();

imageCache();

offlineFallback();

// Handle POST to /bookmark which is registered in the manifest as a share target.
// When received, grab the info and pass it to the server.
self.addEventListener("fetch", (event) => {
	const url = new URL(event.request.url);
	if (event.request.method === "POST" && url.pathname === "/bookmark") {
		event.respondWith(
			(async () => {
				const formData = await event.request.formData();
				const url = formData.get("url") || formData.get("title");
				// eslint-disable-next-line no-undef
				await fetch(`${API_URL}/api/bookmark`, {
					method: "POST",
					body: JSON.stringify({ url }),
				});
				return Response.redirect("/", 303);
			})()
		);
	}
});
