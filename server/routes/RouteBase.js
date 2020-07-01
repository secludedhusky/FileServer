class RouteBase {

    notImplemented(req, res) {
        res.set({ "Content-Type": "application/json" }).status(501)
            .send({
                status: 501,
                message: `Not implemented.`
            });
    }

    GetRoutes() {
        return (() => {
            var router = require("express").Router();

            router.get("/*", this.notImplemented);

            return router;
        })();
    }
}


module.exports = RouteBase;