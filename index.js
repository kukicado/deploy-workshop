// Load Environment Variables
require("dotenv").config();

// Bring in our dependencies
const express = require("express");
const { ObjectId } = require("mongodb");
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

app.get("/mdb-customers", async (req, res) => {
  try {
    const data = await MDBClient.db("deploy-store")
      .collection("customers")
      .findOne({ _id: new ObjectId("63752e251ecd2d5859ab36dc") });
    res.json(data);
  } catch (e) {
    res.json(e);
  }
});

app.get("/mdb-add-customer", async (req, res) => {
  try {
    const result = await MDBClient.db("deploy-store")
      .collection("customers")
      .insertOne({ fullName: "Akhil", job: "Being awesome moderator" });
    res.json(result);
  } catch (e) {
    res.json(e);
  }
});

app.get("/mdb-aggregation", async (req, res) => {
  try {
    const data = await MDBClient.db("deploy-store")
      .collection("orders")
      .aggregate([
        {
          $group: {
            _id: "$customer.fullName",
            totalOrders: {
              $count: {},
            },
            totalItemsPurchased: {
              $sum: {
                $size: "$items",
              },
            },
            totalSpend: {
              $sum: "$total",
            },
          },
        },
        {
          $limit: 10,
        },
      ])
      .toArray();

    res.json(data);
  } catch (e) {
    res.json(e);
  }
});

app.get("/pg-customers", async (req, res) => {
  try {
    const data = await PGClient.query(
      "SELECT * FROM customers WHERE full_name = 'Aaishika'"
    );
    res.json(data.rows);
  } catch (e) {
    res.json(e);
  }
});

app.get("/pg-add-customer", async (req, res) => {
  try {
    const result = await PGClient.query(
      "INSERT INTO customers (id, full_name) VALUES ('12345', 'Aaishika')"
    );
    res.json(result);
  } catch (e) {
    res.json(e);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
