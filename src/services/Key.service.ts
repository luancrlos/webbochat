import * as secp from '@noble/secp256k1';

export interface KeyProps {
    sender: string;
    receiver: string;
    publickey: string;
}

export class KeyService {
    static genPrivateKey = () => {
        const privKey = secp.utils.randomPrivateKey();
        return privKey;
    };

    static genPublicKey = (privKey: Uint8Array) => {
        const pubKey =  secp.getPublicKey(privKey);
        return pubKey;
    };

    static keyToString = (key: Uint8Array) => {
        const arr = Array.from // if available
        ? Array.from(key) // use Array#from
        : [].map.call(key, (v => v)); // otherwise map()
        // now stringify
        return JSON.stringify(arr);
    };

    static getKey = () => {
        return localStorage.getItem('privKey');
    }

    static getPubKey = () => {
        const privKey = KeyService.genPrivateKey();
        const pubKey = KeyService.genPublicKey(privKey);
        const key = KeyService.keyToString(pubKey);
        return key;  
    };
}