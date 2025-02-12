

export type LoginResponse = {
    id_karyawan:string;
    kd_biodata:string;
    kd_client:string;
    nama_lengkap:string;
    role:string;
    status:string;
}
export type UserLoginResponse = {
    kd_user:string;
    username:string;
    role:string;
    status:string;
}

export  function toLoginResponse(user: LoginResponse) {
    return {
        kd_user:user.kd_biodata,
        kd_karyawan:user.id_karyawan,
        kd_client:user.kd_client,
        name:user.nama_lengkap,
        role:user.role,
        is_active:user.status,
    }
}

export function toUserLogin(data: UserLoginResponse) {
    return {
        kd_user:data.kd_user,
        username:data.username,
        role:data.role,
        status:data.status,
    }
}