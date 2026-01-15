const API_URL = 'http://13.60.183.146:8080/api/bugs';

// Preia toate bug-urile pentru un proiect dat
export const fetchBugsByProject = async (id) => {
  const r = await fetch(`${API_URL}/project/${id}`);
  const result = await r.json();
  return result.data || result || [];
};

// Adauga un bug nou in baza de date
export const addBug = async (data) => {
  const payload = {
    ...data,
    ProjectId: data.projectId 
  };
  
  const r = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await r.json();
  return result.data || result;
};

// Aloca un bug catre un utilizator
export const assignBug = async (id, userId) => {
  const r = await fetch(`${API_URL}/${id}/assign`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  const result = await r.json();
  return result.data || result;
};

// Marcheaza un bug ca rezolvat si trimite link-ul solutiei
export const updateBugStatus = async (id, solutionLink) => {
  const r = await fetch(`${API_URL}/${id}/resolve`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ solutionLink })
  });
  const result = await r.json();
  return result.data || result;
};

// Preia lista de utilizatori (folosita pentru alocari)
export const fetchTeamMembers = async () => {
  const r = await fetch('http://13.60.183.146:8080/api/auth/users');
  const result = await r.json();
  return result.data || result || [];
};