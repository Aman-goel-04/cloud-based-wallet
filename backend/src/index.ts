import express from "express";
import type { Request, Response } from "express";

const app = express();

app.post("/api/v1/signup", (req: Request, res: Response) => {
    return res.json({
        message: "sign up"
    });
});

app.post("/api/v1/signin", (req: Request, res: Response) => {
    return res.json({
        message: "sign in"
    });
});

app.post("/api/v1/txn/sign", (req: Request, res: Response) => {
    return res.json({
        message: "sign a txn"
    });
});

app.get("/api/v1/txn/:id", (req: Request, res: Response) => {
    return res.json({
        message: "poll the backend to check if the {id} txn has been processed."
    });
});

app.listen(3000); 