import React, { useEffect } from 'react';
import { useState } from 'react';
import { KeyService } from './services/Key.service';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';

export default function App() {
  const [firstLogin, setFirstLogin] = useState<boolean>(true);

  return (
    <BrowserRouter>
      <div className='page'>
        <Routes>
          <Route path="/" element={<LoginPage firstLogin={firstLogin} setFirstLogin={setFirstLogin}/>} />
          <Route path="home" element={<HomePage firstLogin={firstLogin} setFirstLogin={setFirstLogin}/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);