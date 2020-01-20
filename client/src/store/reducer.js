import * as types from './actionTypes';

const initialState = {
    isAuthinticated: false,
    role: null
};

const reducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.USER_LOGIN:
            console.log('user');
            return {
                isAuthinticated: action.payload.isAuthinticated,
                role: action.payload.role
            };
        default:
            console.log('state');
            return state;
            break;
    }
};

export default reducer;