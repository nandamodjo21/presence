import { Context } from "hono";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

export async function faces(c: Context) {
    const body = await c.req.parseBody();
    const image1 = body['img1'];  // Dari request
    const image2Name = body['img2'] as string; // Hanya nama file

    console.log(image2Name);
    // Validasi `image1`
    if (!image1 || typeof image1 !== 'object' || !image1.name) {
        return c.json({ status: false, message: 'File img1 tidak valid atau tidak ada' }, 400);
    }

    // Path lengkap untuk `image2` (ambil dari folder)
    const image2Path = path.resolve(__dirname, "../..", "uploads", image2Name);
    console.log(image2Path)
    // Periksa apakah file `image2` ada di folder
    if (!fs.existsSync(image2Path)) {
        return c.json({ status: false, message: `File ${image2Name} tidak ditemukan di server` }, 400);
    }

    console.log("Image 1:", image1);
    console.log("Image 2 (dari folder):", image2Path);

    // Konversi `image1` menjadi `Buffer`
    const buffer1 = Buffer.from(await image1.arrayBuffer());

    // Buat objek FormData
    const formData = new FormData();
    formData.append('img1', buffer1, { filename: image1.name, contentType: image1.type });
    formData.append('img2', fs.createReadStream(image2Path), { filename: image2Name });

    try {
        const response = await axios.post('http://localhost:5000/verify', formData, {
            headers: {
                ...formData.getHeaders(),
            }
        });

       const result = response.data;
        return c.json({status:true, message:"success",verified:result.verified},200);
    } catch (error) {
        console.error('Error:', error);
        return c.json({ status: false, message: 'Terjadi kesalahan saat memproses gambar' }, 500);
    }
}
