import { Message } from "./Message.service";
import { User } from "./User.service";

export interface UserTokenProps {
	token?: string;
}

export interface UserInfo {
	privateKey: string;
	publicKey: string;
	messages: Message[];
}

export type TokenTypes = keyof UserTokenProps;

export abstract class Storage {
	static async setToken(userToken: UserTokenProps) {
		if (!userToken.token) return;
		window.localStorage.setItem('access_token', JSON.stringify(userToken));
	}

	static getToken(): UserTokenProps | undefined {
		const tokensStr = window.localStorage.getItem('access_token');
		if (!tokensStr) return;
		const objToken: UserTokenProps = JSON.parse(tokensStr);
		return objToken;
	}

	static getAccessToken(): UserTokenProps | undefined {
		return this.getToken();
	}

	static removeToken() {
		window.localStorage.removeItem('access_token');
	}

	static logout = () => {
		this.removeToken();
		this.removeUserSession();
		document.location.href = "/";
	};

	static getUserSession = (): User | undefined => {
		const user = window.localStorage.getItem('user');
		if (!user) return;
		return JSON.parse(user) as User;
	};

	static setUserSession = (user: User) => {
		window.localStorage.setItem('user', JSON.stringify(user));
	};

	static removeUserSession = () => {
		window.localStorage.removeItem('user');
	};

	static saveUserInfo = (username: string, userInfo: UserInfo) => {
		localStorage.setItem(username, JSON.stringify(userInfo));
	}
}
