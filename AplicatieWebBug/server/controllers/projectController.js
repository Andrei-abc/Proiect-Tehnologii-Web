const { Project, Bug } = require('../models');

// Returneaza toate proiectele, cu numarul de bug-uri legate si echipa
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: Bug, attributes: ['id'], required: false },
        { association: 'teamMembers', attributes: ['id', 'email', 'role'], through: { attributes: [] } }
      ]
    });
    res.json({ count: projects.length, data: projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Creeaza un proiect nou (body: name, repository, ownerId, teamMembers)
exports.createProject = async (req, res) => {
  try {
    const { name, repository, ownerId, teamMembers } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Nume proiect obligatoriu" });
    }
    const project = await Project.create({ name, repository, ownerId });
    
    // Adauga membrii echipei daca sunt specificati
    if (teamMembers && teamMembers.length > 0) {
      await project.addTeamMembers(teamMembers);
    }
    
    // Reincarca proiectul cu membrii echipei
    const fullProject = await Project.findByPk(project.id, {
      include: [{ association: 'teamMembers', attributes: ['id', 'email', 'role'], through: { attributes: [] } }]
    });
    
    res.status(201).json({ message: 'Proiect creat cu succes', data: fullProject });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Returneaza detalii despre un proiect si bug-urile sale
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: Bug, required: false },
        { association: 'teamMembers', attributes: ['id', 'email', 'role'], through: { attributes: [] } }
      ]
    });
    if (!project) {
      return res.status(404).json({ error: "Proiect negasit" });
    }
    res.json({ data: project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizeaza un proiect existent cu campurile din body
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Proiect negasit" });
    }
    await project.update(req.body);
    res.json({ message: 'Proiect actualizat cu succes', data: project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Sterge un proiect dupa id
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Proiect negasit" });
    }
    await project.destroy();
    res.json({ message: 'Proiect sters cu succes' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
