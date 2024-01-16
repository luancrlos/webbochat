import React, { useEffect, useState } from 'react';
import styles from './LoginPage.module.css';
import { MessageService } from '../../services/Message.service';
import { KeyService } from '../../services/Key.service';
import { users } from '../../services/User.service';

const LoginPage = () => {

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const renderHeader = () => {
    return (
      <>
        <h1>Welcome to Webbochat!</h1>
        <img className={styles.logo} src='logo.png' alt='logo' /> 
      </>
    );
  };

  const renderContent = () => {
    return (
      <>
        <div className={styles.inputContent}>
          <label>Username</label>
          <input value={username} onChange={(onChangeUsername)} />
        </div>
        <div className={styles.inputContent}>
          <label>Password</label>
          <input value={password} onChange={(onChangePassword)} type='password' name='password'/>
        </div>
      </>
    );
  };

  const signIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    for (let i=0; i<users.length; i++) {
      if (username === users[i].username && password === users[i].password) {
        localStorage.setItem('username', username);
        document.location.href = "/home";
      }
    }
  }

  return (
    <form className={styles.page} onSubmit={(e) => signIn(e)}>
      <div className={styles.header}>
        {renderHeader()}
      </div>
      <div className={styles.content}>
        {renderContent()}
      </div>
      <button className={styles.button} type='submit'>Sign-in</button>
    </form>
  );
}

export default LoginPage;
