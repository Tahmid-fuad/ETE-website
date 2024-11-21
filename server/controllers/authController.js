const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const StudentModel = require('../models/student');
const setupTransporter = require('../utils/emailService');

const authController = {
    register: async (req, res) => {
        const { name, email, password, id, role, batch, desig } = req.body;
        const photo = req.file ? req.file.filename : null;

        try {
            const existingUser = await StudentModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already registered" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new StudentModel({
                name,
                email,
                password: hashedPassword,
                id,
                role,
                batch,
                desig,
                photo
            });
            const savedUser = await newUser.save();

            const token = jwt.sign({ email, role }, "fwaxcgqgsgf", { expiresIn: '1h' });

            res.status(201).json({ user: savedUser, token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await StudentModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "No record existed" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "The password is incorrect" });
            }

            const token = jwt.sign(
                { email, role: user.role, id: user.id },
                "tyftugihd7e",
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: "Success",
                role: user.role,
                id: user.id,
                email: user.email,
                token
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Add other controller methods...
};

module.exports = authController; 