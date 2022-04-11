import counterReducer from "./counter";
import authReducer from "./auth";
import userReducer from "./user";

import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    counter: counterReducer,
    auth: authReducer,
    user: userReducer
})

export default rootReducer;