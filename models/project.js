const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    demoLink: { type: String },
    githubLink: { type: String, required: true },
    imageUrl: { type: String, required: true }
});

module.exports = mongoose.model('Project', projectSchema);
