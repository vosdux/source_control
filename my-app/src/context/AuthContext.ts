import { createContext } from 'react';

const noop = () => {

}

interface IAuth {
    token: string|undefined,
    login: any,
    logout: any,
    isAuthenticated?: boolean
}

export const AuthContext = createContext<IAuth>({
    token: undefined,
    login: noop,
    logout: noop,
    isAuthenticated: false
});