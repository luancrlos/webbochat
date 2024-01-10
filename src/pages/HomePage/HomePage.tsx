import { useState } from 'react';
import FriendList from '../../components/FriendList/FriendList';
import Topbar from '../../components/Topbar/Topbar';
import styles from './HomePage.module.css';
import { User } from '../../services/User.service';
import Chat from '../../components/Chat/Chat';

const HomePage = () => {
    const [currentFriend, setCurrentFriend] = useState<User>();

    const [friends, setFriends] = useState<User[]>([
        {
            name: 'Amanda Serique Pinheiro',
            status: false
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

    // const getFriendList = async() => {
    //     const list = await UserService.getList();
    //     setFriends(list);
    // };

    return (
        <div className={styles.page}>
            <header>
                <Topbar />
            </header>
            <div className={styles.content}>
                <div>
                    {friends &&  
                        <FriendList friends={friends} onItemClick={setCurrentFriend} />                    
                    }
                </div>
                <div>
                    <Chat currentFriend={currentFriend} />
                </div>
            </div>
        </div>
    );
}   

export default HomePage;