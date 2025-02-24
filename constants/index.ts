import images from "./images";

const MAX_INT = Number.MAX_SAFE_INTEGER;

const APP = {
	NAME: "Daily X*",
	DESC: "Abhi ni pta kuch",
	WEBSITE_URL: "https://daily-x.vercel.app/",
};

const API_URL = "http://192.168.29.199:3000";

const AUTH_CONFIG = {
	androidClientId:
		"463524821846-hvor8gsr0n09f5gtd018fufckdtns3ss.apps.googleusercontent.com",
	iosClientId:
		"463524821846-dei6q2idrvlcs03dqgaalvi3oasn8vo4.apps.googleusercontent.com",
	webClientId:
		"463524821846-4crjoeq23lkld6bmjns6eokqv75jbo46.apps.googleusercontent.com",
};

// const AUTH_CONFIG = {
// 	androidClientId: process.env.GOOGLE_AUTH_CLIENTID_ANDROID,
// 	iosClientId: process.env.GOOGLE_AUTH_CLIENTID_IOS,
// 	webClientId: process.env.GOOGLE_AUTH_CLIENTID_WEB,
// };

const STORAGE_KEYS = {
	USER: "@user",
	TOKEN: "@token",
};

export { images, APP, AUTH_CONFIG, STORAGE_KEYS, API_URL, MAX_INT };
