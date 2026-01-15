const express = require('express');
const router = express.Router();
const bugController = require('../controllers/bugController');

// Rute pentru operatii CRUD pe bug-uri
router.get('/', bugController.getAllBugs);
router.post('/', bugController.createBug);
router.get('/project/:projectId', bugController.getBugsByProject);
router.get('/:id', bugController.getBugById);
router.put('/:id', bugController.updateBug);
router.put('/:id/assign', bugController.assignBug);
router.put('/:id/resolve', bugController.resolveBug);
router.delete('/:id', bugController.deleteBug);

module.exports = router;
