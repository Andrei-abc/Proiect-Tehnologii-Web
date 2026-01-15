const express = require('express');
const router = express.Router();
const bugController = require('../controllers/bugController');

// Rute pentru operatii CRUD pe bug-uri
// Rutele mai specifice trebuie sa vina inaintea celor generice
router.get('/project/:projectId', bugController.getBugsByProject);
router.put('/:id/assign', bugController.assignBug);
router.put('/:id/resolve', bugController.resolveBug);
router.get('/', bugController.getAllBugs);
router.post('/', bugController.createBug);
router.get('/:id', bugController.getBugById);
router.put('/:id', bugController.updateBug);
router.delete('/:id', bugController.deleteBug);

module.exports = router;
