const RouteBase = require("./RouteBase");
const Database = require("../lib/database-manager");
const database = new Database(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);

const GitInfo = require('git-repo-info');
const gitInfo = GitInfo();

class Server extends RouteBase {

    constructor() {
        super();
    }

    async getStats(req, res) {
        let errors = []
        let fileCount = await database.select("COUNT(id) as files", process.env.UPLOAD_TABLE_V1, {}, true)
            .catch((error) => {
                console.error(error);
                error.push(error);
            });
        let viewCount = await database.select("COUNT(id) as views", process.env.VIEW_TABLE_V1, {}, true)
            .catch((error) => {
                console.error(error);
                error.push(error);
            });

        if (errors.length === 0) {
            res.set({ "Content-Type": "application/json" }).status(200)
                .send({
                    status: 200,
                    data: {
                        ...fileCount,
                        ...viewCount,
                        version: gitInfo.sha,
                        branch: gitInfo.branch
                    }
                });
        } else {
            res.set({ "Content-Type": "application/json" }).status(500)
                .send({
                    status: 500,
                    message: {
                        errors: errors
                    }
                });
        }
    }

    GetRoutes() {
        return (() => {
            var router = require("express").Router();

            router.get("/stats", this.isAuthenticated, this.getStats);

            return router;
        })();
    }
}

module.exports = Server;