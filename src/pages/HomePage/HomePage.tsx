import { useEffect, useState } from 'react';
import FriendList from '../../components/FriendList/FriendList';
import Topbar from '../../components/Topbar/Topbar';
import styles from './HomePage.module.css';
import { User } from '../../services/User.service';
import Chat from '../../components/Chat/Chat';
import { KeyService } from '../../services/Key.service';
import { RabbitMQService } from '../../services/RabbitMQ.service';
import { Message } from '../../services/Message.service';
import GroupChat, { GroupMessage } from '../../components/GroupChat/GroupChat';
import { Storage, UserInfo } from '../../services/Storage';


export type UUID = `${string}-${string}-${string}-${string}-${string}`;

//PK = abreviação para public key
//Modificação dos nomes das constantes para diferenciar a chave pública enviada da chave pública recebida

type MsgContent = {
    pattern: string,
    data: {
        sender?: string,
        receiver: string,
        date?: string,
        message?: any,
        publickey?: string,
        chatName?: string;
    }
};

interface HomePageProps {
    user?: User;
    setFirstLogin: React.Dispatch<React.SetStateAction<boolean>>;
    firstLogin: boolean;
};

const HomePage = ({firstLogin, setFirstLogin}: HomePageProps) => {
    const [currentFriend, setCurrentFriend] = useState<User>();
    const [group, setGroup] = useState(false);
    const [privKey, setPrivKey] = useState<string>('');
    const [publicKey, setPublicKey] = useState<string>('');
    const [user, setUser] = useState<User>();
    const [pendingMsg, setPendingMsg] = useState('');
    const [friendsList, setFriendsList] = useState<User[]>([]);
    const [forceUpdate, setForceUpdate] = useState(false);

    useEffect(() => {
        const getUser = () => {
            const user = Storage.getUserSession();
            if (!user) return;
            setUser(user);  
            getKeys(user.name);
        };

        const getKeys = (username: string) => {
            const infoString = localStorage.getItem(username);
            let keys: { privateKey: string, publicKey: string };
            if (!infoString) keys =  generateKeys(username);
            else {
                const userInfo: UserInfo = JSON.parse(infoString);
                keys = {
                    privateKey: userInfo.privateKey,
                    publicKey: userInfo.publicKey
                }
            }
            setPrivKey(keys.privateKey);
            setPublicKey(keys.publicKey);
            
            if(firstLogin) setFirstLogin(false);
        };

        const generateKeys = (username: string) => {
            console.log('PRIMEIRO USO IDENTIFICADO -- GERANDO CHAVES')
            const privateKey = KeyService.genPrivateKey();
            const publicKey = KeyService.genPublicKey(privateKey);
            console.log(`CHAVE PRIVADA: ${privateKey}`);
            console.log(`CHAVE PUBLICA: ${publicKey}`);
            const privKeyStr = JSON.stringify(Array.from(privateKey));
            const pubKeyStr = JSON.stringify(Array.from(publicKey));
            localStorage.setItem(username, JSON.stringify({ privateKey: privKeyStr, publicKey: pubKeyStr, messages: []}));
            return { privateKey: privKeyStr, publicKey: pubKeyStr };
        };

        getUser();
    }, []);
    
    useEffect(() => {
        const getFriends = () => {
            if (!user) return;
            const friendLocalInfo = localStorage.getItem(`${user.name}-friends`);
            if (!friendLocalInfo) return;
            const list = JSON.parse(friendLocalInfo);
            setFriendsList(list);
        };
        getFriends();
    }, [user]);

    const publishKey = (friend: User) => {
        if (!user) return;
        const obj = {
            data: {
                sender: user.name,
                receiver: friend.username,
                publickey: publicKey,
            }
        };
        const data = JSON.stringify(obj);
        RabbitMQService.publish(friend.username, data);
    }

    useEffect(() => {
        if (!user || !friendsList) return;
        localStorage.setItem(`${user.name}-friends`, JSON.stringify(friendsList));
    }, [friendsList]);

    const newMessageFromQueue = (msg: string) => {
        setPendingMsg(msg);
    };

    const connectToQueue = () => {
        if (!user) return;
        setInterval(() => {
            const obj = {
                receiver: user.name
            }
            RabbitMQService.publish('message/receive', JSON.stringify(obj))
        }, 2000);
        
        RabbitMQService.subscribe(user.name, newMessageFromQueue);
    };

    useEffect(connectToQueue, [user]);

    const handleFriendsKeys = (object: MsgContent) => {
        if (!object.data.publickey || !user) return;
        console.log('RECEBENDO CHAVE DE AMIGO');
        const newFriendsList = friendsList.map((friend) => friend);
        let found = false;
        for (let i=0; i<newFriendsList.length; i++) {
            if (object.data.sender === newFriendsList[i].username) {
                newFriendsList[i].key = object.data.publickey;
                found = true;
            };
        };
        if (!found) {
            const name = object.data.sender || '';
            newFriendsList.push({
                name: name[0].toUpperCase() + name.slice(1),
                key: object.data.publickey,
                status: false,
                username: name,
                password: 'XXXX',
            });
        }
        setFriendsList(newFriendsList);
    };

    const handleFriendsMessages = (object: MsgContent) => {
        const dataStored = localStorage.getItem(`${object.data.receiver}-${object.data.sender}`);
        const messages = !dataStored ? [] : JSON.parse(dataStored) as Message[];

        messages.push({
            content: object.data.message,
            date: new Date(object.data.date || new Date()),
            fromFriend: true,
            status: '0'
        });
        localStorage.setItem(`${object.data.receiver}-${object.data.sender}`, JSON.stringify(messages));
        setForceUpdate(true);
    }

    const handleGroupMessages = (object: MsgContent) => {
        const dataStored = localStorage.getItem('group');
        const messages = !dataStored ? [] : JSON.parse(dataStored) as GroupMessage[];

        messages.push({
            content: object.data.message,
            date: new Date(object.data.date || new Date()),
            fromFriend: true,
            status: '0',
            friendUsername: object.data.sender
        });
        localStorage.setItem('group', JSON.stringify(messages));
        setForceUpdate(true);
    }

    const handleNewMessageFromQueue = () => {
        if (pendingMsg === '') return;

        const dataParsed: MsgContent = JSON.parse(pendingMsg);
        if (!dataParsed || !dataParsed.data) return;
        if (dataParsed.data.publickey) handleFriendsKeys(dataParsed);
        else if (dataParsed.data.chatName !== "false") handleGroupMessages(dataParsed);
        else handleFriendsMessages(dataParsed);
        
        setPendingMsg('');        
    };

    useEffect(handleNewMessageFromQueue, [pendingMsg]);

    const handleFriendListClick = (friend: User) => {
        setGroup(false);
        setCurrentFriend(friend);
    }

    const handleGroupClick = () => {
        setGroup(true);
        setCurrentFriend(undefined);
    }

    return (
        <div className={styles.page}>
            <header>
                <Topbar />
            </header>
            <div className={styles.content}>
                <div>
                    <FriendList friends={friendsList} setFriends={setFriendsList} onItemClick={handleFriendListClick} onGroupClick={handleGroupClick} publishKey={publishKey} />                    
                </div>
                <div>
                    {group ? (
                        <GroupChat user={user} friends={friendsList} privKey={privKey} publicKey={publicKey} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} />
                    ) : (
                        <Chat user={user} friend={currentFriend} privKey={privKey} publicKey={publicKey} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} />
                    )}
                </div>
            </div>
        </div>
    );
}   

export default HomePage;