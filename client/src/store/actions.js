import * as types from './actionTypes';

export const userLoginAction = (bool) => {
    console.log('use')
    return {
        type: types.USER_LOGIN,
        isAuthinticated: bool
    };
};