import { AES } from 'crypto-js';
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

    static sendMessage = (msg: string, privKey: Uint8Array, friendKey: Uint8Array, id: string, friendId: string) => {
        const sharedSecret = secp.getSharedSecret(privKey, friendKey);
        const secretDecoded = new TextDecoder().decode(sharedSecret);
        const ciphertext = AES.encrypt(msg, secretDecoded);
        const obj = {
            sender: id,
            receiver: friendId,
            date: new Date(),
            message: msg,
        }
        const data = JSON.stringify(obj);
        RabbitMQService.publish('message/send', data);
    };

    // static genPubliacKey = async () => {

    //     const privKey = secp.utils.randomPrivateKey(); // Secure random private key
    //     // sha256 of 'hello world'
    //     const msgHash = 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';

    //     const pubKey2 = secp.getPublicKey(secp.utils.randomPrivateKey()); // Key of user 2
    //     const sharedSecret = secp.getSharedSecret(privKey, pubKey); // Elliptic curve diffie-hellman
    //     signature.recoverPublicKey(msgHash); // Public key recovery
    //     const ciphertext = AES.encrypt('Hello, world!', sharedSecret.toString()).toString();
    //     console.log(ciphertext);

    //     // Decrypt
    //     const bytes = AES.decrypt(ciphertext, sharedSecret.toString());
    //     // const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
    // }
}