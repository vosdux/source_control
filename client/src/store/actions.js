import * as types from './actionTypes';

export const userLoginAction = (role) => {
    return {
        type: types.USER_LOGIN,
        payload: {
            role
        }
    };
};