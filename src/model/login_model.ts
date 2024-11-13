

export type LoginResponse = {
    kd_user: string;
    username:string;
    status:string;
    role:string;
    createdAt:Date;
}

export  function toLoginResponse(user: any): LoginResponse {
    return {
        kd_user:user.kd_user,
        username:user.username,
        status:user.status,
        role:user.role,
        createdAt:user.created_at
    }
}