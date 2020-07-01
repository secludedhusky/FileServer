// Modules
const express = require("express");
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
const UploadFile = require("./routes/FileUpload");
const GetFile = require("./routes/FileGet");
const Utilities = require("./routes/Utilities");

app.use(`${process.env.API_V1}`, new UploadFile().GetRoutes());
app.use(`${process.env.API_V1}`, new GetFile().GetRoutes());
app.use(`${process.env.API_V1}/utilities`, new Utilities().GetRoutes());
app.use(express.static(process.env.PUBLIC_HTML));

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