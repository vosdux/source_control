import * as types from './actionTypes';

const initialState = {
    isAuthinticated: false,
    role: null
};

const reducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.USER_LOGIN:
            return {
                isAuthinticated: action.payload.isAuthinticated,
                role: action.payload.role
            };
        default:
            return state;
    }
};

export default reducer;