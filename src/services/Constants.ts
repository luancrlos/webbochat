export const API_DEFAULT = {
	PORT: '3000',
	PROTOCOL: 'http',
	IP: '172.30.21.134',
};

export const AMQ_API = {
	PROTOCOL: 'ws',
	PORT: '15675',
	IP: '172.30.21.134',
	USER: 'guest',
	PWD: 'guest',
	PATH: 'ws',
};

export const API = Object.assign(API_DEFAULT, {
	URL: `${API_DEFAULT.PROTOCOL}://${API_DEFAULT.IP}:${API_DEFAULT.PORT}`,
	AMQ: `${AMQ_API.PROTOCOL}://${AMQ_API.IP}:${AMQ_API.PORT}/${AMQ_API.PATH}`
});
