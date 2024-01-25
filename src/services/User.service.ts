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
        id: '66583441-8b6a-4c97-8a69-09f625804c69',
    },
    {
        name: 'eNDY',
        status: true,
        username: 'endy',
        password: '1234',
        id: "bd477d1c-f02e-4766-aae1-cd09dd07e3ae"
    },
    {
        name: 'Roberto Alves Neto',
        status: true,
        username: 'roberto',
        password: '1234',
        id: 'fc801bb8-ad15-4487-abe5-dd37996b0dd7',
    },
    {
        name: 'Luan',
        status: true,
        username: 'luan',
        password: 'senhaluan',
        id: '46158cb6-45de-471e-ad10-7fc2c497dce7',
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