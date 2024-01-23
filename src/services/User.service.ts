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
        status: true,
        username: 'amanda',
        password: 'senhaamanda',
        id: 'b50b892f-5740-4c25-94b3-c41823716597',
    },
    {
        name: 'Roberto Alves Neto',
        status: true,
        username: 'roberto',
        password: 'senharoberto',
        id: 'f11925f0-ebb8-43d8-af1c-3824befe49b5',
    },
    {
        name: 'Luan',
        status: true,
        username: 'luan',
        password: 'senhaluan',
        id: '6a8e8adb-81cc-48ac-a722-c6cf4d558517',
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
    
    static login = async (id: string, password: string) => {
        console.log(process.env.NODE_TLS_REJECT_UNAUTHORIZED);
        const response = await request('post', API.URL + '/auth/login', {
            data: {
                id,
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