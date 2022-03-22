CREATE DATABASE AADHAAR;
SHOW DATABASES;
USE AADHAAR;

CREATE TABLE aadhaar_users(
FullName VARCHAR(70),
Gender VARCHAR(30),
DateOfBirth VARCHAR(100),
Age INT,
PhoneNumber BIGINT(10),
EmailId VARCHAR(255),
Password VARCHAR(100),
Picture VARCHAR(10000),
Address VARCHAR(255),
Pincode BIGINT(6),
State VARCHAR(255),
City VARCHAR(255),
District VARCHAR(255),
AadhaarNumber BIGINT(12) NOT NULL PRIMARY KEY
);

DROP TABLE aadhaar_users;

SELECT * FROM aadhaar_users;


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;