import React, { useState, useEffect } from 'react';
import * as bugApi from '../api/bugApi';
import { useAuth } from '../App'; 

// Componenta pentru afisarea unui bug si actiuni posibile
const BugItem = ({ bug: initialBug, userRole, onUpdate, teamMembers = [] }) => { 
  const { authState } = useAuth(); 
  const currentUserId = authState.user ? authState.user.id : null;

  // State local pentru bug, membri echipa si campuri de formular
  const [bug, setBug] = useState(initialBug);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [resolutionCommit, setResolutionCommit] = useState('');

  // Filtram doar membrii MP din echipa proiectului
  const mpMembers = teamMembers.filter(m => m.role === 'MP');
  
  // Debug: log echipa incarcata
  useEffect(() => {
    console.log('BugItem - teamMembers incarcate:', teamMembers);
    console.log('BugItem - mpMembers filtrate:', mpMembers);
  }, [teamMembers, mpMembers]);

  // Afiseaza email-ul persoanei alocate sau mesaj default
  const getAssigneeDisplay = () => {
    if (bug.assignedTo && bug.assignedTo.email) return bug.assignedTo.email;
    return "Neatribuit";
  };

  // Aloca bug-ul catre un utilizator (sau catre sine)
  const handleAssign = async (selfAssignId = null) => {
    const assigneeId = selfAssignId || selectedAssignee;
    if (!assigneeId) return alert("Selecteaza un membru al echipei.");

    try {
      const updatedBug = await bugApi.assignBug(bug.id, assigneeId);
      setBug(updatedBug);
      onUpdate(updatedBug); // Notificam parintele pentru actualizare lista
      alert(`Bug-ul a fost alocat cu succes.`);
      setSelectedAssignee('');
    } catch (error) {
      alert(`Eroare la alocare: ${error.message}`);
    }
  };
  
  // Marcheaza bug-ul ca rezolvat trimitand link-ul commit-ului
  const handleResolve = async () => {
    if (!resolutionCommit || resolutionCommit.length < 5) {
      return alert("Introdu un link valid de commit pentru rezolvare.");
    }

    try {
      const updatedBug = await bugApi.updateBugStatus(bug.id, resolutionCommit);
      setBug(updatedBug);
      onUpdate(updatedBug);
      alert('Bug-ul a fost marcat ca Rezolvat!');
    } catch (error) {
       alert(`Eroare la rezolvare: ${error.message}`);
    }
  };
  
  // Stiluri simple pentru statusuri
  const statusColors = { 
    'Open': '#dc3545', 
    'In Progress': '#ffc107', 
    'Resolved': '#28a745' 
  };

  const isAssignedToMe = bug.assignedToId === currentUserId;

  return (
    <div className="bug-item" style={{ 
      borderLeft: `6px solid ${statusColors[bug.status] || '#ccc'}`,
      padding: '15px',
      marginBottom: '15px',
      backgroundColor: '#fff',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
        <h4 style={{ margin: '0 0 10px 0', color: statusColors[bug.status] }}>
            BUG #{bug.id}: {bug.title}
        </h4>
        
        <div className="bug-metadata" style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '20px', 
          fontSize: '0.9em',
          padding: '10px 0', 
          borderTop: '1px solid #eee', 
          borderBottom: '1px solid #eee', 
          marginBottom: '15px' 
        }}>
            <span><strong>Status:</strong> {bug.status}</span>
            <span><strong>Severitate:</strong> {bug.severity}</span>
            <span><strong>Prioritate:</strong> {bug.priority}</span>
            <span><strong>Alocat:</strong> {getAssigneeDisplay()}</span>
        </div>
        
        <p style={{ color: '#444', lineHeight: '1.4' }}>{bug.description}</p>

        {/* Acțiuni permise doar pentru Membrii Proiect (MP) */}
        {userRole === 'MP' && bug.status !== 'Resolved' && (
            <div className="bug-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                
                {/* 1. Opțiuni de Alocare (doar pentru bug-uri Open) */}
                {bug.status === 'Open' && (
                    <>
                        {mpMembers.length === 0 ? (
                          <p style={{ color: '#dc3545', marginTop: '5px' }}>Nu sunt membri disponibili în echipa acestui proiect</p>
                        ) : (
                          <>
                            <select 
                              value={selectedAssignee} 
                              onChange={(e) => setSelectedAssignee(e.target.value)}
                              style={{ padding: '5px' }}
                            >
                                <option value="">Delegă coleg...</option>
                                {mpMembers.map(m => <option key={m.id} value={m.id}>{m.email}</option>)}
                            </select>
                            <button onClick={() => handleAssign()} className="btn-primary" style={{ padding: '5px 10px' }}>Alocă</button>
                            <button onClick={() => handleAssign(currentUserId)} style={{ background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>Alocă-mă pe mine</button>
                          </>
                        )}
                    </>
                )}
                
                {/* 2. Opțiune de Rezolvare (doar dacă e alocat mie) */}
                {isAssignedToMe && bug.status === 'In Progress' && (
                    <div style={{ flex: 1, display: 'flex', gap: '10px' }}>
                        <input 
                          type="url" 
                          placeholder="Link Commit Rezolvare" 
                          value={resolutionCommit} 
                          onChange={(e) => setResolutionCommit(e.target.value)} 
                          style={{ flex: 1, padding: '5px' }}
                        />
                        <button onClick={handleResolve} style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 15px', cursor: 'pointer' }}>Rezolvă</button>
                    </div>
                )}
            </div>
        )}
        
        {/* Afișare link soluție pentru bug-urile finalizate */}
        {bug.status === 'Resolved' && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e9f7ef', borderRadius: '4px' }}>
                <p style={{ color: '#28a745', margin: 0 }}>
                    <strong>Rezolvat!</strong> Commit solutie: 
                    <a href={bug.solutionLink} target="_blank" rel="noreferrer" style={{ marginLeft: '5px', wordBreak: 'break-all' }}>
                      {bug.solutionLink}
                    </a>
                </p>
            </div>
        )}
    </div>
  );
};

export default BugItem;