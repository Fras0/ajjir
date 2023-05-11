const multer = require('multer');
const uuid = require('uuid').v1;

const upload = multer({
    storage: multer.diskStorage({
        destination: 'user-data/verification',
        filename: function(req, file, cb) {
            cb(null, uuid() + '-' + file.originalname);
        }
    })
});

const configuredMulterMiddleware = upload.array('image',2);

module.exports = configuredMulterMiddleware;