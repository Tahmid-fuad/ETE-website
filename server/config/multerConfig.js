const multer = require('multer');
const path = require('path');

const createStorage = (destination, filenameFunction) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `public/${destination}`);
        },
        filename: filenameFunction
    });
};

const photoStorage = createStorage('images', (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.body.email}${ext}`);
});

const teacherStorage = createStorage('teacherimage', (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.body.email}${ext}`);
});

const noticeStorage = createStorage('noticefile', (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
});

const owlStorage = createStorage('owlimage', (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
});

const picLibStorage = createStorage('piclib', (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
});

const routineStorage = createStorage('routine', (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
});

const reventStorage = createStorage('reventfile', (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
});

module.exports = {
    upload: multer({ storage: photoStorage }),
    teacherUpload: multer({ storage: teacherStorage }),
    noticeUpload: multer({ storage: noticeStorage }),
    owlUpload: multer({ storage: owlStorage }),
    picLibUpload: multer({ storage: picLibStorage }),
    routineUpload: multer({ storage: routineStorage }),
    reventUpload: multer({ storage: reventStorage })
}; 