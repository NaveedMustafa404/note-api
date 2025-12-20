import multer from "multer";
import crypto from "crypto";
import path from "path";

import fs from "fs";

const UPLOAD_DIR = "/app/uploads";

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: "/app/uploads",
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, crypto.randomUUID() + ext);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 },
});