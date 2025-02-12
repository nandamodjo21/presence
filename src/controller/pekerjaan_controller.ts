import {Context} from "hono";
import pool from "../config/db";
import {toPekerjaanResponse} from "../model/pekerjaan_model";

export async function getPekerjaan(c:Context){
    const kd_biodata = c.req.query();

    const [rows] = await pool.query(`SELECT ta.id_karyawan,ta.kd_biodata,tb.nama_lengkap,ta.kd_client,tc.nama_client,ta.nama_organisasi,ta.posisi_pekerjaan,ta.level_pekerjaan,ta.status_pekerjaan,ta.tanggal_bergabung,ta.tanggal_berakhir,ta.masa_kerja FROM \`t_pekerjaan\` ta JOIN t_client tc ON(ta.kd_client=tc.kd_client) JOIN t_biodata tb ON(ta.kd_biodata=tb.kd_biodata) WHERE ta.kd_biodata = ?;`, [kd_biodata.kd_biodata]);
    const result = rows as any[];
    if (result.length > 0){
        return c.json({status:true,message:'data found',data:result.map(toPekerjaanResponse)},200)
    }
    return c.json({status:false,message:'data not found'},404);
}


export async function addPekerjaan(c:Context){
    const{
        kd_biodata,
        client,
        nama_organisasi,
        posisi_pekerjaan,
        level_pekerjaan,
        status_pekerjaan,
        tanggal_bergabung,
        tanggal_berakhir,
        masa_kerja,
    } =await c.req.json();

    const [rows] = await pool.query(`SELECT * FROM t_pekerjaan WHERE kd_biodata = ?`, [kd_biodata]);

    const result = rows as any[];
    if (result.length > 0){
        return c.json({status:false,message:'Info pekerjaan sudah ada'},400)
    }

    const currentYear = new Date().getFullYear();
    const month = new Date().getMonth()+1;
    const date = new Date().getDate();
    const randomTens = Math.floor(Math.random() * 90) + 10;



    const idKaryawan = `${currentYear}${month}${date}${randomTens}`;
    console.log('id',idKaryawan)

    const query = `INSERT INTO t_pekerjaan(
    id_karyawan,kd_biodata,kd_client,nama_organisasi,posisi_pekerjaan,level_pekerjaan,status_pekerjaan,tanggal_bergabung,tanggal_berakhir,masa_kerja)
    VALUES(?,?,?,?,?,?,?,?,?,?)`;

    await pool.query(query,[
        idKaryawan,
        kd_biodata,
        client,
        nama_organisasi.toUpperCase(),
        posisi_pekerjaan.toUpperCase(),
        level_pekerjaan,
        status_pekerjaan,
        tanggal_bergabung,
        tanggal_berakhir,
        masa_kerja
    ]);

    return c.json({status:true,message:'berhasil menambahkan pekerjaan'},200)
}