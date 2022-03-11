const express = require("express");
const app = express();
const fs = require("fs");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const PORT = 4500;

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

//To link index.html file
app.use(express.static("public"));

// parse application/json
app.use(bodyParser.json());

//create database connection
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "aadhaar",
});

//connect to database
connection.connect(function (err) {
  if (err) throw err;
  console.log("DataBase connected Successfully...");
});

app.use(express.json());

app.post("/register", (req, res) => {
  const newUser = {
    FullName: req.body.FullName,
    Gender: req.body.Gender,
    DateOfBirth: req.body.DateOfBirth,
    Age: req.body.Age,
    PhoneNumber: req.body.PhoneNumber,
    EmailId: req.body.EmailId,
    Password: req.body.Password,
    //Picture: req.body.Picture,
    Address: req.body.Address,
    Pincode: req.body.Pincode,
    State: req.body.State,
    City: req.body.City,
    District: req.body.District,
    AadhaarNumber: req.body.AadhaarNumber,
  };

  let sql = "INSERT INTO aadhaar_users SET ?";
  let query = connection.query(sql, newUser, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify(results));
  });
});

//to get data and show all users
app.get("/register", (req, res) => {
  let sql = "SELECT * FROM aadhaar_users";
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify(results));
  });
});

//show single user
app.get("/register/:AadhaarNumber/:FullName", (req, res) => {
  connection.query(
    "select * from aadhaar_users where AadhaarNumber=? AND FullName=?",
    [req.params.AadhaarNumber, req.params.FullName],
    function (error, results, fields) {
      if (error) throw error;
      res.end(JSON.stringify(results));
    }
  );
});

/** checks for multiple user registration */
app.get("/register/:EmailId", (req, res) => {
  connection.query(
    "select * from aadhaar_users where EmailId=?",
    [req.params.EmailId],
    function (error, results, fields) {
      if (error) throw error;
      res.end(JSON.stringify(results));
    }
  );
});
/** login */
app.get("/login/:EmailId/:Password", (req, res) => {
  connection.query(
    "select * from aadhaar_users where EmailId=? and Password=?",
    [req.params.EmailId, req.params.Password],
    function (error, results, fields) {
      if (error) throw error;
      res.end(JSON.stringify(results));
    }
  );
});
