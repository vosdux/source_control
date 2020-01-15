import * as types from './actionTypes';

const initialState = {
    isAuthinticated: true
};

const reducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.USER_LOGIN:
            console.log('user');
            return {
                isAuthinticated: action.isAuthinticated,
            };
        default:
            console.log('state');
            return state;
            break;
    }
};

export default reducer;