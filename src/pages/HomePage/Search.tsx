import React from "react";
import { useState } from "react";
import { User } from "../../services/User.service";
import styles from './HomePage.module.css'

export const Search = () => {
    const [searchFriend, setSearchFriend] = useState<string>('');
    
    const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFriend(e.target.value);
    }

    return (
        <div className={styles.search}>
            <div className={styles.inputSearch}>
                <input value={searchFriend} onChange={(onChangeSearch)} />
                <button className={styles.button} type='submit'>Search</button>
            </div>
        </div>
    )
}