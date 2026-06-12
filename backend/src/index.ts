import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export const app = express();

app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT: ${process.env.PORT}`)
}); 