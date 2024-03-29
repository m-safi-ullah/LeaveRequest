-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 19, 2024 at 06:35 PM
-- Server version: 10.4.27-MariaDB-cll-lve
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `sociajav_leaverequest`;

-- Switch to the created database
USE `sociajav_leaverequest`;

-- Table structure for table `adminlogin`
CREATE TABLE `adminlogin` (
  `adminID` int(11) NOT NULL,
  `adminEmail` varchar(500) NOT NULL,
  `adminPass` varchar(500) NOT NULL,
  PRIMARY KEY (`adminID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `adminlogin` (`adminID`, `adminEmail`, `adminPass`) VALUES
(1, 'admin', 'admin');

-- Table structure for table `emplogin`
CREATE TABLE `emplogin` (
  `empID` int(11) NOT NULL,
  `empName` varchar(500) NOT NULL,
  `empEmail` varchar(500) NOT NULL,
  `empPass` varchar(500) NOT NULL,
  PRIMARY KEY (`empID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `emprequest`
CREATE TABLE `emprequest` (
  `EmployeeID` varchar(255) NOT NULL,
  `FirstName` varchar(1000) NOT NULL,
  `LastName` varchar(1000) NOT NULL,
  `Email` varchar(1000) NOT NULL,
  `LeaveType` varchar(1000) NOT NULL,
  `FDate` date NOT NULL,
  `LDate` date NOT NULL,
  `LeaveApprover` varchar(1000) NOT NULL,
  `DocumentImg` varchar(1000) NOT NULL,
  `Comments` varchar(1000) NOT NULL,
  `ButtonType` varchar(10) NOT NULL DEFAULT 'Enable',
  `leaveStatus` varchar(100) NOT NULL DEFAULT 'Pending',
  `RequestDate` date NOT NULL DEFAULT current_timestamp(),
  `RequestStatus` varchar(100) NOT NULL,
  PRIMARY KEY (`EmployeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `leaveapprover`
CREATE TABLE `leaveapprover` (
  `approverID` int(11) NOT NULL,
  `approverName` varchar(500) NOT NULL,
  `approverEmail` varchar(500) NOT NULL,
  `approverPass` varchar(500) NOT NULL,
  PRIMARY KEY (`approverID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- AUTO_INCREMENT for dumped tables
ALTER TABLE `adminlogin` MODIFY `adminID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
ALTER TABLE `emplogin` MODIFY `empID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
ALTER TABLE `leaveapprover` MODIFY `approverID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

