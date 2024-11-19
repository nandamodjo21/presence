export type LocationResponse = {
    latitude:string;
    longitude:string;
}

export function toLocationResponse(data:any):LocationResponse{
    return {
        latitude:data.latitude,
        longitude:data.longitude,
    }
}