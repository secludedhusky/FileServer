const RouteBase = require("./RouteBase");

class Authentication extends RouteBase {
    constructor() {
        super();
    }

    async login(req, res) {
        res.set({ "Content-Type": "application/json" }).status(401)
            .send({
                status: 401,
                message: `Unauthorized`
            });
    }

    async logout(req, res) {
        res.set({ "Content-Type": "application/json" }).status(401)
            .send({
                status: 401,
                message: `Unauthorized`
            });
    }

    async register(req, res) {
        res.set({ "Content-Type": "application/json" }).status(401)
            .send({
                status: 401,
                message: `Unauthorized`
            });
    }

    GetRoutes() {
        return (() => {
            var router = require("express").Router();

            router.post("/login", this.login);
            router.post("/register", this.register);
            
            router.get("/logout", this.logout);

            return router;
        })();
    }
}

module.exports = Authentication;