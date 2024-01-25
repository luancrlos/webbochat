import styles from './FriendList.module.css';
import { User } from "../../services/User.service";
import { ActionProps } from '../../services/User.service';
import { useEffect, useState } from 'react';
import Status from '../Status/Status';

interface FriendListProps extends ActionProps {
    friends: User[];
    onItemClick: (friend: User) => void;
    onGroupClick: () => void;
};

const FriendList = ({ friends, onItemClick, onGroupClick }: FriendListProps) => {
    const [onlineCount, setOnlineCount] = useState<number>(0);

    useEffect(() => {
        let count = 0;
        for (let i=0; i<friends.length; i++)
            if (friends[i].status) count++;
        setOnlineCount(Math.max(0, count-1));
    }, [friends]);

    const onClickChat = (friend: User) => {
        onItemClick(friend);
    };

    const onClickGroup = () => {
        onGroupClick();
    };

    return (
        <div className={styles.container}>
            <h5 className={styles.title}>Groups: </h5>
            <div 
                className={styles.item} 
                onClick={() => onClickGroup()} 
            >
                <img src='user.png' alt='user' />
                <div className={styles.itemInfo}>
                    <div className={styles.itemTitle}>
                        <p>devs</p>
                    </div>
                </div>
            </div>
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
                                    <Status status={friend.key ? true : false}/>
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