import { useEffect, useState } from 'react';
import FriendList from '../../components/FriendList/FriendList';
import Topbar from '../../components/Topbar/Topbar';
import styles from './HomePage.module.css';
import { User, users } from '../../services/User.service';
import Chat from '../../components/Chat/Chat';
import { KeyService } from '../../services/Key.service';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

//PK = abreviação para public key
//Modificação dos nomes das constantes para diferenciar a chave pública enviada da chave pública recebida

interface HomePageProps {
    user?: User;
    setFirstLogin: React.Dispatch<React.SetStateAction<boolean>>;
    firstLogin: boolean;
};

const HomePage = ({firstLogin, setFirstLogin}: HomePageProps) => {
    const [currentFriend, setCurrentFriend] = useState<User>();
    const [privKey, setPrivKey] = useState<Uint8Array>(new Uint8Array());
    const [receivedPK, setReceivedPK] = useState<Uint8Array>(new Uint8Array());
    const [sentPK, setSentPK] = useState<string>();
    const [user, setUser] = useState<User>();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const setKeys = () => {
            const privateKey = KeyService.genPrivateKey();
            setPrivKey(privateKey);

            //Esse trecho será modificado para criptografar as mensagens enviadas com a chave pública recebida do amigo
            setReceivedPK(KeyService.genPublicKey(privateKey));
            if(firstLogin) { 
                setSentPK(KeyService.getPubKey());
                setFirstLogin(false);
            };
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
                        <FriendList friends={users} onItemClick={setCurrentFriend} username={username}/>                    
                    }
                </div>
                <div>
                    <Chat user={user} friend={currentFriend} privKey={privKey} receivedPK={receivedPK} sentPK={sentPK} />
                </div>
            </div>
        </div>
    );
}   

export default HomePage;