import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

// Header cu linkuri si buton de logout; afiseaza info utilizator
const Header = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>Bug Tracker</Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {authState.isAuthenticated && authState.user ? (
            <>
              <span style={{ fontSize: '0.9em', color: '#6c757d' }}>
                Utilizator: <strong>{authState.user.email}</strong> ({authState.user.role})
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link" style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '5px 12px', 
                borderRadius: '4px', 
                textDecoration: 'none' 
              }}>Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;