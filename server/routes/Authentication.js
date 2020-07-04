// Base Class
const RouteBase = require("./RouteBase");

// Database
const DatabaseManager = require("../lib/database-manager");
const database = new DatabaseManager(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);

// Passport
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

// BCrypt
const bcrypt = require('bcrypt');
const { request } = require("express");

passport.use(new LocalStrategy(
    async (username, password, done) => {
        let password = bcrypt.
        await database.select("id, user_name, user_email")
            .then((data) => {
                if (data.length > 0 && data.user_name === username) {

                }
            })
            .catch((error) => {
                done(error, false, {
                    status: 500,
                    message: "Unable to connect to database."
                });
            });


        database.select({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));


class Authentication extends RouteBase {
    constructor() {
        super();
    }

    validateInputs(request) {
        let validateEmail = /.+@.+\..+/.test(request.email);
        let validateUsername = /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/.test(request.username);

        let invalid = [];
        if (!validateEmail) {
            invalid.push("user_email");
        }
        if (!validateUsername) {
            invalid.push("user_name");
        }

        return {
            valid: (invalid.length === 0),
            data: invalid
        };
    }

    async checkDuplicates(request) {
        let check = await database.select("user_name, user_email", process.env.USER_TABLE_V1, [
            { user_name: request.username },
            { user_email: request.email }
        ]);

        let conflicts = [];
        if (check.length > 0) {
            if (check[0].hasOwnProperty("user_name") && check[0].user_name === request.username) {
                conflicts.push("user_name");
            }
            if (check[0].hasOwnProperty("user_email") && check[0].user_email === request.email) {
                conflicts.push("user_email");
            }
        }

        return {
            valid: (conflicts.length === 0),
            data: conflicts
        };
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
        let inputCheck = this.validateInputs(req.body);
        if (!inputCheck.valid) {
            res.status(422).send({
                status: 422,
                message: "Invalid data provided.",
                data: inputCheck.data
            });
            return;
        }

        let duplicateCheck = await this.checkDuplicates(req.body);
        if (!duplicateCheck.valid) {
            res.status(409).send({
                status: 409,
                message: "An account with that username or email already exists.",
                data: duplicateCheck.data
            });
            return;
        }

        bcrypt.hash(req.body.password, 10)
            .then((hash) => {
                database.insert(process.env.USER_TABLE_V1, {
                    user_name: req.body.username,
                    user_pass: hash,
                    user_email: req.body.email,
                    user_permission: JSON.stringify({}),
                    user_creation: new Date().toISOString().slice(0, 19).replace('T', ' ')
                })
                    .then((r) => {
                        if (r.affectedRows === 1) {
                            res.status(201).send({
                                status: 201,
                                message: "Account created"
                            })
                        } else {
                            res.status(409).send({
                                status: 409,
                                message: JSON.stringify(r)
                            })
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send({
                            status: 500,
                            message: "Internal server error"
                        });
                    });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send({
                    status: 500,
                    message: "Internal server error"
                });
                return;
            })
    }

    GetRoutes() {
        return (() => {
            var router = require("express").Router();

            router.post("/login", (req, res) => { this.login(req, res); });
            router.post("/register", (req, res) => { this.register(req, res); });
            router.get("/logout", (req, res) => { this.logout(req, res); });

            return router;
        })();
    }
}

module.exports = Authentication;