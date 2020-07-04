const RouteBase = require("./RouteBase");
const DatabaseManager = require("../lib/database-manager");
const database = new DatabaseManager(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);

const passport = require("passport");

class Dashboard extends RouteBase {

    constructor() {
        super();
    }

    async getUserFiles(req, res) {
        res.status(200).send({
            status: 200,
            data: {
                files: [
                    { name: "test" }
                ]
            }
        })
    }

    GetRoutes() {
        return (() => {
            var router = require("express").Router();

            router.get("/files", passport.authenticate('local'), this.getUserFiles);

            return router;
        })();
    }
}

module.exports = Dashboard;