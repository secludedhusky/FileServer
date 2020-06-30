const Database = require("../lib/database-manager");
const database = new Database(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);

const RegEx = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

const fs = require('fs-extra');

class FileGet {

    constructor() {
        database.connect()
            .then((r) => {
                console.log(`${this.constructor.name}: Connected to database.`);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async getFile(req, res) {
        let id = req.params.uuid;
        if (RegEx.exec(id)) {
            database.select("*", process.env.UPLOAD_TABLE_V1, { upload_id: id })
                .then((r) => {
                    let fileData = r[0];
                    let file = fs.createReadStream(fileData.upload_path);
                    res
                        .status(200)
                        .set({
                            "Content-Type": `${fileData.upload_mime}`,
                            "Content-Disposition": `filename="${fileData.upload_filename}"`
                        });

                    file.pipe(res);
                    console.log("Sent file");

                    database.insert(process.env.VIEW_TABLE_V1, {
                        view_data: JSON.stringify({ hello: "world" }),
                        view_date: "CURRENT_TIMESTAMP"
                    });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send({
                        status: 500,
                        message: error.message
                    });
                });

        } else {
            res
                .set({ "Content-Type": "application/json" })
                .status(404)
                .send({
                    status: 404,
                    message: `No file found with the ID ${id}`
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