import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { ApiModeProvider } from './shared/context/ApiModeContext';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiModeProvider>
      <App />
    </ApiModeProvider>
  </React.StrictMode>,
);
