import { Message } from "./Message.service";
import { API } from "./Constants";
import { Storage, UserTokenProps } from "./Storage";
import request from './Request';

export interface ActionProps {
    currentFriend?: User;
    setCurrentFriend?: React.Dispatch<React.SetStateAction<User>>;
}

export interface User {
    name: string;
    status: boolean;
    username: string;
    id: string;
    password: string;
    messages?: Message[];
    key?: Uint8Array;
    isClicked?: boolean;
}

export const users: User[] = [
    {
        name: 'Amanda Serique Pinheiro',
        status: false,
        username: 'amanda',
        password: '1234',
        id: 'a8fb5490-b7c9-444b-b207-248c75db3685',
    },
    {
        name: 'Roberto Alves Neto',
        status: false,
        username: 'roberto',
        password: '1234',
        id: '66e5',
    },
    {
        name: 'Luan',
        status: false,
        username: 'luan',
        password: '1234',
        id: '93ef',
    }
];

export abstract class UserService {
 
    static register = async (name: string, password: string) => {
        const response = await request('post', API.URL + '/user', {
            data: {
                name,
				password,
			},
		});
        return response.name;

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
    
    static login = async (username: string, password: string) => {
        console.log(process.env.NODE_TLS_REJECT_UNAUTHORIZED);
        const response = await request('post', API.URL + '/auth/login', {
            data: {
                name: username,
                password,
            },
        });

        const { access_token, user } = response;
        Storage.setUserSession({ ...user });

        const accessToken: UserTokenProps = {
            token: access_token.token,
        };

        Storage.setToken(accessToken);
        return response;
    };

    static logout = () => {
		Storage.logout();
		document.location.href = "/";
	};
};