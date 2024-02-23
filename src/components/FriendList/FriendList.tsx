import styles from './FriendList.module.css';
import { User, UserService } from "../../services/User.service";
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

    const [search, setSearch] = useState('');

    const onClickChat = (friend: User) => {
        if (friend.key && friend.status) onItemClick(friend);
    };

    const onClickGroup = () => {
        onGroupClick();
    };

    const sendAndAcceptRequests = (index: number) => {
        publishKey(friends[index]);
        const updatedList = friends.map((friend) => friend);
        updatedList[index].status = true;
        setFriends(updatedList);
    }

    const checkAllFriendsAdded = () => {
        for (let i=0; i<friends.length; i++) {
            if (!friends[i].key || !friends[i].status) return false;
        }
        return true;
    }

    const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    const addFriend = async () => {
        try {
            const response = await UserService.search(search.replace('#', '%23'));
            if (!response) throw Error();
            const updatedList = friends.map((friend) => friend);

            const name = response.name.split('#')[0];
            const id = response.name.split('#')[1];

            const newFriend: User = {
                name: name[0].toUpperCase() + name.slice(1),
                status: true,
                username: name,
                password: 'XXXX',
                id,
            };
            updatedList.push(newFriend);
            setFriends(updatedList);
            publishKey(newFriend)
;        } catch (error) {
            alert('No user found!')
        }
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
                                        <button type='button' onClick={() => sendAndAcceptRequests(index)}>Accept Request</button>
                                    )}
                                    {friend.status && !friend.key && (
                                        <span className={styles.pending}>Pending request...</span>
                                    )}
                                    {!friend.status && !friend.key && (
                                        <button type='button' onClick={() => sendAndAcceptRequests(index)}>Send Request</button>
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
            <div className={styles.searchGroup}>
                <input value={search} onChange={(onChangeSearch)} />
                <button type='button' onClick={() => addFriend()}>Add User</button>
            </div>
            <h5 className={styles.title}>Friends</h5>
            <div className={styles.list}>
                {renderFriends()}
            </div>
        
        </div>
    );
};

export default FriendList;