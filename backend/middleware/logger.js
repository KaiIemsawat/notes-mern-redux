import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        const logsDir = path.join(__dirname, "..", "logs");
        const logsDirStat = await fsPromises.stat(logsDir);
        if (!logsDirStat.isDirectory()) {
            await fsPromises.mkdir(logsDir);
        }
        await fsPromises.appendFile(path.join(logsDir, logFileName), logItem);
    } catch (err) {
        console.log(err);
    }
};

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
    console.log(`${req.method} : ${req.path}`);
    next();
};

const errorHandler = (err, req, res, next) => {
    logEvents(
        `${err.name} : ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        "errLog.log"
    );
    console.log(err.stack);

    const status = res.statusCode ? res.statusCode : 500;

    res.status(status);

    res.json({ message: err.message });
    next();
};

export { logEvents, logger, errorHandler };
