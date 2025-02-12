export type LocationResponse = {
    kd_client: string;
    latitude:string;
    longitude:string;
}

export function toLocationResponse(data:LocationResponse){
    return {
        kd_client: data.kd_client,
        latitude:data.latitude,
        longitude:data.longitude,
    }
}