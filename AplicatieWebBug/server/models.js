const { Sequelize, DataTypes } = require('sequelize');

// Cream o instanta Sequelize folosind fisier local SQLite
const sequelize = new Sequelize({ 
  dialect: 'sqlite', 
  storage: './database.sqlite', 
  logging: false 
});

// Definim modelul pentru utilizatori
const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('MP', 'TST'), allowNull: false }
});

// Definim modelul pentru proiecte
const Project = sequelize.define('Project', {
  name: { type: DataTypes.STRING, allowNull: false },
  repository: { type: DataTypes.STRING },
  ownerId: { type: DataTypes.INTEGER }
});

// Definim modelul pentru bug-uri
const Bug = sequelize.define('Bug', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  severity: { type: DataTypes.STRING },
  priority: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Open' },
  solutionLink: { type: DataTypes.STRING },
  commitLink: { type: DataTypes.STRING }
});

// Relatii intre modele: un proiect poate avea multe bug-uri
Project.hasMany(Bug, { foreignKey: 'ProjectId', onDelete: 'CASCADE' });
Bug.belongsTo(Project, { foreignKey: 'ProjectId' });

// Legam bug-ul de utilizator: reporter si persoana alocata
Bug.belongsTo(User, { as: 'reporter', foreignKey: 'reporterId' });
Bug.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });

// Relatie many-to-many intre Projects si Users pentru echipa
const ProjectTeam = sequelize.define('ProjectTeam', {});
Project.belongsToMany(User, { through: ProjectTeam, as: 'teamMembers' });
User.belongsToMany(Project, { through: ProjectTeam, as: 'projects' });

// Exportam modelele si conexiunea la DB
module.exports = { User, Project, Bug, ProjectTeam, sequelize };