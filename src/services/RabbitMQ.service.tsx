import React from 'react';
import { useEffect, useState } from 'react';
import { RabbitMQ as RMQ, rabbitMessageCallback } from './RabbitMQ'; 

export class RabbitMQService {
	static useTopic = (topic: string | undefined) => {
		const [message, setMessage] = useState<string>();

		useEffect(() => {
			initilializeRabbit();
		}, [topic]);

		const handleMessage: rabbitMessageCallback = (msg: string) => {
			setMessage(msg);
		};
		
		const initilializeRabbit = async () => {
			if (!topic) return;
			try {
				await this.subscribe(topic, handleMessage);
			} catch(e) {
				console.log('deu errado');
			} 
		};

		return {message, setMessage};
	};

	static init = async () => {
		try {
			const server = await RMQ.getRabbit();
			return server;
		} catch(error) {
			console.log('deu errado');
			throw error;
		}
	};

	static publish = async (topic: string, data: string, ) => {
		const server = await this.init();
		if (!server) return;
		await RMQ.publish(topic, data);
	};

	static subscribe  = async (topic: string, callback: rabbitMessageCallback) => {
		const server = await this.init();
		if (!server) return;
		await RMQ.basicConsume(topic, callback);
	};

	static isConnected = () => {
		return RMQ.isConnected();
	};
}
