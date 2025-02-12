import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotEnv from "dotenv";
dotEnv.config();

export async function compareFaces(image2Path: string, image1: File,imageName:string) {
    if (!fs.existsSync(image2Path)) {
        return false;
    }

    const buffer1 = Buffer.from(await image1.arrayBuffer());

    const url = process.env.DEEPFACE;

    const formData = new FormData();
    formData.append('img1', buffer1, { filename: image1.name, contentType: image1.type });
    formData.append('img2', fs.createReadStream(image2Path), { filename: imageName });

    try {
        const response = await axios.post(`${url}`, formData, {
            headers: {
                ...formData.getHeaders(),
            }
        });

        const result = response.data;
        const isMatching = result.verified;
        return !!isMatching;
    } catch (error) {
        return false;
    }
}