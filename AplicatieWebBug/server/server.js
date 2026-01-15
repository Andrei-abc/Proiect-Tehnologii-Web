const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const bugRoutes = require('./routes/bugRoutes');

const app = express();
const PORT = 3001;

// Middleware de baza
app.use(cors({
  origin: 'http://13.60.183.146:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log simplu pentru fiecare cerere primita
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Rutele API
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bugs', bugRoutes);

// Endpoint healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Handler 404 pentru rute necunoscute
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta negasita' });
});



// Sincronizam modelele cu baza de date si pornim serverul
sequelize.sync({ force: false, alter: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 SERVER ONLINE: http://localhost:${PORT}`);
      console.log(`📁 API Endpoints:`);
      console.log(`   - POST   /api/auth/signup`);
      console.log(`   - POST   /api/auth/login`);
      console.log(`   - GET    /api/auth/users`);
      console.log(`   - GET    /api/projects`);
      console.log(`   - POST   /api/projects`);
      console.log(`   - GET    /api/bugs`);
      console.log(`   - POST   /api/bugs`);
      console.log(`   - GET    /api/bugs/project/:id`);
      console.log(`   - PUT    /api/bugs/:id/assign`);
      console.log(`   - PUT    /api/bugs/:id/resolve\n`);
    });
  })
  .catch(err => {
    console.error("Eroare la sincronizare baza de date:", err);
    process.exit(1);
  });
