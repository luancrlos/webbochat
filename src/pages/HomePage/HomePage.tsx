import { useEffect, useState } from 'react';
import FriendList from '../../components/FriendList/FriendList';
import Topbar from '../../components/Topbar/Topbar';
import styles from './HomePage.module.css';
import { User, users } from '../../services/User.service';
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
        publickey?: Uint8Array
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
    const [privKey, setPrivKey] = useState<Uint8Array>(new Uint8Array());
    const [publicKey, setPublicKey] = useState<Uint8Array>(new Uint8Array());
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
            let keys: { privateKey: Uint8Array, publicKey: Uint8Array };
            if (!infoString) keys =  generateKeys(username);
            else {
                const userInfo: UserInfo = JSON.parse(infoString);
                const array = JSON.parse(userInfo.privateKey);
                keys = { privateKey: new Uint8Array(JSON.parse(userInfo.privateKey)), publicKey: new Uint8Array(JSON.parse(userInfo.publicKey)) }
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
            localStorage.setItem(username, JSON.stringify({ privateKey: JSON.stringify(Array.from(privateKey)), publicKey: JSON.stringify(Array.from(publicKey)), messages: []}));
            return { privateKey, publicKey };
        };

        getUser();
    }, []);
    
    useEffect(() => {
        const getFriends = () => {
            if (!user) return;
            let friends: User[] = [];
            for (let i=0; i<users.length; i++) {
                if (users[i].username !== user.name) friends.push(users[i]); 
            };
            setFriendsList(friends);
        };
        getFriends();
    }, [user]);

    const publishKey = (user: User, friend: User) => {
        const obj = {
            data: {
                sender: user.name,
                receiver: friend.username,
                publickey: Array.from(publicKey),
            }
        };
        const data = JSON.stringify(obj);
        RabbitMQService.publish(friend.username, data);
    }

    useEffect(() => {
        if (!user) return;
        for (let i=0; i<users.length; i++) {
            if (users[i].username !== user.name) {
                publishKey(user, users[i]);
            };
        };
    }, [publicKey, privKey])

    useEffect(() => {
        localStorage.setItem('friends-list', JSON.stringify(friendsList));
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
        console.log('RECEBENDO CHAVE DE AMIGO');
        if (!object.data.publickey || !user) return;
        const newFriendsList = [...friendsList];
        for (let i=0; i<newFriendsList.length; i++) {
            if (object.data.sender === newFriendsList[i].username) {
                if (newFriendsList[i].key) return;
                newFriendsList[i].key = new Uint8Array(Array.from(object.data.publickey));
                publishKey(user, newFriendsList[i]);
            };
        };
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
                    {users &&  
                        <FriendList friends={friendsList} onItemClick={handleFriendListClick} onGroupClick={handleGroupClick} />                    
                    }
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