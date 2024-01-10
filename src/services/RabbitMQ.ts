import mqtt, { Client } from 'precompiled-mqtt';
import { AMQ_API, API } from './Constants';
export type rabbitMessageCallback = (msg: string) => void;

export class RabbitMQ {
	private static rabbit: Client;
	private static rabbitGetter: Promise<Client>;

	public static async getRabbit(): Promise<Client> {
		if (RabbitMQ.rabbitGetter) return RabbitMQ.rabbitGetter;

		RabbitMQ.rabbitGetter = new Promise<Client>((resolve, reject) => {
			try {
				if (!RabbitMQ.rabbit) {
					RabbitMQ.rabbit = mqtt.connect(API.AMQ, {
						username: AMQ_API.USER,
						password: AMQ_API.PWD,
					});
				}
	
				RabbitMQ.rabbit.on('connect', () => {
					resolve(RabbitMQ.rabbit);
				});
	
				RabbitMQ.rabbit.on('error', (err) => {
					reject(err);
					RabbitMQ.rabbit.end();
				});
			} catch(err) {
				reject(err);
			}

		});

		return RabbitMQ.rabbitGetter;
 	}

	public static async basicConsume(queue: string, callback: rabbitMessageCallback) {
		const server = RabbitMQ.rabbit;
		if (!server) return;

		server.on('message', (topic, message) => {
			if (topic == queue) {
				const decoder = new TextDecoder('utf-8');
				callback(decoder.decode(message));
			}
		});

		server.subscribe(queue, { qos: 0 }, (e) => {
			if (!e) return;
		});
	}

	public static async unsubscribe(queue: string) {
		const server = RabbitMQ.rabbit;
		if (!server) throw console.log("erro");
		server.unsubscribe(queue);
	}

	public static async closeConnection() {
		RabbitMQ.rabbit.end(true);
	}

	public static isConnecting() {
		return RabbitMQ.rabbitGetter != undefined;
	}

	public static isConnected(): boolean {
		return RabbitMQ.rabbit.connected;
	}

	public static async publish(topic: string, data: string, ) {
		const server = RabbitMQ.rabbit;
		if (!server) throw console.log("erro");
		server.publish(topic, data);
	}
}