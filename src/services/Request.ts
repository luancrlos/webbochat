import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { API } from './Constants';

export type HttpMethods = 'get' | 'post' | 'put';

export interface RequestConfig extends AxiosRequestConfig {
	noInterceptors?: boolean;
}

export abstract class Request {
	static authInstance() {
		
		return axios.create({
			baseURL: API.URL,
		});
	}

	static async request(
		method: HttpMethods,
		url: string,
		{ noInterceptors, ...configs }: RequestConfig,		
	) {
		const axiosRequests = Request.authInstance();

		try {
			const response = await axiosRequests.request({
				method,
				url,
				...configs,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}
}

export default Request.request;
