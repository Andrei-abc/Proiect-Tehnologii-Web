import API_URL from '../config';

const AUTH_API_URL = `${API_URL}/api/auth`;

// Trimite credentiale la server, returneaza datele utilizatorului la succes
export const login = async (email, password) => {
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login esuat');
  }
  return response.json();
};

// Creeaza cont nou pe server
export const signup = async (email, password, role) => {
  const response = await fetch(`${AUTH_API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Inregistrare esuata');
  }
  return response.json();
};
