// Load Environment Variables
require("dotenv").config();

// Bring in our dependencies
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const { Client } = require("pg");

// Set up our MongoDB Client
MONGODB_CONNECTION_STRING = process.env.MONGODB_URI;
const MDBClient = new MongoClient(MONGODB_CONNECTION_STRING);

// Set up our PostgreSQL Client
const PGClient = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false },
});
PGClient.connect();

// Set up our Express Application
const app = express();
const port = process.env.PORT || 3000;

// Add our application routes/database queries
app.get("/", async (req, res) => {
  res.send("Hello from DigitalOcean Deploy!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
