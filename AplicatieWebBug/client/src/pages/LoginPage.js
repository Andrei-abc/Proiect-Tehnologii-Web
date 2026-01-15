import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import * as api from '../api/authApi';

// Pagina de login, valideaza formular si apeleaza API-ul
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Ambele câmpuri sunt obligatorii.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Adresa de email nu este validă.');
      return;
    }

    try {
      const userData = await api.login(email, password); 
      login(userData); 
      navigate('/');
    } catch (err) {
      setError('Login eșuat: Email sau parolă incorecte.');
    }
  };

  return (
    <div className="auth-card-container">
      <form onSubmit={handleSubmit} className="auth-card">
        {/* Titlul a fost scos pentru a evita dublarea cu Header-ul */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Parolă:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red', fontSize: '0.8em' }}>{error}</p>}
        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;