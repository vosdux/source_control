import { useState, useCallback, useEffect } from "react";
import { getCookie, setCookie } from "../helpers/getCokie";

export const useAuth = () => {
    const [token, setToken] = useState<string|undefined>('');

    const login = useCallback(() => {
        setToken(getCookie('csrftoken'));
    }, []);

    const logout = useCallback(() => {
        setCookie('csrftoken', "", {
            'max-age': -1
          })
    }, []);

    useEffect(() => {
        if (getCookie('csrftoken')) {
            setToken(getCookie('csrftoken'));
        }
    }, [login])

    return { token, login, logout };
}