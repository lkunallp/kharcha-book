import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { KharchaProvider } from './context/KharchaContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <KharchaProvider>
          <App />
        </KharchaProvider>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
);
