-- MySQL dump 10.13  Distrib 8.0.30, for Linux (x86_64)
--
-- Host: fincomun-development.c8sfqdd7grks.us-east-1.rds.amazonaws.com    Database: db_fincomun
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `ranking`
--

DROP TABLE IF EXISTS `ranking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ranking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `position` int NOT NULL,
  `type` enum('weekly','monthly','bimonthly') NOT NULL,
  `period` enum('1','2','3','4','5','6') NOT NULL,
  `createdAt` timestamp NOT NULL,
  `partnerId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_8daebe907e9a782a3018966fa14` (`partnerId`),
  CONSTRAINT `FK_8daebe907e9a782a3018966fa14` FOREIGN KEY (`partnerId`) REFERENCES `partners` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ranking`
--

LOCK TABLES `ranking` WRITE;
/*!40000 ALTER TABLE `ranking` DISABLE KEYS */;
INSERT INTO `ranking` VALUES (2,2,'weekly','4','2022-08-17 14:11:56',72),(3,3,'weekly','4','2022-08-17 14:11:56',65),(4,4,'weekly','4','2022-08-17 14:11:56',39),(5,5,'weekly','4','2022-08-17 14:11:57',66),(6,6,'weekly','4','2022-08-17 14:11:57',67),(7,7,'weekly','4','2022-08-17 14:11:57',68),(8,8,'weekly','4','2022-08-17 14:11:57',73),(9,1,'monthly','4','2022-08-17 14:12:13',72),(11,3,'monthly','4','2022-08-17 14:12:14',65),(12,4,'monthly','4','2022-08-17 14:12:14',39),(13,5,'monthly','4','2022-08-17 14:12:14',66),(14,6,'monthly','4','2022-08-17 14:12:14',67),(15,7,'monthly','4','2022-08-17 14:12:14',68),(16,8,'monthly','4','2022-08-17 14:12:15',73),(17,1,'bimonthly','4','2022-08-17 14:12:22',72),(19,3,'bimonthly','4','2022-08-17 14:12:23',65),(20,4,'bimonthly','4','2022-08-17 14:12:23',39),(21,5,'bimonthly','4','2022-08-17 14:12:23',66),(22,6,'bimonthly','4','2022-08-17 14:12:23',67),(23,7,'bimonthly','4','2022-08-17 14:12:23',68),(24,8,'bimonthly','4','2022-08-17 14:12:24',73);
/*!40000 ALTER TABLE `ranking` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-10 11:05:19
