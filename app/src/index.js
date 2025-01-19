import React from 'react';
import ReactDOM from 'react-dom/client';

import { ToastContainer } from 'react-toastify';

import App from './app';

import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <App />

    <ToastContainer />
  </>
);