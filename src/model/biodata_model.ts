

export type BiodataResponse = {
    nama_lengkap:string;
    email:string;
    nomor_ponsel:string;
    tempat_lahir:string;
    tanggal_lahir:string;
    jenis_kelamin:string;
    status_perkawinan:string;
    alamat_ktp:string;
    alamat_tempat_tinggal:string;
    foto_wajah:string;
}

export function toBiodataResponse(data:any):BiodataResponse {
   return {
       nama_lengkap:data.nama_lengkap,
       email:data.email,
       nomor_ponsel:data.nomor_ponsel,
       tempat_lahir:data.tempat_lahir,
       tanggal_lahir:data.tanggal_lahir,
       jenis_kelamin:data.jenis_kelamin,
       status_perkawinan:data.status_perkawinan,
       alamat_ktp:data.alamat_ktp,
       alamat_tempat_tinggal:data.alamat_tempat_tinggal,
       foto_wajah:data.foto_wajah
   }
}

