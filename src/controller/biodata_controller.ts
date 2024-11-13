import {Context} from "hono";
import pool from "../config/db";
import {toBiodataResponse} from "../model/biodata_model";


export async function getBiodataController(c:Context) {
    const kd_biodata = c.req.query();
    const [rows] = await pool.query(`SELECT * FROM t_biodata WHERE kd_biodata = ?`,[kd_biodata.kd_biodata]);
    const  result = rows as any[];
    if (result.length >0){
        const data = result[0];
        return c.json({status:true,message:'data found',data:toBiodataResponse(data)})
    }else{
        return c.json({status:false,message:'data not found'},404);
    }
}

export async function addBiodataController(c:Context) {
    const {
        kd_biodata,
        nama_lengkap,
        email,
        nomor_ponsel,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        status_perkawinan,
        alamat_ktp,
        alamat_tinggal,
        foto_wajah
    } = await c.req.json();


    const [rows] = await pool.query(`SELECT * FROM t_biodata WHERE kd_biodata = ?`,[kd_biodata]);

    const result = rows as any[];
    if (result.length > 0){
        return c.json({status:false,message:'user sudah terdaftar'},400)
    }
    const query = `INSERT INTO t_biodata(
    kd_biodata,nama_lengkap,email,nomor_ponsel,tempat_lahir,tanggal_lahir,jenis_kelamin,status_perkawinan,alamat_ktp,alamat_tempat_tinggal,foto_wajah)
    VALUES(?,?,?,?,?,?,?,?,?,?,?)`;

    await pool.query(query, [
        kd_biodata,
        nama_lengkap,
        email,
        nomor_ponsel,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        status_perkawinan,
        alamat_ktp,
        alamat_tinggal,
        foto_wajah
    ]);
    return c.json({status:true,message:'user berhasil di daftarkan'},200)
}