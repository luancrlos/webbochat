import styles from './Chat.module.css';
import { User } from "../../services/User.service";
import Status from '../Status/Status';
import React, { useEffect, useRef, useState } from 'react';
import { Message, MessageService } from '../../services/Message.service';
import ICheckmark from '../SVG/Checkmark';

interface ChatProps {
    friend?: User;
    user?: User;
    privKey: Uint8Array;
    publicKey: Uint8Array;
    forceUpdate: boolean;
    setForceUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

const Chat = ({ user, friend, privKey, publicKey, forceUpdate, setForceUpdate }: ChatProps) => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMsg, setNewMsg] = useState<string>('');

    const messagesRef = useRef<null | HTMLDivElement>(null);

    const loadMessages = () => {
        if (!friend  || !friend.key || !user) return;
        const friendKey = friend.key;
        setMessages([]);
        const data = localStorage.getItem(`${user.username}-${friend.username}`);
        if (!data) return;
        const obj = JSON.parse(data) as Message[];
        const handledData = obj.map((value) => {
            if (value.fromFriend)
                return {...value, content: MessageService.decodeMessage(value.content, privKey, friendKey), date: new Date(value.date)};
            return {...value, date: new Date(value.date)};
        });
        setMessages(handledData);
    };

    useEffect(loadMessages, [friend]);
    useEffect(() => {
        if (!forceUpdate) return;
        loadMessages();
        setForceUpdate(false);
    }, [forceUpdate]);

    const scrollToBottom = () => {
        messagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleNewMsg = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMsg(e.target.value);
    };

    const dateToHour = (date: Date) => {
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newMsg || !friend || !friend.key) return;
        MessageService.sendMessage(newMsg, privKey, friend.key, user?.username || '', friend?.username || '');
        const mList: Message[] = [...messages, {
            content: newMsg,
            date: new Date(),
            fromFriend: false,
            status: '0'
        }];
        saveToCache(mList);
        setMessages(mList);
        setNewMsg('');
    };
    
    const saveToCache = (mList: Message[]) => {
        localStorage.setItem(`${user?.username}-${friend?.username}`, JSON.stringify(mList));
    };

    const renderMessages = () => {
        return (
            <>
                {(messages.map((msg, index) => {

                    const alignSelf = msg.fromFriend ? 'start' : 'end';
                    const backgroundColor = msg.fromFriend ? 'green' : 'white';
                    const color = msg.fromFriend ? 'white' : 'black';

                    return (
                        <div className={styles.group} key={index}>
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