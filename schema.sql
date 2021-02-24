DROP DATABASE IF EXISTS employee_db;
CREATE database employee_db;

USE employee_db;

CREATE TABLE tblDepartment (
    depID INT auto_increment PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE tblRole (
roleID INT auto_increment PRIMARY KEY,
title VARCHAR(30),
salary DECIMAL, 
departmentID INT,
FOREIGN KEY  (departmentID) REFERENCES tblDepartment (depID)
);

CREATE TABLE tblEmployee(
empID INT auto_increment PRIMARY KEY,
firstName VARCHAR(30),
lastName VARCHAR(30),
roleID INT,
managerID INT,
FOREIGN KEY (roleID) REFERENCES tblRole (roleID),
FOREIGN KEY (managerID) REFERENCES tblEmployee (empID)
);