const RouteBase = require("./RouteBase");
const Database = require("../lib/database-manager");
const database = new Database(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);

const GitInfo = require('git-repo-info');
const gitInfo = GitInfo();

class Utilities extends RouteBase {

    constructor() {
        super();
    }

    async getVersion(req, res) {
        res.set({ "Content-Type": "application/json" }).status(200)
            .send({
                status: 200,
                message: [{ version: gitInfo.sha, branch: gitInfo.branch }]
            });
    }

    async getStats(req, res) {
        database.select("COUNT(id) as files", process.env.UPLOAD_TABLE_V1)
            .then((r) => {
                res.set({ "Content-Type": "application/json" }).status(200)
                    .send({
                        status: 200,
                        message: r
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    GetRoutes() {
        return (() => {
            var router = require("express").Router();

            router.get("/version", this.getVersion);
            router.get("/stats", this.getStats);

            return router;
        })();
    }
}

module.exports = Utilities;