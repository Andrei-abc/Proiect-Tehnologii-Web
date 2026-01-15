const { User } = require('../models');

// Creaza un utilizator nou in baza de date
exports.signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ id: user.id, email: user.email, role: user.role, message: 'Utilizator creat cu succes' });
  } catch (err) {
    res.status(400).json({ error: "Eroare la creare utilizator (posibil email duplicat)." });
  }
};

// Verifica email si parola si returneaza datele utilizatorului
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email si parola sunt obligatorii" });
    }
    const user = await User.findOne({ where: { email, password } });
    if (!user) {
      return res.status(401).json({ error: "Email sau parola incorecta" });
    }
    res.json({ id: user.id, email: user.email, role: user.role, message: 'Autentificare reusita' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Returneaza toti utilizatorii (id, email, role)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'email', 'role'] });
    res.json({ count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
