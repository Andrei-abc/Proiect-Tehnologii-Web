import React, { useState } from 'react';
import * as bugApi from '../api/bugApi';

// Formular pentru adaugare bug (folosit de pagina proiect)
const BugForm = ({ projectId, reporterId, onBugAdded }) => {
  const [bug, setBug] = useState({
    title: '',
    description: '',
    severity: 'Medium',
    priority: 'Medium',
    commitLink: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBug({ ...bug, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!bug.title || !bug.description || !bug.commitLink) {
      setError('Toate câmpurile principale sunt obligatorii.');
      return;
    }

    // Trimitem datele catre API
    setIsSubmitting(true);
    try {
      const newBug = await bugApi.addBug({ ...bug, projectId: parseInt(projectId), reporterId });
      onBugAdded(newBug);
      
      setBug({ title: '', description: '', severity: 'Medium', priority: 'Medium', commitLink: '' });
      alert('Bug-ul a fost înregistrat cu succes!');
    } catch (err) {
      setError('Eroare la adăugarea bug-ului.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: 0, padding: '20px', boxShadow: 'none', border: '1px solid #e9ecef' }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#007bff' }}>Formular de Raportare Bug</h4>
      {error && <p style={{ color: '#dc3545', margin: '0 0 10px 0' }}>{error}</p>}
      
      <input type="text" name="title" placeholder="Titlu (obligatoriu)" value={bug.title} onChange={handleChange} required />
      
      <textarea name="description" placeholder="Descriere detaliată (obligatoriu)" value={bug.description} onChange={handleChange} required />
      
      <div style={{ display: 'flex', gap: '15px' }}>
        <label style={{ flex: 1 }}>Severitate:
          <select name="severity" value={bug.severity} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Mediu</option>
            <option value="High">Ridicat</option>
            <option value="Critical">Critică</option>
          </select>
        </label>

        <label style={{ flex: 1 }}>Prioritate:
          <select name="priority" value={bug.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Mediu</option>
            <option value="High">Ridicat</option>
          </select>
        </label>
      </div>
      
      <input type="url" name="commitLink" placeholder="Link către commit-ul care cauzează bug-ul (obligatoriu)" value={bug.commitLink} onChange={handleChange} required />
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Se trimite...' : 'Înregistrează Bug'}
      </button>
    </form>
  );
};

export default BugForm;