const Skill = require('../models/skill');
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

const createSkill = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const uploadResult = await uploadImageToCloudinary(file.buffer);

        const skill = new Skill({
            name: req.body.name,
            imageUrl: uploadResult.secure_url
        });

        await skill.save();
        res.status(201).json(skill);
    } catch (error) {
        console.error('Error creating skill:', error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
};

const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(200).json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Extract public ID from the imageUrl
        const publicId = skill.imageUrl.split('/').pop().split('.')[0];

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });

        // Delete the skill from the database
        await Skill.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Skill and image deleted successfully' });
    } catch (error) {
        console.error('Error deleting skill:', error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSkill,
    getSkills,
    deleteSkill,
    upload
};
