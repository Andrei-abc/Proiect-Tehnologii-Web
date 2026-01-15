// client/src/components/BugList.js - CORECTAT

import React from 'react';
import BugItem from './BugItem'; 

// Lista de bug-uri. Primeste onUpdate pentru a propaga modificarile din copii
const BugList = ({ bugs, projectId, userRole, onUpdate }) => { 

  if (bugs.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '30px', color: '#6c757d' }}>
        Nu exista bug-uri inregistrate pentru acest proiect.
    </p>;
  }

  return (
    <div className="bug-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {bugs.map((bug) => (
        <BugItem 
          key={bug.id} 
          bug={bug} 
          projectId={projectId} 
          userRole={userRole}
          onUpdate={onUpdate} // transmite schimbarea catre parinte
        />
      ))}
    </div>
  );
};

export default BugList;