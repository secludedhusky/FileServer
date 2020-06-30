const Database = require("../lib/database-manager");
const database = new Database(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);

const RegEx = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

const fs = require('fs-extra');

class FileGet {

    constructor() {

    }

    async getFile(req, res) {
        let fileId = req.params.uuid;

        database.insert(process.env.VIEW_TABLE_V1, {
            view_data: JSON.stringify({
                method: req.method,
                originalUrl: req.originalUrl,
                baseUrl: req.baseUrl,
                headers: req.headers,
                rawHeaders: req.rawHeaders,
                httpVersion: req.httpVersion,
                hostname: req.hostname,
                params: req.params,
                ip: req.ip,
                ips: req.ips,
                body: req.body,
                fresh: req.fresh,
                destroyed: req.destroyed,
                complete: req.complete,
                secure: req.secure,
                xhr: req.xhr
            }),
            view_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            view_id: fileId
        })
            .then((r) => { console.log(r); })
            .catch((error) => { console.error(error); });

        if (RegEx.exec(fileId)) {
            database.select("*", process.env.UPLOAD_TABLE_V1, { upload_id: fileId })
                .then((r) => {
                    if (r.length > 0) {
                        let fileData = r[0];
                        let file = fs.createReadStream(fileData.upload_path);
                        let headers = {
                            "Content-Type": `${fileData.upload_mime}`,
                            "Content-Disposition": `filename="${fileData.upload_filename}"`
                        };

                        res.status(200).set(headers);
                        file.pipe(res);
                    } else {
                        res.status(500).send({
                            status: 500,
                            message: error.message
                        });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500)
                        .send({
                            status: 500,
                            message: error.message
                        });
                });
        } else {
            res.set({ "Content-Type": "application/json" }).status(404)
                .send({
                    status: 404,
                    message: `No file found with id: ${id}`
                });
        }
    }

    GetRoutes() {
        return (() => {
            var router = require("express").Router();

            router.get("/:uuid", this.getFile);

            return router;
        })();
    }
}

module.exports = FileGet;