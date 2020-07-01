const GitInfo = require('git-repo-info');

const gitInfo = GitInfo();

class Utilities {

    constructor() { }

    async getVersion(req, res) {
        res.send(gitInfo.sha);
    }

    GetRoutes() {
        return (() => {
            var router = require("express").Router();

            router.get("/version", this.getVersion);

            return router;
        })();
    }
}

module.exports = Utilities;