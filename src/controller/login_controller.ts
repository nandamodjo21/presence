import type {Context} from "hono";
import {toLoginResponse} from "../model/login_model.js";
import {verifyPassword} from "../helper/auth_helper.js";
import {connection} from "../utils/use-variable";

async function LoginController(c:Context) {
    const { username, password } = await c.req.json();
    const [rows] = await connection.query("SELECT * FROM t_users WHERE username = ?",[username]);
    const  result = rows as any[];
    if (result.length >0){
        const user = result[0];
        const isPasswordValid = await verifyPassword(password, user.password);
        const isActive = user.status;
        if (isPasswordValid){
            if (isActive === 'on'){
                return c.json({status:true,message:'data found',data:result.map(toLoginResponse)})
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