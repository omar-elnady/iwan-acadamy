import multer from 'multer'
export const fileVaildation = {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    files: ['application/pdf', 'application/msword']
}

export function fileUplode(vaildationFile) {

    const storage = multer.diskStorage({})
    function fileFilter(req, file, cb) {
        if (vaildationFile.includes(file.mimetype)) {
            cb(null, true)
        }
        else {
            cb(new Error("in-valid format"), false)
        }
    }
    const upload = multer({ dest: "uploads", fileFilter, storage })
    return upload
}