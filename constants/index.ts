import images from "./images";
import Icon from "./icons";

const MAX_INT = Number.MAX_SAFE_INTEGER;

const APP = {
	NAME: "Daily X*",
	DESC: "Abhi ni pta kuch",
	WEBSITE_URL: "https://daily-x.vercel.app/",
};

const API_URL = "https://daily-x-be.onrender.com";

const AUTH_CONFIG = {
	androidClientId: 'your-android-client-id',
	iosClientId: 'your-ios-client-id',
	webClientId: 'your-web-client-id',
};

const STORAGE_KEYS = {
	USER: "@user",
	TOKEN: "@token",
};

export { Icon, images, APP, AUTH_CONFIG, STORAGE_KEYS, API_URL, MAX_INT };
