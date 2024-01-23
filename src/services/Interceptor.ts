import { AxiosInstance } from 'axios';
import { Storage } from './Storage';


type InterceptorMethod = (axios: AxiosInstance) => void;

export const reqAuthInterceptor: InterceptorMethod = (axios) => {
	axios.interceptors.request.use(
		async (config) => {
			const token = Storage.getAccessToken();
			if (token) {
				config.headers['Authorization'] = `Bearer ${token.token}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		},
	);
};

export default [reqAuthInterceptor];
