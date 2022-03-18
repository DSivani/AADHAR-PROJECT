/** Importing Express module */
const express = require("express");
/** Creating a server object */
const app = express();
/** Importing fs module and creating fs object*/
const fs = require("fs");
/** Importing mysql module and creating mysql object */
const mysql = require("mysql");
/** Importing body-parser module */
const bodyParser = require("body-parser");
/** Creating a PORT */
const PORT = 5000;

/** The server object app listens on port 5000 */
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
/** To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in
middleware function in Express.*/
//To link index.html file
app.use(express.static("public"));

// parse application/json
app.use(bodyParser.json());

/***************SQL CONNECTION**********************/

/** To Create database connection */
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "aadhaar",
});

/**
 * To Connect to database
 * @param {method} function
 */
connection.connect(function (err) {
  if (err) throw err;
  console.log("DataBase connected Successfully...");
});

/** The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads */
app.use(express.json());

/**
 * To send register users data into aadhaar_users table into MYSQL database using POST method
 * @param {string} "/register" - RestAPI call
 * @param {Method} function
 */
app.post("/register", (req, res) => {
  const newUser = {
    FullName: req.body.FullName,
    Gender: req.body.Gender,
    DateOfBirth: req.body.DateOfBirth,
    Age: req.body.Age,
    PhoneNumber: req.body.PhoneNumber,
    EmailId: req.body.EmailId,
    Password: req.body.Password,
    Picture: req.body.Picture,
    Address: req.body.Address,
    Pincode: req.body.Pincode,
    State: req.body.State,
    City: req.body.City,
    District: req.body.District,
    AadhaarNumber: req.body.AadhaarNumber,
  };

  //Insert query to insert new aadhaar_users data into table
  let sql = "INSERT INTO aadhaar_users SET ?";
  let query = connection.query(sql, newUser, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify(results));
  });
});

/**
 * To get all user details  using GET method
 * @param {string} "/register" - RestAPI call
 * @param {method} ArrowFunction
 */
app.get("/register", (req, res) => {
  /** SQL query to select all user details */
  let sql = "SELECT * FROM aadhaar_users";
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify(results));
  });
});

/**
 * To get user parent details if age less than 18  by using parent registered aadhaar number and name using GET method
 * @param {string} "/register/:AadhaarNumber/:FullName" - RestAPI call
 * @param {method} ArrowFunction
 */
app.get("/register/:AadhaarNumber/:FullName", (req, res) => {
  //SQL query to select parent details using aadhaar number and name
  connection.query(
    "select * from aadhaar_users where AadhaarNumber=? AND FullName=?",
    [req.params.AadhaarNumber, req.params.FullName],
    function (error, results, fields) {
      if (error) throw error;
      res.end(JSON.stringify(results));
    }
  );
});

/**
 * To get user email id and checks if email id is present or not using GET method
 * @param {string} "/register/:EmailId" - RestAPI call
 * @param {method} ArrowFunction
 */
/** checks for multiple user registration */
app.get("/register/:EmailId", (req, res) => {
  /** SQL query to select users details using emailId */
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
/**
 * To get user email id  and password using GET method
 * @param {string} "/login/:EmailId/:Password" - RestAPI call
 * @param {method} ArrowFunction
 */
app.get("/login/:EmailId/:Password", (req, res) => {
  /** SQL query to select users details using emailId and password for login */
  connection.query(
    "select * from aadhaar_users where EmailId=? and Password=?",
    [req.params.EmailId, req.params.Password],
    function (error, results, fields) {
      if (error) throw error;
      res.end(JSON.stringify(results));
    }
  );
});
