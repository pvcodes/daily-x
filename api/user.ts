import { API_URL } from "~/constants";
import { User } from "~/types/user";

export type TokenType = "google-oauth" | "basic";

const getAuthToken = async (
	type: TokenType,
	data: { email: string; password: string } | string
) => {
	try {
		const params = new URLSearchParams({
			type,
		});
		console.log(data, type);
		let response;
		if (type === "google-oauth" && typeof data === "string") {
			response = await fetch(`${API_URL}/v1/user/token?${params}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-gaccess_token": data,
				},
			});
		} else {
			response = await fetch(`${API_URL}/v1/user/token?${params}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data), // Convert data to JSON string
			});
		}
		const responseData = await response.json(); // Removed the redundant call
		if (responseData.error) throw responseData.error;
		console.log(responseData); // Updated to log the token instead of the entire data
		return responseData as User & { auth_token: string };
	} catch (error) {
		console.log(error);
		throw error;
	}
};

const signUpAndGetToken = async (
	name: string,
	email: string,
	password: string
) => {
	try {
		const response = await fetch(`${API_URL}/v1/user/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, email, password }),
		});
		const responseData = await response.json(); // Removed the redundant call
		if (responseData.error) throw responseData.error;
		return responseData as User & { auth_token: string };
	} catch (error) {
		throw error;
	}
	//
};

const userEndpoint = {
	getAuthToken,
	signUpAndGetToken,
};

export default userEndpoint;
