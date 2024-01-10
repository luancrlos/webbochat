import { Message } from "./Message.service";
import { API } from "./Constants";
import request from './Request';

export interface ActionProps {
    currentFriend?: User;
    setCurrentFriend?: React.Dispatch<React.SetStateAction<User>>;
}

export interface User {
    name: string;
    status: boolean;
    messages?: Message[];
    key?: boolean;
    isClicked?: boolean;
}

export abstract class UserService {
 
    static register = async (username: string, password: string) => {
        const response = await request('post', API.URL + '', {
            data: {
                email: username,
				password,
			},
			
		});
    }
    
    static login = async (username: string, password: string) => {
        const response = await request('post', API.URL + '', {
            data: {
                email: username,
				password,
			},
		});
    }
    
    static async getList() {
        return await request('get', API.URL + '/user', {
            //
        });
    }

    static async search(username: string) {
		return await request('get', API.URL + '', {
            //
		});
	}

};