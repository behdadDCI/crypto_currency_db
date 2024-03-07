import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'adelnamazi61@gmail.com',
    pass: process.env.PASSMAIL
  },
});

export const sendVerificationLinkToEmail = async (
  email: string,
  firstName: string,
  verifyToken: string
) => {
  let details = {
    from: "adelnamazi61@gmail.com",
    to: email,
    subject: "verify Account",
    html: `
    <img src="https://cdn-icons-png.flaticon.com/512/5309/5309779.png" alt="brand" width="30" height="30"/>
      <p>Dear ${firstName}</p>
      <p>Thank you for signing up. Please click the following link to verify your account:</p>
      <a href="https://orosia.online/verify_account/${verifyToken}">Verify Account</a>
      <p>If you did not sign up, please ignore this email.</p>
      <p>Best Regards,<br/>Your Website Team</p>
    `,
  };
  await transporter.sendMail(details);
};
