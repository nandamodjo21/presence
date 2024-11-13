import {BiodataResponse} from "./biodata_model";

export type pekerjaanResponse = {
    id_karyawan: string;
    nama_pt:string;
    nama_organisasi: string;
    posisi_pekerjaan: string;
    level_pekerjaan: string;
    status_pekerjaan: string;
    tanggal_bergabung:string;
    tanggal_berakhir:string;
    masa_kerja:string;
}

export function toPekerjaanResponse(data:any):pekerjaanResponse {
    return {
        id_karyawan:data.id_karyawan,
        nama_pt:data.nama_pt,
        nama_organisasi:data.nama_organisasi,
        posisi_pekerjaan:data.posisi_pekerjaan,
        level_pekerjaan:data.level_pekerjaan,
        status_pekerjaan:data.status_pekerjaan,
        tanggal_bergabung:data.tanggal_bergabung,
        tanggal_berakhir:data.tanggal_berakhir,
        masa_kerja:data.masa_kerja
    }
}