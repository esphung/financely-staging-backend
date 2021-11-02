// require('dotenv').config();
const express = require("express");
const server = express();

const morgan = require("morgan");

// route imports
const public = require("public");

server.use(morgan("dev"));

// routes
server.use("/", public);

module.exports = server;
