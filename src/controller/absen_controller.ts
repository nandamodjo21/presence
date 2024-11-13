import {Context} from "hono";
import pool from "../config/db";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import path from "path";
export async function absenMasukController(c:Context){
    // const {kd_user,jenis_absen,lokasi,foto} = await c.req.json();
    const body = await c.req.parseBody({all:true});
    const kd_user = body['kd_user'];
    const jenis_absen = body['jenis_absen'];
    const lokasi = body['lokasi'];
    const foto = body['foto'] as File;

    console.log(body)
    const [rows] = await pool.query("SELECT * FROM `t_absensi` WHERE kd_user=? AND date(waktu) = date(now()) AND jenis_absen ='masuk' ORDER BY waktu DESC",[kd_user]);

    const result = rows as any[];
    if (result.length>0){
       return c.json({status:false,message:'anda sudah absen masuk'},400)
    }
    // Simpan file foto ke folder "uploads"
    const uploadsDir = "./uploads";
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }

    const photoFileName = `${uuidv4()}_${foto.name}`;
    const photoFilePath = path.join(uploadsDir, photoFileName);
    const photoData = Buffer.from(await foto.arrayBuffer());

    // Simpan file foto ke sistem file
    fs.writeFileSync(photoFilePath, photoData);

    // Simpan informasi absen dan path foto ke database
    const query = `INSERT INTO t_absensi(kd_absensi,kd_user,jenis_absen,lokasi,foto) VALUES(?,?,?,?,?)`;
    await pool.query(query, [
        uuidv4(),
        kd_user,
        jenis_absen,
        lokasi,
        photoFileName
    ]);
    return c.json({status:true,message:`absen ${jenis_absen} berhasil`},200)
}

export async function absenKeluarController(c:Context) {
    const {kd_user,jenis_absen,lokasi,foto} = await c.req.json();


    const [rows] = await pool.query("SELECT * FROM `t_absensi` WHERE kd_user=? AND date(waktu) = date(now()) AND jenis_absen='masuk' ORDER BY waktu DESC",[kd_user]);
    const [absenkeluar] = await pool.query("SELECT * FROM `t_absensi` WHERE kd_user=? AND date(waktu) = date(now()) AND jenis_absen='keluar' ORDER BY waktu DESC",[kd_user]);
    const result = rows as any[];
    const keluar = absenkeluar as any[];
    if (result.length>0){
        if (keluar.length === 0){
            const query = `INSERT INTO t_absensi(kd_absensi,kd_user,jenis_absen,lokasi,foto) VALUES(?,?,?,?,?)`;
            await pool.query(query, [
                uuidv4(),
                kd_user,
                jenis_absen,
                lokasi,
                foto]);
            return c.json({status:true,message:`absen ${jenis_absen} berhasil`},200)
        }
        return c.json({status:false,message:'anda sudah absen keluar'},400)
    }
    return c.json({status:false,message:'anda belum absen masuk'},400)

}