export const API_DEFAULT = {
	PORT: '8888',
	PROTOCOL: 'http',
	IP: '177.149.127.114',
};

export const AMQ_API = {
	PROTOCOL: 'ws',
	PORT: '8888',
	IP: '177.149.127.114',
	USER: 'guest',
	PWD: 'guest',
	PATH: 'ws',
};

export const API = Object.assign(API_DEFAULT, {
	URL: `${API_DEFAULT.PROTOCOL}://${API_DEFAULT.IP}:${API_DEFAULT.PORT}`,
	AMQ: `${API_DEFAULT.PROTOCOL}://${API_DEFAULT.IP}:${API_DEFAULT.PORT}/ws`
});
