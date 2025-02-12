import type {Context} from "hono";
import {toLoginResponse, toUserLogin} from "../model/login_model.js";
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
                const [rows] = await connection.query(`SELECT tp.id_karyawan,tp.kd_biodata,tp.kd_client,tb.nama_lengkap,tu.role,tu.status FROM t_pekerjaan tp JOIN t_biodata tb ON(tp.kd_biodata=tb.kd_biodata) JOIN t_users tu ON(tu.kd_user=tb.kd_biodata) WHERE tp.kd_biodata=?;`,[user.kd_user]);
                const  dataSessionLogin = rows as any[];
                if (dataSessionLogin.length >0){
                    return c.json({status:true,message:'data found',data:dataSessionLogin.map(toLoginResponse)})
                }else {
                    return c.json({status:true,message:'data found',data:result.map(toUserLogin)})
                    // return c.json({status:false,message:'Your account cannot be used yet '},400)

                }
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