import {
	pageCache,
	imageCache,
	staticResourceCache,
	offlineFallback,
} from "workbox-recipes";

// Respond to page requests with a network first caching strategy
pageCache();

// Respond to CSS, JavaScript, and Web Worker requests with a stale-while-revalidate strategy
staticResourceCache();

// Respond to image requests with a cache first strategy
imageCache();

// Provide an offline fallback for page requests (offline.html)
offlineFallback();
