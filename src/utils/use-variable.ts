import connectDB from "../config/db"

import {configDotenv} from "dotenv";
import pool from "../config/db";

configDotenv();

export const env = process.env;
export const connection = pool;