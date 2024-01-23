import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API } from './Constants';
import interceptors from './Interceptor';
import { Storage } from './Storage';
export type HttpMethods = 'get' | 'post' | 'delete' | 'put' | 'patch';

export interface RequestConfig extends AxiosRequestConfig {
	noInterceptors?: boolean;
	// errorHandlerConfig?: ErrorHandlerConfig;
	entityError?: string;
}

export abstract class Request {
	static authInstance() {
		const token = Storage.getToken();
		return axios.create({
			baseURL: API.URL,
			headers: {
				Authorization: `Bearer ${token?.token}`
			},
		});
	}

	static setInterceptors(axios: AxiosInstance) {
		interceptors.forEach((interceptor) => {
			interceptor(axios);
		});
	}

	static async request(
		method: HttpMethods,
		url: string,
		{ noInterceptors, entityError = '', ...configs }: RequestConfig,		
	) {
		const axiosRequests = Request.authInstance();

		if (!noInterceptors) Request.setInterceptors(axiosRequests);

		try {
			const response = await axiosRequests.request({
				method,
				url,
				...configs,
			});
			return response.data;
		} catch (error) {
			// ErrorHandler.onRequestErrors(error as AxiosError, entityError, errorHandlerConfig);
			throw error;
		}
	}
}

export default Request.request;
