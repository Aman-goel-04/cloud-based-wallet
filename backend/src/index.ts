import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./db.js";
import { signupRouter } from "./routes/signup.js";
import { signinRouter } from "./routes/signin.js";
import { signTxnRouter } from "./routes/signTxn.js";
import { getTxnStatusRouter } from "./routes/getTxnStatus.js";

await connectDB();

export const app = express();

app.use(express.json());

app.use("/api/v1", signupRouter);
app.use("/api/v1", signinRouter);
app.use("/api/v1", signTxnRouter);
app.use("/api/v1", getTxnStatusRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT: ${process.env.PORT}`)
}); 