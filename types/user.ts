import { TokenType } from "@/api";

export interface User {
	email: string;
	name: string;
	img_url: string;
    auth_type: TokenType
}
