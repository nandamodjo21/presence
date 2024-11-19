import {Context} from "hono";
import pool from "../config/db";
import {toBiodataResponse} from "../model/biodata_model";
import fs from "fs";
import {v4 as uuidv4} from "uuid";
import path from "path";


export async function getBiodataController(c:Context) {
    const params = c.req.query();
    const [rows] = await pool.query(`SELECT * FROM t_biodata WHERE kd_biodata = ?`,[params.kd_biodata]);
    const  result = rows as any[];
    if (result.length >0){
        return c.json({status:true,message:'data found',data:result.map(toBiodataResponse)})
    }else{
        return c.json({status:false,message:'data not found'},404);
    }
}

export async function addBiodataController(c:Context) {

    const body = await c.req.parseBody();
    const kd_biodata = body['kd_biodata'];
    const nama_lengkap = body['nama_lengkap'];
    const email = body['email'];
    const nomor_ponsel = body['nomor_ponsel'];
    const tempat_lahir = body['tempat_lahir'];
    const tanggal_lahir = body['tanggal_lahir'];
    const jenis_kelamin = body['jenis_kelamin'];
    const status_perkawinan = body['status_perkawinan'];
    const alamat_ktp = body['alamat_ktp'];
    const alamat_tinggal = body['alamat_tinggal'];
    const foto_wajah = body['foto_wajah'];
    if (
        !foto_wajah ||
        !(foto_wajah instanceof File)
    ) {
        return c.json({ status: false, message: 'File foto_wajah tidak valid atau tidak ada' }, 400);
    }



    const [rows] = await pool.query(`SELECT * FROM t_biodata WHERE kd_biodata = ?`,[kd_biodata]);

    const result = rows as any[];
    if (result.length > 0){
        return c.json({status:false,message:'user sudah terdaftar'},400)
    }

    const uploadsDir = "./uploads";
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }

    const photoFileName = `${uuidv4()}_${foto_wajah.name}`;
    const photoFilePath = path.join(uploadsDir, photoFileName);
    const photoData = Buffer.from(await foto_wajah.arrayBuffer());

    fs.writeFileSync(photoFilePath, photoData);

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
        photoFileName
    ]);
    return c.json({status:true,message:'user berhasil di daftarkan'},200)
}


