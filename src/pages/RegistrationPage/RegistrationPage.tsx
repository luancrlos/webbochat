import React, {useState } from 'react';
import { UserService } from '../../services/User.service';
import styles from '../LoginPage/LoginPage.module.css';
import { users } from '../../services/User.service';

const RegistrationPage = () => {
  const [username, setUsername] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');

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
        await UserService.register(username, pwd);
        document.location.href = "/";
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
        <h1>Register!</h1>
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
          <input value={pwd} onChange={(onChangePassword)} type='password' name='password'/>
        </div>
      </>
    );
  };

  return (
    <form className={styles.page} onSubmit={(e) => handleSubmit(e)}>
      <div className={styles.header}>
        {renderHeader()}
      </div>
      <div className={styles.content}>
        {renderContent()}
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={returnLogin}>Return</button>
        <button className={styles.button} type='submit'>Register</button>
      </div>
    </form>
  );
}

export default RegistrationPage;
