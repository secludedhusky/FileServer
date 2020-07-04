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

// passport.use(new LocalStrategy(
//     async (username, password, done) => {
//         let password = 
//         await database.select("id, user_name, user_permissions")
//             .then((data) => {
//                 if(data.length > 0 && data.user_name === username) {

//                 }
//             })
//             .catch((error) => {
//                 done(error, false, {
//                     status: 500,
//                     message: "Unable to connect to database."
//                 });
//             });


//         database.select({ username: username }, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) {
//                 return done(null, false, { message: 'Incorrect username.' });
//             }
//             if (!user.validPassword(password)) {
//                 return done(null, false, { message: 'Incorrect password.' });
//             }
//             return done(null, user);
//         });
//     }
// ));


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

        let check = await database.select("user_name, user_email", process.env.USER_TABLE_V1, [
            { user_name: req.body.username },
            { user_email: req.body.email }
        ]);

        if (check.length > 0) {
            let conflicts = [];
            if (check[0].user_name === req.body.username) {
                conflicts.push("user_name");
            }
            if (check[0].user_email === req.body.email) {
                conflicts.push("user_email");
            }

            res.status(409).send({
                status: 409,
                message: "An account with that username or email already exists.",
                conflicts: conflicts
            });
        } else {
            database.insert(process.env.USER_TABLE_V1, {
                user_name: req.body.username,
                user_pass: req.body.password,
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
                        status: status,
                        message: "Internal server error"
                    });
                });
        }
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