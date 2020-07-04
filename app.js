// Modules
const path = require("path");
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require('cors');

// DotEnv
require('dotenv').config();

// Middleware
const UploadFile = require("./server/routes/FileUpload");
const GetFile = require("./server/routes/FileGet");
const Utilities = require("./server/routes/Utilities");
const Authentication = require("./server/routes/Authentication");
const Dashboard = require("./server/routes/Dashboard");

// App Initialisation
const app = express();
const router = express.Router();
const port = process.env.PORT || 3030;

// Static
app.use(express.static(path.join(__dirname, "dist")));

// Modules
app.use(cors());
app.use(busboy());

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Auth/Sessions
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

// Custom Routes
app.use(`${process.env.API_V1}`, new UploadFile().GetRoutes());
app.use(`${process.env.API_V1}`, new GetFile().GetRoutes());
app.use(`${process.env.API_V1}/utilities`, new Utilities().GetRoutes());
app.use(`${process.env.API_V1}/auth`, new Authentication().GetRoutes());
app.use(`${process.env.API_V1}/dashboard`, new Dashboard().GetRoutes());

// Start App
(async function () {
    app.use(router);
    app.listen(port, function () {
        console.log(`Server is listening for connection.`);

        app.get("/", (req, res) => {
            res.send("Hello, world!");
        });

    });
})();