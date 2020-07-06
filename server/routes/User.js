const RouteBase = require("./RouteBase");
const DatabaseManager = require("../lib/database-manager");
const database = new DatabaseManager(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);

const passport = require("passport");

class User extends RouteBase {

    constructor() {
        super();
    }

    async getTokens(req, res) {
        // Single token selection property
        let options = {};
        if (req.params.hasOwnProperty("id")) {
            options.token_id = req.params.id;
        }

        res.status(204).send({
            status: 204,
            message: "No content"
        });
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

            router.get("/files/:id?", this.isAuthenticated, this.getFiles);
            router.get("/tokens/:id?", this.isAuthenticated, this.getTokens);

            return router;
        })();
    }
}

module.exports = User;