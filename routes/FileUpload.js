const Database = require("../lib/database-manager");
const database = new Database(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);

const path = require('path');
const fs = require('fs-extra');
const mime = require("mime-types");
const { v4: uuid } = require("uuid");

class FileUpload {

    constructor() {

    }

    /**
     * Upload File
     * @param {object} req | Incoming request data
     * @param {object} res | Handle responses
     */
    async uploadFile(req, res) {
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            try {
                console.log("Uploading:", filename);

                let requestId = uuid();

                let fileExt = path.extname(filename);
                let newFilename = `${requestId}${fileExt}`;
                let filePath = `${__dirname}/public/${newFilename}`;
                let fileMime = mime.lookup(filename);

                let stream = fs.createWriteStream(filePath);
                file.pipe(stream);

                stream.on('error', (error) => {
                    console.log(error);
                    res.status(500)
                        .send({
                            status: 500,
                            message: `An error occured: ${error.message}`
                        });
                })

                stream.on('close', function () {
                    console.log("Uploaded: ", filename);

                    database.insert(process.env.UPLOAD_TABLE_V1, {
                        upload_id: requestId,
                        upload_path: filePath,
                        upload_user: "todo",
                        upload_filename: filename,
                        upload_mime: fileMime
                    })
                        .then((r) => {
                            res.set({ "Content-Type": "application/json" }).status(200)
                                .send({
                                    status: 200,
                                    data: {
                                        link: `http://${req.hostname}${process.env.APP_PORT === 80 || process.env.APP_PORT === 443 ? "" : `:${process.env.APP_PORT}`}${process.env.API_V1}/${requestId}`
                                    }
                                });
                        })
                        .catch((error) => {
                            res.status(500)
                                .send({
                                    status: 500,
                                    message: error.message
                                });
                            console.error("Upload successful, but the file was not recorded in the DB.", "\nError:", error, "\nFile:", { newFilename: newFilename, fileExt: fileExt, filePath: filePath, fileMime: fileMime, requestId: requestId });
                        });
                });
            } catch (error) {
                console.log(error);
                res.status(500)
                    .send({
                        status: 500,
                        message: error.message
                    });
            }
        });
    }

    GetRoutes() {
        return (() => {
            var router = require("express").Router();

            router.post("/", this.uploadFile);

            return router;
        })();
    }
}

module.exports = FileUpload;