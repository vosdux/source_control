import React, { FC, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const Page: FC = () => {
    const { logout } = useContext(AuthContext);
    return(
        <>
            <h1>Вы авторизированы</h1>
            <button onClick={logout}>Выйти</button>
        </>
    );
}