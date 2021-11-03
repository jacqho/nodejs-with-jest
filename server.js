const express = require("express");
const cors = require("cors");
const config = require('./config.js');
const database = require('./helpers/database');
const homeownerRoutes = require("./routes/homeowner");

const url = config.db.url;
const app = express();
app.use(express.raw({ limit: '1kb' , type: "application/xml" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/homeowner', homeownerRoutes);
database.connectDB(url);

module.exports = app;