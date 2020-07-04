// Base Class
const RouteBase = require("./RouteBase");

// Database
const DatabaseManager = require("../lib/database-manager");
const database = new DatabaseManager(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);

// User
const User = require("../types/User");

// Passport
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

// BCrypt
const bcrypt = require('bcrypt');

class Authentication extends RouteBase {
    constructor() {
        super();

        passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, async (u, p, d) => { await this.loginStrategy(u, p, d) }));
        passport.serializeUser(function (user, done) { done(null, user); });
        passport.deserializeUser(function (user, done) { done(null, user); });
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

    async loginStrategy(username, password, done) {
        let data = await database.select("id, user_name, user_email, user_pass", process.env.USER_TABLE_V1, { user_name: username })
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

    async login(req, res) {
        if (req.user) {
            res.status(202).send({
                status: 202,
                message: "Login successful",
                data: {
                    id: req.user.id,
                    username: req.user.username,
                    email: req.user.email
                }
            })
        } else {
            res.status(401).send({
                status: 401,
                message: "Invalid credentials"
            })
        }
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
                message: "Invalid data provided",
                data: inputCheck.data
            });
            return;
        }

        let duplicateCheck = await this.checkDuplicates(req.body);
        if (!duplicateCheck.valid) {
            res.status(409).send({
                status: 409,
                message: "An account with that username or email already exists",
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

            router.post("/login", passport.authenticate('local'), this.login);
            router.post("/register", (req, res) => { this.register(req, res); });
            router.get("/logout", (req, res) => { this.logout(req, res); });

            return router;
        })();
    }
}

module.exports = Authentication;