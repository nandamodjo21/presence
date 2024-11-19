import {Context} from "hono";
import pool from "../config/db";
import {v4 as uuidv4} from "uuid";

export async function LocationController(c:Context){
    try {
        const {latitude, longitude} = await c.req.json();

        const [rows] = await pool.query(`SELECT * FROM t_location WHERE latitude = ? AND longitude = ?`,[latitude,longitude]);

        const result = rows as any[];
        if (result.length > 0){
            return c.json({status:false,message:'location exists'},400)
        }

        const query = `INSERT INTO t_location(kd_location,latitude,longitude) VALUES(?,?,?)`;

        await pool.query(query,[
            uuidv4(),
            latitude,
            longitude
        ]);
        return c.json({status:true,message:'location added successfully'},200);
    }catch (e) {
        return c.json({status:false,message:`Internal Server Error with ${e}`},500);
    }

}