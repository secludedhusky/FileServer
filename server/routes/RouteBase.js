const passport = require("passport");
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;
const DatabaseManager = require("../lib/database-manager");

class RouteBase {
    
    constructor() {
        // Database
        this.database = new DatabaseManager(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);
        
        // Passport
        this.passport = passport;

        this.passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, async (u, p, d) => { await this.loginStrategy(u, p, d) }));
        this.passport.serializeUser(function (user, done) {
            console.log("Serialise", user);
            done(null, user);
        });
        this.passport.deserializeUser(function (user, done) {
            console.log("User is authenticated:", user.username);
            done(null, user);
        });
    }

    async loginStrategy(username, password, done) {
        let data = await this.database.select("id, user_name, user_email, user_pass", process.env.USER_TABLE_V1, { user_name: username })
            .catch((error) => {
                done(error);
            });

        if (data.length > 0 && data[0].user_name === username) {
            let match = bcrypt.compare(password, data[0].user_pass);
            if (match) {
                done(null, {
                    id: data[0].id,
                    username: data[0].user_name,
                    email: data[0].user_email
                });
            } else {
                done(null, false, { message: "Invalid password" });
            }
        } else {
            done(null, false, { message: "Invalid credentials" });
        }
    }

    notImplemented(req, res) {
        res.set({ "Content-Type": "application/json" }).status(501)
            .send({
                status: 501,
                message: `Not implemented.`
            });
    }

    isAuthenticated(req, res, next) {
        if (req.user) {
            return next();
        } else {
            return res.status(401).send({
                status: 401,
                message: "Not logged in."
            });
        }
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