import React, {useState } from 'react';
import { UserService } from '../../services/User.service';
import styles from '../LoginPage/LoginPage.module.css';

const RegistrationPage = () => {
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const [registered, setRegistered] = useState<boolean>(false);

  const passwordValidation = (password: string) => {
    const checkNumber = /.*\d.*/;
    const checkUpperCase =  /([A-Z])/;

    if(password.length < 8){
      return false;
    };

    if(!password.match(checkNumber)) {
      return false;      
    };

    if(!password.match(checkUpperCase)) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if(passwordValidation(pwd)){
        const response = await UserService.register(username, pwd);
        setRegistered(true);
        setUserId(response);
      }
    } catch (error) {
        console.log(error);
    }
  };

  const returnLogin = () => {
    document.location.href = "/";

  }

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwd(e.target.value);
  }

  const renderHeader = () => {
    return (
      <>
      {registered ?
        <h1>Account successfully created! </h1>
        :
        <h1>Register!</h1> 
      }

        <img className={styles.logo} src='logo.png' alt='logo' /> 
      </>
    );
  };

  const renderContent = () => {
    return (
      <>
      {registered ?
        <div className={styles.messageContainer}>
          <p className={styles.messageContent}>
            We genereted a unique username for you.
          </p>
          <p className={styles.messageContent}>From now on, you should use <b>{userId}</b> to enter Webbochat.</p>
        </div>
        :
        <>
        <div className={styles.inputContent}>
          <label>Username</label>
          <input value={username} onChange={(onChangeUsername)} />
        </div>
        <div className={styles.inputContent}>
          <label>Password</label>
          <input value={pwd} onChange={(onChangePassword)} type='password' name='password'/>
        </div>
      </>
      }
      </>
    );
  };

  const registerLogin = async() => {
    setRegistered(false);
    try {
      await UserService.login(userId, pwd);
      document.location.href = "/home";
		} catch (error) {
        console.log(error);
		}
  }

  const renderFooter = () => {
    return (
      <>
      {registered ? 
        <button className={styles.button} onClick={registerLogin}>Continue</button> 
        :
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={returnLogin}>Return</button>
          <button className={styles.button} type='submit'>Register</button>
        </div> 
      }
      </> 
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
      {renderFooter()}
    </form>
  );
}

export default RegistrationPage;
