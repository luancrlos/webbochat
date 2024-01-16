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
    username: string;
    password: string;
    messages?: Message[];
    key?: boolean;
    isClicked?: boolean;
}

export const users: User[] = [
    {
        name: 'Amanda Serique Pinheiro',
        status: false,
        username: 'amanda',
        password: 'Admin1234'
    },
    {
        name: 'Roberto Alves Neto',
        status: false,
        username: 'roberto',
        password: 'Admin1234'
    },
    {
        name: 'Luan',
        status: false,
        username: 'luan',
        password: 'Admin1234'
    }
];

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