import styles from './FriendList.module.css';
import { User } from "../../services/User.service";
import { ActionProps } from '../../services/User.service';
import { useEffect, useState } from 'react';
import Status from '../Status/Status';
import { KeyService } from '../../services/Key.service';
import { RabbitMQService } from '../../services/RabbitMQ.service';

interface FriendListProps extends ActionProps {
    friends: User[];
    onItemClick: (friend: User) => void;
};

const FriendList = ({ friends, onItemClick }: FriendListProps) => {
    const [onlineCount, setOnlineCount] = useState<number>(0);

    useEffect(() => {
        let count = 0;
        for (let i=0; i<friends.length; i++)
            if (friends[i].status) count++;
        setOnlineCount(count);
    }, [friends]);

    const generateKey = () => {
        const privKey = KeyService.genPrivateKey();
        const pubKey = KeyService.genPublicKey(privKey);
        const key = KeyService.keyToString(pubKey);
        return key;
    };

    const onClickChat = (friend: User) => {
        onItemClick(friend); 
        const publicKey = generateKey();
        const obj = {
            receiver: friend.name,
            publickey: publicKey, 
        }
        const data = JSON.stringify(obj);
        RabbitMQService.publish('message/publickey', data);
    };

    return (
        <div className={styles.container}>
            <h5 className={styles.title}>Friends Online: {onlineCount}</h5>
            <div className={styles.list}>
                {(friends.map((friend, index) => {
                    return (
                        <div 
                            className={styles.item} 
                            onClick={() => onClickChat(friend)} 
                            key={index}
                        >
                            <img src='user.png' alt='user' />
                            <div className={styles.itemInfo}>
                                <div className={styles.itemTitle}>
                                    <p>{friend.name}</p>
                                    <Status status={friend.status}/>
                                </div>
                            </div>
                        </div>
                    )
                }))}
            </div>
        
        </div>
    );
};

export default FriendList;