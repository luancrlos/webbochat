export const API_DEFAULT = {
	PORT: '8888',
	PROTOCOL: 'https',
	IP: 'echochat.cloud',
};

export const AMQ_API = {
	PROTOCOL: 'wss',
	PORT: '8889',
	IP: 'echochat.cloud',
	USER: 'guest',
	PWD: 'guest',
	PATH: 'ws',
};

export const API = Object.assign(API_DEFAULT, {
	URL: `${API_DEFAULT.PROTOCOL}://${API_DEFAULT.IP}:${API_DEFAULT.PORT}`,
	AMQ: `${AMQ_API.PROTOCOL}://${AMQ_API.IP}:${AMQ_API.PORT}/${AMQ_API.PATH}`
});
