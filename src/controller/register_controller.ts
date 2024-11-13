import type {Context} from "hono";
import {hashPassword} from "../helper/auth_helper.js";
import pool from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';

export async function registerController(c: Context) {
    const {username,password,role } = await c.req.json();
    const [rows] = await pool.query(
        `SELECT * FROM t_users WHERE username= ?`,
        [username]
    );
    const existingUser = rows as any[];
    if (existingUser.length > 0) {
        return c.json({status:false,message:'user already exist'},400)
    }
    // Hash password
    const hashedPassword = await hashPassword(password);
    const query = `INSERT INTO t_users(kd_user, username, password,role) VALUES (?, ?, ?, ?)`;
    await pool.query(query, [
        uuidv4(),
        username,
        hashedPassword,
        role
    ]);
    return c.json({ message: 'Registrasi berhasil' });

    // if (whatsapp != null){
    //     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    //     const expireDate = new Date(Date.now() + 5 * 60 *1000);
    //     await pool.query(insertToken,[
    //         uuidv4(),
    //         otpCode,
    //         expireDate
    //     ])
    //
    // }
    // const mailOptions = {
    //     from: process.env.EMAIL_USER, // Email pengirim
    //     to: registerReq.email, // Email user yang didaftarkan
    //     subject: 'User Activation', // Subjek email
    //     html: `
    //             <h1>Activate Your Account</h1>
    //             <p>Hello ${registerReq.name},</p>
    //             <p>Thank you for registering. Please,<a href="http://localhost:5353/activation?email=${registerReq.email}">Click Here</a> below to activate your account:</p>
    //         `
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (!error) {
    //         console.log(`Activation email sent: ${info.response}`);
    //     } else {
    //         console.error(`Error sending email: ${error}`);
    //         throw new ResponseError(500, "Failed to send activation email");
    //     }
    // });

}