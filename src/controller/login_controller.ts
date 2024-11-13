import type {Context} from "hono";
import pool from "../config/db.js";
import {toLoginResponse} from "../model/login_model.js";
import {verifyPassword} from "../helper/auth_helper.js";

async function LoginController(c:Context) {
    const { username, password } = await c.req.json();
    const [rows] = await pool.query(`SELECT * FROM t_users WHERE username = "${username}"`);
    const  result = rows as any[];
    if (result.length >0){
        const user = result[0];
        const isPasswordValid = await verifyPassword(password, user.password);
        const isActive = user.status;
        if (isPasswordValid){
            if (isActive === 'on'){
                return c.json({status:true,message:'data found',data:toLoginResponse(user)})
            }else{
                return c.json({status:false,message:'Please contact customer service to Activate your account'},401)
            }
        }else{
            return c.json({status:false,message:'Password salah'},401)
        }
    }else{
       return c.json({status:false,message:'user not found'},404)
    }

}

export default LoginController;