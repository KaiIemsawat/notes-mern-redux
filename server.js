import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";

import corsOptions from "./config/corsOprions.js";
import { errorHandler, logger } from "./middleware/logger.js";
import rootRouter from "./routes/root.js"; // Import the router using ES module syntax
import root404 from "./routes/root404.js";

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
app.use("*", root404);

app.use(errorHandler);
app.listen(PORT, () => console.log(`SERVER'S LAUNCHED ON PORT :: ${PORT}`));
