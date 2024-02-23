import styles from './GroupChat.module.css';
import { User } from "../../services/User.service";
import React, { useEffect, useRef, useState } from 'react';
import { Message, MessageService } from '../../services/Message.service';
import ICheckmark from '../SVG/Checkmark';

interface ChatProps {
    user?: User;
    friends?: User[];
    privKey: string;
    publicKey: string;
    forceUpdate: boolean;
    setForceUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

export interface GroupMessage extends Message {
    friendUsername?: string;
}

const GroupChat = ({ user, privKey, publicKey, forceUpdate, setForceUpdate, friends }: ChatProps) => {

    const [messages, setMessages] = useState<GroupMessage[]>([]);
    const [newMsg, setNewMsg] = useState<string>('');

    const messagesRef = useRef<null | HTMLDivElement>(null);

    const loadMessages = () => {
        if (!friends || !user) return;
        setMessages([]);
        const data = localStorage.getItem('group');
        if (!data) return;
        const obj = JSON.parse(data) as GroupMessage[];
        const handledData = obj.map((value) => {
            if (value.fromFriend) {
                if (value.friendUsername == friends[0].username) {
                    if (friends[0].key)
                        return {...value, content: MessageService.decodeMessage(value.content, privKey, friends[0].key), date: new Date(value.date)};
                }
                else {
                    if (friends[1].key)
                        return {...value, content: MessageService.decodeMessage(value.content, privKey, friends[1].key), date: new Date(value.date)};
                }
            }
            return {...value, date: new Date(value.date)};
        });
        setMessages(handledData);
    };

    useEffect(loadMessages, [friends]);
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
        if (!newMsg || !friends) return;
        for (let i=0; i<friends.length; i++) {
            MessageService.sendMessage(newMsg, privKey, friends[i].key || '', user?.username || '', friends[i]?.username || '', true);
        }
        const mList: GroupMessage[] = [...messages, {
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
        localStorage.setItem('group', JSON.stringify(mList));
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
                            <label>{msg.friendUsername}</label>
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

    if (!messages)
        return (
            <div className={styles.containerEmpty}>
                <h3>Start chatting with your group!</h3>
            </div>
        );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img src='user.png' alt='user' />
                <div className={styles.info}>
                    <h5>devs</h5>
                    <span>Me, Amanda Serique, Roberto Alves</span>
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

export default GroupChat;