import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; // Importăm pagina de Sign Up
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import './App.css';

// Context pentru autentificare si helper pentru componente
const AuthContext = React.createContext();
export const useAuth = () => React.useContext(AuthContext);

// Starea initiala a autentificarii
const initialAuthState = {
  isAuthenticated: false,
  user: null, 
};

function App() {
  const [authState, setAuthState] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? { isAuthenticated: true, user: JSON.parse(storedUser) } : initialAuthState;
  });

  const login = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({ isAuthenticated: true, user });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState(initialAuthState);
  };
  
  const ProtectedRoute = ({ children }) => {
    if (!authState.isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      <Router>
        <Header />
        <main className="container">
          <Routes>
            {/* Rute publice */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} /> {/* Noua rută publică */}

            {/* Rute protejate */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/project/:projectId" element={
              <ProtectedRoute>
                <ProjectPage />
              </ProtectedRoute>
            } />

            {/* Redirecționare pentru orice altceva */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;