import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Punctul de intrare React
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Masuratori performanta (optional)
reportWebVitals();
