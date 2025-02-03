const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${extension}`);
    }
});

const upload = multer({ storage: storage });

module.exports = { upload };
