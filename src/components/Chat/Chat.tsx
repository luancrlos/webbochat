import styles from './Chat.module.css';
import { User } from "../../services/User.service";
import Status from '../Status/Status';
import { useEffect, useRef, useState } from 'react';
import { Message } from '../../services/Message.service';

interface ChatProps {
    friend?: User;
}

const Chat = ({ friend }: ChatProps) => {

    const [messages, setMessages] = useState<Message[]>([
        {
            content: 'Oi',
            date: new Date(),
            fromFriend: true
        },
        {
            content: 'Oi',
            date: new Date(),
            fromFriend: false
        },
        {
            content: 'Tudo bem?',
            date: new Date(),
            fromFriend: true
        },
        {
            content: 'Sim e ctg?',
            date: new Date(),
            fromFriend: false
        },
        {
            content: 'To bem',
            date: new Date(),
            fromFriend: true
        },
        {
            content: 'Ta fazendo oq',
            date: new Date(),
            fromFriend: true
        },
        {
            content: '?',
            date: new Date(),
            fromFriend: true
        },
        {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            date: new Date(),
            fromFriend: false
        },
        {
            content: 'ata mo',
            date: new Date(),
            fromFriend: true
        },
        {
            content: 'kk',
            date: new Date(),
            fromFriend: true
        },
        {
            content: '.',
            date: new Date(),
            fromFriend: true
        },
        {
            content: 'oi',
            date: new Date(),
            fromFriend: true
        },
        {
            content: '?',
            date: new Date(),
            fromFriend: true
        }
    ]);

    const [newMsg, setNewMsg] = useState<string>('');

    const messagesRef = useRef<null | HTMLDivElement>(null);
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
                            <span className={styles.time} style={{ alignSelf }}>{dateToHour(msg.date)}</span>
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
        setMessages([...messages, {
            content: newMsg,
            date: new Date(),
            fromFriend: false
        }]);
        setNewMsg('');
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
                <button type='submit'>Send</button>
            </form>
        </div>
    )
}

export default Chat;