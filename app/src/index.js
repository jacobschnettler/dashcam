import React from 'react';
import ReactDOM from 'react-dom/client';

import { Footer } from './components';

import { AlertsManager } from './alerts';

import { ToastContainer } from 'react-toastify';

import App from './app';

import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <App />

    {/* <Footer /> */}

    <ToastContainer />
  </>
);