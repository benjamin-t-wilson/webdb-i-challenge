const express = require('express');
const apiRouter = require('./routers/apiRouter')

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());
server.use("/api", apiRouter)

module.exports = server;