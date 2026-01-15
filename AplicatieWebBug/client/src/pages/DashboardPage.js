import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

const DashboardPage = () => {
  const { authState } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', repository: '' });

  // Preia proiectele de pe server
  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/projects');
      if (!response.ok) throw new Error('Nu s-au putut încărca proiectele');
      const result = await response.json();
      setProjects(result.data || result || []);
    } catch (error) {
      console.error('Eroare:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      // Atenție la port: trimitem la 3001 (Backend) de pe 3002 (Frontend)
      const response = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newProject.name, 
          repository: newProject.repository,
          ownerId: authState.user ? authState.user.id : null 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setProjects([...projects, data]);
        setNewProject({ name: '', repository: '' });
        setShowAddForm(false);
        alert("✅ Proiect salvat în baza de date SQLite!");
      } else {
        alert("❌ Serverul a refuzat cererea: " + (data.error || "Eroare necunoscută"));
      }
    } catch (error) {
      alert("⚠️ Eroare de conexiune. Verifică dacă ai pornit terminalul cu serverul!");
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Se încarcă proiectele...</div>;

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;