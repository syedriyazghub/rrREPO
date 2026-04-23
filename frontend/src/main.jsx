import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import './index.css';

if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

// Keep Render backend alive by pinging every 14 minutes
const apiBase = import.meta.env.VITE_API_URL || '';
setInterval(() => fetch(`${apiBase}/api/config`).catch(() => {}), 14 * 60 * 1000);

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
