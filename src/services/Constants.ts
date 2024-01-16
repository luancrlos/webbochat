export const API_DEFAULT = {
	PORT: '',
	PROTOCOL: 'http',
	IP: '10.10.10.131',
};

export const AMQ_API = {
	PROTOCOL: 'ws',
	PORT: '15675',
	IP: '10.10.10.131',
	USER: 'guest',
	PWD: 'guest',
	PATH: 'ws',
};

export const API = Object.assign(API_DEFAULT, {
	URL: `${API_DEFAULT.PROTOCOL}://${API_DEFAULT.IP}:${API_DEFAULT.PORT}`,
	AMQ: `${AMQ_API.PROTOCOL}://${AMQ_API.IP}:${AMQ_API.PORT}/${AMQ_API.PATH}`
});
