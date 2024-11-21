const nodemailer = require('nodemailer');

const setupTransporter = async () => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    return transporter;
};

module.exports = setupTransporter; 