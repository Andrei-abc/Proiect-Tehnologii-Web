import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import * as projectApi from '../api/projectApi';
import API_URL from '../config';

const DashboardPage = () => {
  const { authState } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', repository: '', teamMembers: [] });

  // Preia proiectele de pe server
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      if (!response.ok) throw new Error('Nu s-au putut incarca proiectele');
      const result = await response.json();
      setProjects(result.data || result || []);
    } catch (error) {
      console.error('Eroare:', error);
    } finally {
      setLoading(false);
    }
  };

  // Preia lista de utilizatori pentru a le selecta in echipa
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/users`);
      if (!response.ok) throw new Error('Nu s-au putut incarca utilizatorii');
      const result = await response.json();
      setUsers(result.data || result || []);
    } catch (error) {
      console.error('Eroare la incarcarea utilizatorilor:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      // Atentie la port: trimitem la API_URL (care se adapteaza la local sau AWS)
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newProject.name, 
          repository: newProject.repository,
          ownerId: authState.user ? authState.user.id : null,
          teamMembers: newProject.teamMembers
        })
      });

      const data = await response.json();

      if (response.ok) {
        const newProjectData = data.data || data;
        setProjects([...projects, newProjectData]);
        setNewProject({ name: '', repository: '', teamMembers: [] });
        setShowAddForm(false);
        alert("Proiect salvat in baza de date SQLite!");
      } else {
        alert("Serverul a refuzat cererea: " + (data.error || "Eroare necunoscuta"));
      }
    } catch (error) {
      alert("Eroare de conexiune. Verifica daca ai pornit terminalul cu serverul!");
    }
  };

  const handleDeleteProject = async (projectId, projectName) => {
    if (!window.confirm(`Ești sigur că vrei să ștergi proiectul "${projectName}"? Aceasta va șterge și toate bug-urile asociate!`)) {
      return;
    }

    try {
      await projectApi.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      alert("Proiect șters cu succes!");
    } catch (error) {
      alert(`Eroare la ștergerea proiectului: ${error.message}`);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Se incarca proiectele...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Dashboard Proiecte</h2>
        {authState.user && authState.user.role === 'MP' && (
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
            {showAddForm ? 'Anulează' : '+ Proiect Nou'}
          </button>
        )}
      </div>

      {showAddForm && (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '20px' }}>
          <form onSubmit={handleAddProject}>
            <div style={{ marginBottom: '10px' }}>
              <label>Nume Proiect:</label>
              <input 
                type="text" 
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                required 
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Link Repository:</label>
              <input 
                type="url" 
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                value={newProject.repository}
                onChange={(e) => setNewProject({...newProject, repository: e.target.value})}
                required 
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Echipa Proiect:</label>
              <div style={{ marginTop: '8px', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
                {users.map(user => (
                  <label key={user.id} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={newProject.teamMembers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewProject({...newProject, teamMembers: [...newProject.teamMembers, user.id]});
                        } else {
                          setNewProject({...newProject, teamMembers: newProject.teamMembers.filter(id => id !== user.id)});
                        }
                      }}
                    />
                    {' '} {user.email} ({user.role})
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px' }}>
              Salvează în Baza de Date
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {projects.map(p => (
          <div key={p.id} className="bug-item" style={{ borderLeft: '5px solid #007bff', padding: '15px', background: 'white' }}>
            <Link to={`/project/${p.id}`} style={{ textDecoration: 'none', color: '#333' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{p.name}</h3>
            </Link>
            <p style={{ fontSize: '0.85em', color: '#666' }}>ID Proiect: {p.id}</p>
            <p style={{ fontSize: '0.85em', color: '#666' }}>Repo: {p.repository}</p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <Link to={`/project/${p.id}`} style={{ flex: 1 }}>
                <button style={{ width: '100%', padding: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Deschide
                </button>
              </Link>
              {authState.user && authState.user.id === p.ownerId && (
                <button 
                  onClick={() => handleDeleteProject(p.id, p.name)}
                  style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Șterge
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;