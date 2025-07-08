const express = require("express");
const routes = express.Router();
const sessionControllers = require("./session");
const sessionMiddlewares = require("./MiddleWares/session");

//Define a middlewares by routes
routes.use('/',sessionMiddlewares.tokenValidation)

//Define routes
routes.get("/", sessionControllers.tokenValidation);

module.exports = routes;
