import fs from "fs";
export class ResponseError extends Error {
    constructor(public status: number, public message: string) {
        super(message);
    }
}
const errorLogFilePath = "bugs/error.json";
const exceptionLogFilePath = "bugs/exception.json";

function saveLog(log:any, logFilePath:any) {
    let logArray = [];
    if (fs.existsSync(logFilePath)) {
        const logData = fs.readFileSync(logFilePath);
        logArray = JSON.parse(logData.toString());
    }

    if (!Array.isArray(logArray)) {
        logArray = [];
    }

    logArray.push(log);
    fs.writeFileSync(logFilePath, JSON.stringify(logArray, null, 2));
}

async function handleError(err: any, additionalInfo?: string) {
    try {
        const errorMessage = err || "Unknown error";
        const errorLog = {
            level: "error",
            message: {
                error: errorMessage,
                additionalInfo: additionalInfo,
                exception: true,
            },
            timestamp: new Date(),
        };
        saveLog(errorLog, errorLogFilePath);

        process.on("uncaughtException", (err) => {
            const errorMessage = err.message || "Unknown error";
            const errorLog = {
                level: "error",
                message: {
                    error: errorMessage,
                    exception: true,
                },
                timestamp: new Date(),
            };
            saveLog(errorLog, exceptionLogFilePath);
        });
    } catch (fixError) {
        console.error("Kesalahan saat memperbaiki:", fixError);
    }
}

export default handleError;