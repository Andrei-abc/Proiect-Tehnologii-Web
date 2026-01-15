import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../App';
import * as bugApi from '../api/bugApi';
import BugForm from '../components/BugForm';
import BugList from '../components/BugList';

// Pagina proiect - incarca bug-urile si gestioneaza filtre si actiuni
const ProjectPage = () => {
  const { projectId } = useParams();
  const { authState } = useAuth();
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); 

  const userRole = authState.user ? authState.user.role : null;
  const currentUserId = authState.user ? authState.user.id : null;

  // 1. Incarcare date (Mutata in interiorul useEffect pentru a elimina warning-ul ESLint)
  useEffect(() => {
    const loadBugs = async () => {
      setLoading(true);
      try {
        console.log(`Caut bug-uri pentru proiectul ${projectId}`);
        const data = await bugApi.fetchBugsByProject(projectId);
        console.log(`Am primit ${data.length} bug-uri:`, data);
        setBugs(data);
      } catch (error) {
        console.error('Eroare la preluarea bug-urilor:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadBugs();
    }
  }, [projectId]);

  // 2. Handler pentru actualizarea unui bug in lista (folosit de BugItem)
  // Folosim useCallback pentru a preveni re-randari inutile ale componentelor copii
  const handleBugUpdate = useCallback((updatedBug) => {
    setBugs(prevBugs => 
      prevBugs.map(bug => bug.id === updatedBug.id ? updatedBug : bug)
    );
  }, []);

  // 3. Handler pentru adaugarea unui bug nou (folosit de BugForm)
  const handleBugAdded = (newBug) => {
    setBugs(prevBugs => [newBug, ...prevBugs]);
  };

  // 4. Logica de filtrare optimizata cu useMemo
  const filteredBugs = useMemo(() => {
    if (!bugs) return [];

    switch (filter) {
      case 'MY_BUGS':
        return bugs.filter(bug => bug.assignedToId === currentUserId);
      case 'OPEN':
        return bugs.filter(bug => bug.status === 'Open');
      case 'IN_PROGRESS':
        return bugs.filter(bug => bug.status === 'In Progress');
      case 'RESOLVED':
        return bugs.filter(bug => bug.status === 'Resolved');
      default:
        return bugs;
    }
  }, [bugs, filter, currentUserId]);

  if (loading) return <div className="loading">Se incarca detaliile proiectului...</div>;

  return (
    <div className="project-page">
      <div className="page-header">
        <h2>Gestionare Proiect #{projectId}</h2>
      </div>

      {/* Sectiune Raportare (doar pentru Testeri) */}
      {userRole === 'TST' && (
        <section className="report-section" style={{ marginBottom: '40px' }}>
          <h3>Raportează un Bug Nou</h3>
          <BugForm 
            projectId={projectId} 
            reporterId={currentUserId} 
            onBugAdded={handleBugAdded} 
          />
        </section>
      )}

      {/* Sectiune Lista si Filtre */}
      <section className="bugs-section">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Bug-uri înregistrate ({filteredBugs.length})</h3>
          
          <div className="bug-filter-controls">
            <span style={{ marginRight: '10px', fontWeight: '600' }}>Filtrează:</span>
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(f => (
              <button 
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                style={{
                  padding: '5px 12px',
                  margin: '0 4px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: filter === f ? '#007bff' : '#fff',
                  color: filter === f ? '#fff' : '#333',
                  cursor: 'pointer'
                }}
              >
                {f === 'ALL' ? 'Toate' : f.replace('_', ' ')}
              </button>
            ))}

            {userRole === 'MP' && (
              <button 
                className={`filter-btn ${filter === 'MY_BUGS' ? 'active' : ''}`}
                onClick={() => setFilter('MY_BUGS')}
                style={{
                  padding: '5px 12px',
                  marginLeft: '15px',
                  borderRadius: '4px',
                  border: '1px solid #17a2b8',
                  backgroundColor: filter === 'MY_BUGS' ? '#17a2b8' : '#fff',
                  color: filter === 'MY_BUGS' ? '#fff' : '#17a2b8',
                  cursor: 'pointer'
                }}
              >
                Alocate mie
              </button>
            )}
          </div>
        </div>

        <BugList 
          bugs={filteredBugs} 
          projectId={projectId} 
          userRole={userRole} 
          onUpdate={handleBugUpdate} 
        />
      </section>
    </div>
  );
};

export default ProjectPage;