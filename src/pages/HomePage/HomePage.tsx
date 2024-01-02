import { useState } from 'react';
import FriendList from '../../components/FriendList/FriendList';
import Topbar from '../../components/Topbar/Topbar';
import styles from './HomePage.module.css';
import { User } from '../../services/User.service';
import Chat from '../../components/Chat/Chat';

const HomePage = () => {

    const [friends, setFriends] = useState<User[]>([
        {
            name: 'Amanda Serique Pinheiro',
            status: true
        },
        {
            name: 'Roberto Alves Neto',
            status: false
        },
        {
            name: 'Luan',
            status: false
        }
    ]);

    const [currentFriend, setCurrentFriend] = useState<User>();

    return (
        <div className={styles.page}>
            <header>
                <Topbar />
            </header>
            <div className={styles.content}>
                <div>
                    <FriendList friends={friends} onItemClick={setCurrentFriend} />
                </div>
                <div>
                    <Chat friend={currentFriend} />
                </div>
            </div>
        </div>
    );
}

export default HomePage;