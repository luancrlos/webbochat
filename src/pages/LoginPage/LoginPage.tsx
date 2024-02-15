import React, { useEffect, useState } from 'react';
import { UserService } from '../../services/User.service';
import styles from './LoginPage.module.css';
import { users } from '../../services/User.service';
import RegistrationPage from '../RegistrationPage/RegistrationPage';

export interface LoginProps {
  firstLogin: boolean;
  setFirstLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage = ({firstLogin, setFirstLogin}: LoginProps) => {

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    localStorage.clear()
  }, []);

  const getId = () => {
    for (let i = 0; i < users.length; i++) {
      if (username === users[i].username) {
        return users[i].id;  
      }
    }
    return '';
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
    const id = getId();
		try {
      await UserService.login(id, password);
      localStorage.setItem('username', username);
      document.location.href = "/home";
		} catch (error) {
        console.log(error);
		}
	};

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const createAccount = () => {
		document.location.href = "/registration";
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

  const renderFooter = () => {
    return (
      <div className={styles.content}>
        <h3>New to Webbochat? Create an account!</h3>
        <button className={styles.button} onClick={createAccount}>Register</button>
      </div>
    );
  }

  return (
    <form className={styles.page} onSubmit={(e) => handleSubmit(e)}>
      <div className={styles.header}>
        {renderHeader()}
      </div>
      <div className={styles.content}>
        {renderContent()}
      </div>
      <button className={styles.button} type='submit'>Sign-in</button>
      <div>
        {renderFooter()}
      </div>
    </form>
  );
}

export default LoginPage;
