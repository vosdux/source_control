import * as types from './actionTypes';

const initialState = {
    role: null
};

const reducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.USER_LOGIN:
            return {
                role: action.payload.role
            };
        default:
            return state;
    }
};

export default reducer;