import styles from './Topbar.module.css';

const Topbar = () => {

    const signOut = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        document.location.href = "/";
    }

    return (
        <div className={styles.topbar}>
            <div className={styles.logo}>
                <img src='logo.png' alt='logo' />
                <h3>Webbochat</h3>
            </div>
            <button onClick={signOut}>Sign out</button>
        </div>
    );
}

export default Topbar;