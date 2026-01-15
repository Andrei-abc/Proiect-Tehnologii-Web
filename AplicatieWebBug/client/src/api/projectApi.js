import API_URL from '../config';

const PROJECTS_API_URL = `${API_URL}/api/projects`;

// Preia lista de proiecte de la server
export const fetchProjects = async () => {
    const response = await fetch(PROJECTS_API_URL);
    if (!response.ok) throw new Error('Eroare la incarcarea proiectelor');
    return response.json();
};

// Creeaza un proiect nou prin API
export const addProject = async (projectData) => {
    const response = await fetch(PROJECTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData) 
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Eroare la salvarea proiectului');
    }
    return response.json();
};

// Sterge un proiect dupa ID
export const deleteProject = async (projectId) => {
    const response = await fetch(`${PROJECTS_API_URL}/${projectId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Eroare la ștergerea proiectului');
    }
    return response.json();
};