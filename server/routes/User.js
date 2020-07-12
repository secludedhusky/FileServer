const RouteBase = require("./RouteBase");
const DatabaseManager = require("../lib/database-manager");
const database = new DatabaseManager(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);

const FileRegEx = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

const fs = require("fs");

class User extends RouteBase {

    constructor() {
        super();
    }

    async getTokens(req, res) {
        let options = {};
        if (req.params.hasOwnProperty("id")) {
            options.token_id = req.params.id;
        }

        res.status(204).send({
            status: 204,
            message: "No content"
        });
    }

    async getFile(req, res) {
        let fileId = req.params.id;
        let download = req.params.download ? true : false;

        if (FileRegEx.exec(fileId)) {
            database.select({
                columns: "*",
                from: process.env.UPLOAD_TABLE_V1,
                where: { id: fileId }
            })
                .then((r) => {
                    if (r.length > 0) {
                        let fileData = r[0];
                        let file = fs.createReadStream(fileData.upload_path);
                        let headers = {
                            "Content-Type": `${fileData.upload_mime}`,
                            "Content-Disposition": `${download ? "attachment; " : ""}filename="${fileData.upload_filename}"`
                        };

                        res.status(200).set(headers);
                        file.pipe(res);
                    } else {
                        res.status(404).send({
                            status: 404,
                            message: "File does not exist"
                        });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send({
                        status: 500,
                        message: error.message
                    });
                });
        } else {
            res.status(404).send({
                status: 404,
                message: `No file found with id: ${fileId}`
            });
        }
    }

    async getFiles(req, res) {
        let options = {};
        if (req.params.id) {
            options.id = req.params.id;
        }

        let files = await database.select({
            columns: `
                ${process.env.UPLOAD_TABLE_V1}.id, 
                ${process.env.UPLOAD_TABLE_V1}.upload_filename, 
                ${process.env.UPLOAD_TABLE_V1}.upload_date, 
                ${process.env.UPLOAD_TABLE_V1}.upload_mime, 
                ${process.env.UPLOAD_TABLE_V1}.upload_url, 
                COUNT(${process.env.VIEW_TABLE_V1}.view_id) as upload_views`,
            from: process.env.UPLOAD_TABLE_V1,
            where: { upload_user: req.user.id, ...options },
            join: {
                mode: "LEFT",
                from: { id: "id" },
                on: { table: process.env.VIEW_TABLE_V1, id: "view_id" },
                groupBy: `${process.env.UPLOAD_TABLE_V1}.id`
            }
        })
            .catch((error) => {
                console.error(error);
                res.status(500).send({
                    status: 500,
                    message: "Internal server error"
                });
            });

        if (files) {
            res.status(200).send({
                status: 200,
                data: [...files]
            });
        } else {
            res.status(204).send({
                status: 204,
                message: "No content"
            });
        }
    }

    GetRoutes() {
        return (() => {
            var router = require("express").Router();

            router.get("/file/:id/:download?", this.isAuthenticated, this.getFile);
            router.get("/files/:id?", this.isAuthenticated, this.getFiles);
            router.get("/tokens/:id?", this.isAuthenticated, this.getTokens);

            return router;
        })();
    }
}

module.exports = User;