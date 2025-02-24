import clsx from "clsx";
import { Linking } from "react-native";

export function cn(...classes: string[]) {
	return clsx(...classes);
}

export function handleLinkNavigation(url: string) {
	if (url) {
		Linking.openURL(url).catch((err) =>
			console.error("Failed to open URL:", err)
		);
	}
}

export const dateToString = (day: string | Date) => {
	if (typeof day === "string") {
		return new Date(day).toLocaleDateString("en-CA");
	} else {
		return day.toLocaleDateString("en-CA");
	}
};
