import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const DATABASE_URL = process.env.DATABASE_URL;
const HOST_API_PORT = process.env.HOST_API_PORT;

export default {
DATABASE_URL,
HOST_API_PORT,
};