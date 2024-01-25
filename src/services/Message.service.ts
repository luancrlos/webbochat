import * as CryptoJS from 'crypto-js';
import * as secp from '@noble/secp256k1';
import { RabbitMQService } from './RabbitMQ.service';
import { UUID } from '../pages/HomePage/HomePage';

export interface Message {
    content: string;
    date: Date;
    fromFriend: boolean;
    status: '0' | '1';
}

export class MessageService {

    static sendMessage = (message: string, privKey: Uint8Array, friendKey: Uint8Array, id: string, friendId: string, group: boolean = false) => {
        const secretDecoded = this.getSecret(privKey, friendKey);
        const cipherParams = CryptoJS.AES.encrypt(JSON.stringify({message}), secretDecoded);
        const obj = {
            sender: id,
            receiver: friendId,
            date: new Date(),
            message: cipherParams.toString(),
            chatName: group
        }
        const data = JSON.stringify(obj);
        RabbitMQService.publish('message/send', data);
    };

    static decodeMessage = (cipherText: string, privKey: Uint8Array, friendKey: Uint8Array) => {
        const secret = this.getSecret(privKey, friendKey);
        const object = CryptoJS.AES.decrypt(cipherText, secret).toString(CryptoJS.enc.Utf8);
        if (!object) return cipherText;
        return JSON.parse(object).message;
    }

    private static getSecret = (privKey: Uint8Array, friendKey: Uint8Array) => {
        const sharedSecret = secp.getSharedSecret(privKey, friendKey);
        return new TextDecoder().decode(sharedSecret);
    }
}