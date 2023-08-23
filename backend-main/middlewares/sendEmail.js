import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '../config.env' });

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.text
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
            transporter.close();
        }
    });
}

export default sendEmail;