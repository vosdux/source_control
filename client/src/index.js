import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import App from './App';
import reducer from './store/reducer';
import './index.css';
import 'antd/dist/antd.css'


const initialState = {
    isAuthinticated: false,
    role: null
}
const store = createStore(reducer, initialState);
const history = createBrowserHistory();

ReactDOM.render(
        <BrowserRouter history={history}>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>, document.getElementById('root'));
