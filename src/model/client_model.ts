export type ClientResponse = {
    kd_client:string;
    nama_client:string;
    type_client:string;
}

export function ToClientResponse(data:any):ClientResponse {
    return {
        kd_client:data.kd_client,
        nama_client:data.nama_client,
        type_client:data.type_client
    }
}

