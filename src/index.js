import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import GameDataProvider from "./context/GameDataContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <GameDataProvider>
          <App />
      </GameDataProvider>
  </React.StrictMode>
);