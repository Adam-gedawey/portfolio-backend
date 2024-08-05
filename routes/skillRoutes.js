const express = require('express');
const router = express.Router();
const { createSkill, getSkills, deleteSkill, upload } = require('../controllers/skillController');

router.post('/skill', upload.single('image'), createSkill);
router.get('/skill', getSkills);
router.delete('/skill/:id', deleteSkill);

module.exports = router;
