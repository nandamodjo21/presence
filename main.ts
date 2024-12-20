import {serve} from '@hono/node-server'
import {Context, Hono} from 'hono'
import LoginController from "./src/controller/login_controller.js";
import {registerController} from "./src/controller/register_controller";
import {addBiodataController, getBiodataController} from "./src/controller/biodata_controller";
import {addPekerjaan, getPekerjaan} from "./src/controller/pekerjaan_controller";
import {absenKeluarController, absenMasukController} from "./src/controller/absen_controller";
import path from "path";
import fs from "fs";
import dotEnv from "dotenv";
import {LocationController} from "./src/controller/location_controller";
import {connection} from "./src/utils/use-variable";

dotEnv.config();
const app = new Hono()


app.get('/', (c) => {
    return c.json({data:'kontol'});
})

app.post('/login', LoginController)
app.post('/register',registerController)
app.get('/getBiodata',getBiodataController)
app.post('/addBiodata',addBiodataController)
app.get('/getPekerjaan',getPekerjaan)
app.post('/addPekerjaan',addPekerjaan)
app.post('/absenMasuk',absenMasukController)
app.post('/absenKeluar',absenKeluarController)
app.post('/location',LocationController)
app.get('/halo',(c)=>{
   return  c.text('halo')
});


app.get('/uploads/:filename', (c: Context) => {
    const { filename } = c.req.param();
    const filePath = path.join(__dirname, 'uploads', filename);

    if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath);
        const fileExtension = path.extname(filename).toLowerCase();

        let contentType = 'application/octet-stream';
        if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
            contentType = 'image/jpeg';
        } else if (fileExtension === '.png') {
            contentType = 'image/png';
        } else if (fileExtension === '.gif') {
            contentType = 'image/gif';
        }

        return c.body(file, {
            headers: { 'Content-Type': contentType },
        });
    } else {
        return c.text('File not found', 404);
    }
});


const port = 3000;
const url = process.env.BASE_URL;
console.log(`Server is running on ${url}:${port}`)

serve({
    fetch: app.fetch,
    port
})
// function generateRandomFourDigits(): number {
//     return Math.floor(1000 + Math.random() * 9000);
// }
