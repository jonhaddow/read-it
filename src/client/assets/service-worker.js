import {
	pageCache,
	imageCache,
	staticResourceCache,
	offlineFallback,
} from "workbox-recipes";
import { precacheAndRoute } from "workbox-precaching";

// Include offline.html in the manifest
precacheAndRoute(self.__WB_MANIFEST);

pageCache();

staticResourceCache();

imageCache();

offlineFallback();
