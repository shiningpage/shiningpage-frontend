import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react'; 
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './dataStore/reducers';
import ReactDOM from 'react-dom/client'; // اصلاح مسیر برای React 18
import 'flag-icon-css/css/flag-icon.css';
import './assets/css/loader.scss';
import './assets/css/color.css';
import './assets/css/style.css';
import './assets/css/popup.css';
import './assets/css/animation.css';
import './assets/css/vazir.css';
// import 'animate.css/animate.min.css';
import { loadState, saveState } from './localStorage';
import App from './App';

// بارگذاری وضعیت ذخیره‌شده
const persistedState = loadState();
const store = createStore(reducers, persistedState);

// ذخیره وضعیت جدید در localStorage
store.subscribe(() => {
    saveState(store.getState());
});

// پیدا کردن ریشه DOM
const rootElement = document.getElementById('root');
if (rootElement) {
    // استفاده از createRoot
    const root = ReactDOM.createRoot(rootElement);

    root.render(
        <Provider store={store}>
            <App />
        </Provider>
    );
} else {
    console.error('Root element not found');
}

// استخراج وضعیت استور برای استفاده‌های دیگر
const storeX = store.getState();

export default storeX;
