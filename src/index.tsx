import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/css/tailwind.css';

import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';

import 'flag-icon-css/css/flag-icon.css';
import './assets/css/loader.scss';
import './assets/css/color.css';
import './assets/css/style.css';
import './assets/css/popup.css';
import './assets/css/animation.css';
import './assets/css/vazir.css';

import App from './App';
import { store } from './store/store';

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
        <Provider store={store}>
            <App />
        </Provider>
    );


} else {
    console.error('Root element not found');
}

export default store;
