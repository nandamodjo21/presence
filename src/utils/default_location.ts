import dotEnv from "dotenv";
dotEnv.config();
const locationAbsensi = {
    latitude: process.env.LATITUDE,
    longitude: process.env.LONGITUDE
}

export default locationAbsensi;