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
-- Table structure for table `gral_reports_score`
--

DROP TABLE IF EXISTS `gral_reports_score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gral_reports_score` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quarter` int NOT NULL,
  `quantityOfAssoc` int NOT NULL,
  `quantityOfSilver` int NOT NULL,
  `quantityOfGold` int NOT NULL,
  `averageOfAssoc` float NOT NULL,
  `averageOfSilver` float NOT NULL,
  `averageOfGold` float NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gral_reports_score`
--

LOCK TABLES `gral_reports_score` WRITE;
/*!40000 ALTER TABLE `gral_reports_score` DISABLE KEYS */;
INSERT INTO `gral_reports_score` VALUES (2,3,0,0,0,0,0,0,'2021-12-27 16:18:25','2021-12-27 16:18:25'),(3,1,0,0,0,0,0,0,'2022-03-27 16:18:27','2022-03-27 16:18:27'),(4,2,0,0,0,0,0,0,'2022-05-27 16:18:28','2022-05-27 16:18:28'),(8,2,14,0,0,7,0,0,'2022-08-05 15:23:46','2022-08-05 15:23:46'),(9,2,8,0,0,7.5,0,0,'2022-08-09 01:00:02','2022-08-09 01:00:02'),(10,2,8,0,0,7.5,0,0,'2022-08-16 01:00:01','2022-08-16 01:00:01'),(11,3,0,0,0,4.5,0,0,'2022-09-01 17:17:45','2022-09-01 17:17:45');
/*!40000 ALTER TABLE `gral_reports_score` ENABLE KEYS */;
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

-- Dump completed on 2022-10-10 11:05:23
