import { useEffect, useState } from 'react';
import FriendList from '../../components/FriendList/FriendList';
import Topbar from '../../components/Topbar/Topbar';
import styles from './HomePage.module.css';
import { User, users } from '../../services/User.service';
import Chat from '../../components/Chat/Chat';
import { KeyService } from '../../services/Key.service';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

interface HomePageProps {
    user: User;
};

const HomePage = () => {
    const [currentFriend, setCurrentFriend] = useState<User>();

    const [privKey, setPrivKey] = useState<Uint8Array>(new Uint8Array());
    const [pubKey, setPubKey] = useState<Uint8Array>(new Uint8Array());
    const [user, setUser] = useState<User>();
    const [username, setUsername] = useState('');

    // const getFriendList = async() => {
    //     const list = await UserService.getList();
    //     setFriends(list);
    // };

    useEffect(() => {
        const setKeys = () => {
            const privateKey = KeyService.genPrivateKey();
            setPrivKey(privateKey);
            setPubKey(KeyService.genPublicKey(privateKey));
            setUsername(localStorage.getItem('username') || '');
        };
        setKeys();
    }, []);

    useEffect(() => {
        const updateUser = () => {
            for (let i=0; i<users.length; i++) {
                if (username === users[i].username) {
                    setUser(users[i]);
                };
            };
        };
        updateUser();
    }, [username]);

    return (
        <div className={styles.page}>
            <header>
                <Topbar />
            </header>
            <div className={styles.content}>
                <div>
                    {users &&  
                        <FriendList friends={users} onItemClick={setCurrentFriend} />                    
                    }
                </div>
                <div>
                    <Chat user={user} friend={currentFriend} privKey={privKey} pubKey={pubKey} />
                </div>
            </div>
        </div>
    );
}   

export default HomePage;