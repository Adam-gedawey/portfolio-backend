const express = require('express');
const router = express.Router();
const { createProject, getProjects, deleteProject, upload } = require('../controllers/projectController');

router.post('/projects/add', upload.single('image'), createProject);
router.get('/projects', getProjects);
router.delete('/projects/:id', deleteProject);

module.exports = router;
