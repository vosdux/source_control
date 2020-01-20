import * as types from './actionTypes';

export const userLoginAction = (bool, role) => {
    console.log('use')
    return {
        type: types.USER_LOGIN,
        payload: {
            isAuthinticated: bool,
            role
        }
    };
};