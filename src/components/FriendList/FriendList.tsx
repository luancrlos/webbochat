import styles from './FriendList.module.css';
import { User } from "../../services/User.service";
import { ActionProps } from '../../services/User.service';
import { useEffect, useState } from 'react';
import Status from '../Status/Status';
import { Search } from '../../pages/HomePage/Search';
import { RabbitMQService } from '../../services/RabbitMQ.service';

interface FriendListProps extends ActionProps {
    friends: User[];
    onItemClick: (friend: User) => void;
};

const FriendList = ({ friends, onItemClick }: FriendListProps) => {
    const [currentFriend, setCurrentFriend] = useState<User>();
    const [onlineCount, setOnlineCount] = useState<number>(0);

    useEffect(() => {
        let count = 0;
        for (let i=0; i<friends.length; i++)
            if (friends[i].status) count++;
        setOnlineCount(count);
    }, [friends]);

    // useEffect(() => {
    //     RabbitMQService.subscribe('message.receive', () => {return});
    // }, []);

    const onClickChat = (friend: User) => {
        onItemClick(friend); 
        RabbitMQService.subscribe('message.receive', () => {return});
    };

    //2)
    //if that friend is clicked for the first time after login
    //generate a key for encryption

    //3)
    //create a function to display the message history
    //every time a friend is clicked, call this function and display the message history

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