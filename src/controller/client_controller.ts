import {Context} from "hono";
import pool from "../config/db";
import {v4 as uuidv4} from "uuid";
import {toBiodataResponse} from "../model/biodata_model";
import {ToClientResponse} from "../model/client_model";

export async function ClientController(c:Context){
    try {
        const {nama_client,type_client} = await c.req.json();
        const [rows] = await pool.query(`SELECT * FROM t_client WHERE nama_client = ?`,[nama_client]);

        const result = rows as any[];
        if (result.length > 0){
            return c.json({status:false,message:'client exists'},400)
        }

        const query =`INSERT INTO t_client(kd_client,nama_client,type_client)VALUES(?,?,?)`;
        await pool.query(query,[
            uuidv4(),
            nama_client,
            type_client
        ]);

        return c.json({status:true,message:'client added successfully'},200);
    }catch (e) {
        return c.json({status:false,message:`Internal Server Error with ${e}`},500);
    }
}

export async function getClientController(c:Context){
    try {
        const params = c.req.query();
        if (params.kd_client == "0"){
            const [rows] = await pool.query(`SELECT * FROM t_client`);
            const  result = rows as any[];
            if (result.length > 0){
                return c.json({status:true,message:'data found',data:result.map(ToClientResponse)})
            }else{
                return c.json({status:false,message:'data not found'},404);
            }
        }else {
            const [rows] = await pool.query(`SELECT * FROM t_client WHERE kd_client = ?;`,[params.kd_client]);
            const  result = rows as any[];
            if (result.length > 0){
                return c.json({status:true,message:'data found',data:result.map(ToClientResponse)})
            }else{
                return c.json({status:false,message:'data not found'},404);
            }
        }
    }catch (e) {
        return c.json({status:false,message:'Internal Server Error'},500);
    }

}