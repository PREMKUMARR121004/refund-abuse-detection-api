
import express from "express";
import dotenv from "dotenv";

import connectDb from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import refundRoutes from "./src/routes/refundRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", refundRoutes);

const startServer = async () => {
    try {
        await connectDb();

        const PORT = process.env.PORT

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exitCode = 1;
    }
};

startServer();
