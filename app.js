// Modules
const express = require("express");
const path = require("path");
const BodyParser = require('body-parser');
const ConnectBusboy = require('connect-busboy');

// DotEnv
require('dotenv').config();

// App Initialisation
const app = express();
const router = express.Router();
const port = process.env.PORT || 3030;
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

app.use(ConnectBusboy());

// Middleware
const UploadFile = require("./server/routes/FileUpload");
const GetFile = require("./server/routes/FileGet");
const Utilities = require("./server/routes/Utilities");
const Authentication = require("./server/routes/Authentication");

app.use(`${process.env.API_V1}`, new UploadFile().GetRoutes());
app.use(`${process.env.API_V1}`, new GetFile().GetRoutes());
app.use(`${process.env.API_V1}/utilities`, new Utilities().GetRoutes());
app.use(`${process.env.API_V1}/auth`, new Authentication().GetRoutes());

console.log(path.join(__dirname, "dist"));
app.use(express.static(path.join(__dirname, "dist")));

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