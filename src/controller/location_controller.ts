import {Context} from "hono";
import pool from "../config/db";
import {v4 as uuidv4} from "uuid";
import exp from "node:constants";
import {toUserLogin} from "../model/login_model";
import {toLocationResponse} from "../model/location_model";

export async function LocationController(c:Context){
    try {
        const {client,latitude, longitude} = await c.req.json();

        const [rows] = await pool.query(`SELECT * FROM t_location WHERE latitude = ? AND longitude = ?`,[latitude,longitude]);

        const result = rows as any[];
        if (result.length > 0){
            return c.json({status:false,message:'location exists'},400)
        }

        const query = `INSERT INTO t_location(kd_location,kd_client,latitude,longitude) VALUES(?,?,?,?)`;

        await pool.query(query,[
            uuidv4(),
            client,
            latitude,
            longitude
        ]);
        return c.json({status:true,message:'location added successfully'},200);
    }catch (e) {
        return c.json({status:false,message:`Internal Server Error with ${e}`},500);
    }
}

export async function getLocationClient(c:Context){
    try {
        const params = c.req.query();
        console.log(params.kd_client);
        if (params.kd_client === "0"){
            const [rows] = await pool.query(`SELECT * FROM t_location;`);
            const result = rows as any[];
            console.log(result);

            if (result.length > 0){
                return c.json({status:true,message:'data found',data:result.map(toLocationResponse)})
            }else {
                return c.json({status:false,message:`Data not found`},404);
            }
        }
        const [rows] = await pool.query(`SELECT * FROM t_location WHERE kd_client = ?;`,[params.kd_client]);
        const result = rows as any[];
        if (result.length > 0){
            return c.json({status:true,message:'data found',data:result.map(toLocationResponse)})
        }else {
            return c.json({status:false,message:`Data not found`},404);
        }
    }catch (e) {
        return c.json({status:false,message:`Internal Server Error with ${e}`},500);
    }
}