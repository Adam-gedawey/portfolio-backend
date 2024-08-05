const Project = require('../models/project');
const cloudinary = require('../config');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to upload image to Cloudinary
const uploadImageToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

const createProject = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const uploadResult = await uploadImageToCloudinary(file.buffer);

        const project = new Project({
            name: req.body.name,
            description: req.body.description,
            demoLink: req.body.demoLink,
            githubLink: req.body.githubLink,
            imageUrl: uploadResult.secure_url
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Extract public ID from the imageUrl
        const publicId = project.imageUrl.split('/').pop().split('.')[0];

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });

        // Delete the project from the database
        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Project and image deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProject,
    getProjects,
    deleteProject,
    upload
};
