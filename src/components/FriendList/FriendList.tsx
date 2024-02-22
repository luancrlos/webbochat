import styles from './FriendList.module.css';
import { User } from "../../services/User.service";
import { ActionProps } from '../../services/User.service';
import { useEffect, useState } from 'react';
import Status from '../Status/Status';

interface FriendListProps extends ActionProps {
    friends: User[];
    setFriends: React.Dispatch<React.SetStateAction<User[]>>;
    onItemClick: (friend: User) => void;
    onGroupClick: () => void;
    publishKey: (friend: User) => void;
};

const FriendList = ({ friends, setFriends, onItemClick, onGroupClick, publishKey }: FriendListProps) => {

    const onClickChat = (friend: User) => {
        if (friend.key && friend.status) onItemClick(friend);
    };

    const onClickGroup = () => {
        onGroupClick();
    };

    const acceptRequest = (index: number) => {
        const updatedList = friends.map((friend) => {
            if (!friend.key) return friend;
            const key = friend.key.toString();
            friend.key = new Uint8Array(JSON.parse(key));
            return friend;
        });
        updatedList[index].status = true;
        setFriends(updatedList);
    }

    const sendRequest = (index: number) => {
        publishKey(friends[index]);
        acceptRequest(index);
    }

    const checkAllFriendsAdded = () => {
        for (let i=0; i<friends.length; i++) {
            if (!friends[i].key || !friends[i].status) return false;
        }
        return true;
    }

    const renderFriends = () => {
        return (
            <>
                {(friends.map((friend, index) => {
                    return (
                        <div 
                            className={styles.item} 
                            onClick={() => onClickChat(friend)} 
                            key={index}
                            style={{ 
                                    cursor: friend.key && friend.status ? 'pointer' : 'auto', 
                                    backgroundColor: friend.key && friend.status ? 'white' : 'lightgray'
                                }}
                        >
                            <img src='user.png' alt='user' />
                            <div className={styles.itemInfo}>
                                <div className={styles.itemTitle}>
                                    <p>{friend.name}</p>
                                    {!friend.status && friend.key && (
                                        <button type='button' onClick={() => acceptRequest(index)}>Accept Request</button>
                                    )}
                                    {friend.status && !friend.key && (
                                        <span className={styles.pending}>Pending request...</span>
                                    )}
                                    {!friend.status && !friend.key && (
                                        <button type='button' onClick={() => sendRequest(index)}>Send Request</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }))}
            </>
        )
    }

    return (
        <div className={styles.container}>
            <h5 className={styles.title}>Groups: </h5>
            {checkAllFriendsAdded() && (
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
            )}
            <h5 className={styles.title}>Users</h5>
            <div className={styles.list}>
                {renderFriends()}
            </div>
        
        </div>
    );
};

export default FriendList;