import {Context} from "hono";
import pool from "../config/db";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import path from "path";
import {calculateDistance} from "../helper/location_helper";
import {connection} from "../utils/use-variable";

const radius = 20;
export async function absenMasukController(c:Context){

    try {
        const body = await c.req.parseBody({all:true});
        const kd_user = body['kd_user'];
        const jenis_absen = body['jenis_absen'];
        const latitude = body['latitude'];
        const longitude = body['longitude'];
        const foto = body['foto'];
        if (
            !foto ||
            !(foto instanceof File)
        ) {
            return c.json({ status: false, message: 'File foto_wajah tidak valid atau tidak ada' }, 400);
        }
        const [location] = await pool.query(`SELECT * FROM t_location`);
        const resultLocation = location as any[];
        console.log(resultLocation);
        if (resultLocation.length ===0){
            return c.json({status:false,message:'location not found'},404)
        }
        const located = resultLocation[0];

        const distance = calculateDistance(located.latitude, located.longitude, latitude, longitude);
        if (distance > radius) {
            return c.json({
                status: false,
                message: 'Lokasi Anda terlalu jauh untuk melakukan absensi.'},400)
        }

        const [rows] = await pool.query("SELECT * FROM `t_absensi` WHERE kd_user=? AND date(waktu) = date(now()) AND jenis_absen ='masuk' ORDER BY waktu DESC",[kd_user]);
        const result = rows as any[];
        if (result.length>0){
            return c.json({status:false,message:'anda sudah absen masuk'},400)
        }


        const uploadsDir = "./uploads";
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }

        const photoFileName = `${uuidv4()}_${foto.name}`;
        const photoFilePath = path.join(uploadsDir, photoFileName);
        const photoData = Buffer.from(await foto.arrayBuffer());

        fs.writeFileSync(photoFilePath, photoData);

        const query = `INSERT INTO t_absensi(kd_absensi,kd_user,jenis_absen,foto,latitude,longitude) VALUES(?,?,?,?,?,?)`;
        await pool.query(query, [
            uuidv4(),
            kd_user,
            jenis_absen,
            photoFileName,
            latitude,
            longitude
        ]);
        return c.json({status:true,message:`absen ${jenis_absen} berhasil`},200)
    }catch (e) {
        console.log(e)
        return c.json({
            status: false,
            message: 'Gagal memuat model untuk deteksi wajah.',
        }, 500);
    }
}

export async function absenKeluarController(c:Context) {
    const body = await c.req.parseBody({all:true});
    const kd_user = body['kd_user'];
    const jenis_absen = body['jenis_absen'];
    const latitude = body['latitude'];
    const longitude = body['longitude'];
    const foto = body['foto'] as File;

    const [location] = await pool.query(`SELECT * FROM t_location`);
    const resultLocation = location as any[];
    if (resultLocation.length===0){
        return c.json({status:false,message:'location not found'},404)
    }
    const located = resultLocation[0];
    const distance = calculateDistance(located.latitude, located.longitude, latitude, longitude);

    if (distance > radius) {
        return c.json({
            status: false,
            message: 'Lokasi Anda terlalu jauh untuk melakukan absensi.'},400)
    }
    const [rows] = await pool.query("SELECT * FROM `t_absensi` WHERE kd_user=? AND date(waktu) = date(now()) AND jenis_absen='masuk' ORDER BY waktu DESC",[kd_user]);
    const [absenkeluar] = await pool.query("SELECT * FROM `t_absensi` WHERE kd_user=? AND date(waktu) = date(now()) AND jenis_absen='keluar' ORDER BY waktu DESC",[kd_user]);
    const result = rows as any[];
    const keluar = absenkeluar as any[];
    if (result.length>0){
        if (keluar.length === 0){
            const uploadImage = "./uploads";
            if (!fs.existsSync(uploadImage)) {
                fs.mkdirSync(uploadImage);
            }

            const photoFileName = `${uuidv4()}_${foto.name}`;
            const photoFilePath = path.join(uploadImage, photoFileName);
            const photoData = Buffer.from(await foto.arrayBuffer());

            fs.writeFileSync(photoFilePath, photoData);
            const query = `INSERT INTO t_absensi(kd_absensi,kd_user,jenis_absen,foto,latitude,longitude) VALUES(?,?,?,?,?,?)`;
            await pool.query(query, [
                uuidv4(),
                kd_user,
                jenis_absen,
                photoFileName,
                latitude,
                longitude]);
            return c.json({status:true,message:`absen ${jenis_absen} berhasil`},200)
        }
        return c.json({status:false,message:'anda sudah absen keluar'},400)
    }
    return c.json({status:false,message:'anda belum absen masuk'},400)
}





