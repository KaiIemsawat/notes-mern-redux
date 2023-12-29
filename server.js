import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import mongoose from "mongoose";

import corsOptions from "./config/corsOprions.js";
import { errorHandler, logEvents, logger } from "./middleware/logger.js";
import rootRouter from "./routes/root.js"; // Import the router using ES module syntax
import root404 from "./routes/root404.js";
import dotenv from "dotenv";
import dbConn from "./config/dbConn.js";
import userRoute from "./routes/userRoutes.js";
import noteRoute from "./routes/noteRoutes.js";

dotenv.config();
console.log(process.env.NODE_ENV);
dbConn();
const PORT = process.env.PORT || 3500;

// To fix 'ReferenceError: __dirname is not defined in ES module scope' issue when use "type": "module"
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", rootRouter);
app.use("/users", userRoute);
app.use("/notes", noteRoute);
app.use("*", root404);

app.use(errorHandler);
mongoose.connection.once("open", () => {
    console.log("CONNECTED TO MONGODB");
    app.listen(PORT, () => console.log(`SERVER'S LAUNCHED ON PORT :: ${PORT}`));
});

mongoose.connection.on("error", (err) => {
    console.log(err);
    logEvents(
        `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
        "mongoErrLog.log"
    );
});
