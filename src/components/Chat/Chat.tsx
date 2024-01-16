import styles from './Chat.module.css';
import { User } from "../../services/User.service";
import Status from '../Status/Status';
import { ActionProps } from '../../services/User.service';
import { useEffect, useRef, useState } from 'react';
import { Message, MessageService } from '../../services/Message.service';
import { Search } from '../../pages/HomePage/Search';
import { RabbitMQService } from '../../services/RabbitMQ.service';
import ICheckmark from '../SVG/Checkmark';

interface ChatProps {
    friend?: User;
    user?: User;
    privKey: Uint8Array;
    pubKey: Uint8Array;
}

export type MsgContent = {
    pattern: string,
    data: {
        sender?: string,
        receiver: string,
        date?: string,
        message?: string,
    }
};

const Chat = ({ user, friend, privKey, pubKey }: ChatProps) => {

    const [messages, setMessages] = useState<Message[]>([]);

    const [friendKey, setFriendKey] = useState<Uint8Array>(new Uint8Array());
    const [newMsg, setNewMsg] = useState<string>('');

    const [pendingMsg, setPendingMsg] = useState('');

    useEffect(() => {
        if (user) getMessages();
    }, [user]);

    useEffect(() => {
        setMessages([]);
    }, [friend]);

    const updateNewMessage = (msg: string) => {
        setPendingMsg(msg);
    }

    useEffect(() => {

    }, [])

    useEffect(() => {
        if (user) RabbitMQService.subscribe(user.username, updateNewMessage);
    }, [user]);

    useEffect(() => {
        if (pendingMsg != '') {
            verifyNewMessage(pendingMsg);
            setPendingMsg('');
        }
    }, [pendingMsg])

    const getMessages = () => {
        setInterval(() => {
            const obj = {
                receiver: user?.username
            }
            RabbitMQService.publish('message/receive', JSON.stringify(obj))
        }, 2000);
    };
    
    const verifyNewMessage = (msg: string) => {
        const obj: MsgContent = JSON.parse(msg);
        if (!obj || !obj.data) return;
        console.log(obj.data.sender);
        console.log(friend?.username);
        if (obj.data.sender === friend?.username) {
            console.log(obj.data.message);
            updateMessages(obj.data.message || '', true);
        };
    };

    const messagesRef = useRef<null | HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    const handleNewMsg = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMsg(e.target.value);
    };

    const chatHistory = (currentFriend: User) => {


    }

    const dateToHour = (date: Date) => {
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const renderMessages = () => {
        return (
            <>
                {(messages.map((msg, index) => {

                    const alignSelf = msg.fromFriend ? 'start' : 'end';
                    const backgroundColor = msg.fromFriend ? 'green' : 'white';
                    const color = msg.fromFriend ? 'white' : 'black';

                    return (
                        <div className={styles.group}>
                            <p
                                className={styles.message}
                                key={index}
                                style={{ alignSelf, backgroundColor, color }}>
                                    {msg.content}
                            </p>
                            <div style={{ alignSelf }}>
                                {msg.status === '1' && (
                                    <ICheckmark width={12} />
                                )}
                                <span className={styles.time}>{dateToHour(msg.date)}</span>
                            </div>
                        </div>
                    )
                }))}
                <div ref={messagesRef}></div>
            </>
        );
    };

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newMsg) return;
        MessageService.sendMessage(newMsg, privKey, pubKey, user?.username || '', friend?.username || '')
        updateMessages(newMsg, false);
        setNewMsg('');
    };

    const updateMessages = (msg: string, fromFriend: boolean) => {
        setMessages([...messages, {
            content: msg,
            date: new Date(),
            fromFriend,
            status: '0'
        }]);
    }

    if (!friend)
        return (
            <div className={styles.containerEmpty}>
                <h3>Start chatting with a friend from your list!</h3>
            </div>
        );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img src='user.png' alt='user' />
                <div className={styles.info}>
                    <h5>{friend.name}</h5>
                    <Status status={friend.status}/>
                </div>
            </div>
            <div className={styles.content}>
                {renderMessages()}
            </div>
            <form className={styles.footer} onSubmit={(e) => sendMessage(e)}>
                <input value={newMsg} onChange={(e) => handleNewMsg(e)}></input>
                <button type='submit' onClick={() => sendMessage}>Send</button>
            </form>
        </div>
    )
}

export default Chat;