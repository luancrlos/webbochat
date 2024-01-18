import { useEffect, useState } from 'react';
import FriendList from '../../components/FriendList/FriendList';
import Topbar from '../../components/Topbar/Topbar';
import styles from './HomePage.module.css';
import { User, users } from '../../services/User.service';
import Chat from '../../components/Chat/Chat';
import { KeyService } from '../../services/Key.service';
import { RabbitMQService } from '../../services/RabbitMQ.service';
import { Message } from '../../services/Message.service';


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
    }
};

interface HomePageProps {
    user?: User;
    setFirstLogin: React.Dispatch<React.SetStateAction<boolean>>;
    firstLogin: boolean;
};

const HomePage = ({firstLogin, setFirstLogin}: HomePageProps) => {
    const [currentFriend, setCurrentFriend] = useState<User>();
    const [privKey, setPrivKey] = useState<Uint8Array>(new Uint8Array());
    const [publicKey, setPublicKey] = useState<Uint8Array>(new Uint8Array());
    const [user, setUser] = useState<User>();
    const [pendingMsg, setPendingMsg] = useState('');
    const [friendsList, setFriendsList] = useState<User[]>([]);
    const [forceUpdate, setForceUpdate] = useState(false);

    useEffect(() => {
        const getUser = () => {
            const username = localStorage.getItem('username');
            if (!username) return;
            for (let i=0; i<users.length; i++) {
                if (username === users[i].username) setUser(users[i]);
            };
        };

        const setKeys = () => {
            const storedPrivKey = localStorage.getItem('priv-key');
            const storedPubKey = localStorage.getItem('pub-key');
            if (!storedPrivKey || !storedPubKey) {
                const privateKey = KeyService.genPrivateKey();
                setPrivKey(privateKey);

                const pubKey = KeyService.genPublicKey(privateKey);
                setPublicKey(pubKey);

                localStorage.setItem('priv-key', JSON.stringify(Array.from(privateKey)));
                localStorage.setItem('pub-key', JSON.stringify(Array.from(pubKey)));
            }
            else {
                const privateKey = new Uint8Array(JSON.parse(storedPrivKey));
                const pubKey = new Uint8Array(JSON.parse(storedPubKey));

                setPrivKey(privateKey);
                setPublicKey(pubKey);
            }
            
            if(firstLogin) setFirstLogin(false);
        };

        getUser();
        setKeys();
    }, []);
    
    useEffect(() => {
        const getFriends = () => {
            if (!user) return;
            let friends: User[] = [];
            for (let i=0; i<users.length; i++) {
                if (users[i].username !== user.username) friends.push(users[i]); 
            };
            setFriendsList(friends);
        };
        getFriends();
    }, [user]);

    const publishKey = (user: User, friend: User) => {
        const obj = {
            data: {
                sender: user.username,
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
            if (users[i].username !== user.username) {
                publishKey(user, users[i]);
            };
        };
    }, [user])

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
                receiver: user.username
            }
            RabbitMQService.publish('message/receive', JSON.stringify(obj))
        }, 2000);
        
        RabbitMQService.subscribe(user.username, newMessageFromQueue);
    };

    useEffect(connectToQueue, [user]);

    const handleFriendsKeys = (object: MsgContent) => {
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

    const handleNewMessageFromQueue = () => {
        if (pendingMsg === '') return;

        const dataParsed: MsgContent = JSON.parse(pendingMsg);
        if (!dataParsed || !dataParsed.data) return;
        if (dataParsed.data.publickey) handleFriendsKeys(dataParsed);
        else handleFriendsMessages(dataParsed);
        
        setPendingMsg('');        
    };

    useEffect(handleNewMessageFromQueue, [pendingMsg]);

    return (
        <div className={styles.page}>
            <header>
                <Topbar />
            </header>
            <div className={styles.content}>
                <div>
                    {users &&  
                        <FriendList friends={friendsList} onItemClick={setCurrentFriend} />                    
                    }
                </div>
                <div>
                    <Chat user={user} friend={currentFriend} privKey={privKey} publicKey={publicKey} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} />
                </div>
            </div>
        </div>
    );
}   

export default HomePage;