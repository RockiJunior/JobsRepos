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
-- Table structure for table `monthly_goal`
--

DROP TABLE IF EXISTS `monthly_goal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monthly_goal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `month` int NOT NULL,
  `meta_2` float NOT NULL,
  `meta_3` float NOT NULL,
  `goal` int NOT NULL,
  `desembolsos_red` int NOT NULL,
  `fee` float NOT NULL,
  `earnings` float NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL,
  `partnerId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_eba184e955031fb302310ae6c1d` (`partnerId`),
  CONSTRAINT `FK_eba184e955031fb302310ae6c1d` FOREIGN KEY (`partnerId`) REFERENCES `partners` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monthly_goal`
--

LOCK TABLES `monthly_goal` WRITE;
/*!40000 ALTER TABLE `monthly_goal` DISABLE KEYS */;
INSERT INTO `monthly_goal` VALUES (1,7,0,0,0,0,100,0,'2022-08-04 23:53:12','2022-08-04 23:53:12',39),(2,7,0,0,0,0,100,0,'2022-08-04 23:53:13','2022-08-04 23:53:13',65),(3,7,0,0,0,0,100,0,'2022-08-04 23:53:13','2022-08-04 23:53:13',66),(4,7,0,0,0,0,100,0,'2022-08-04 23:53:14','2022-08-04 23:53:14',67),(5,7,0,0,0,0,100,0,'2022-08-04 23:53:14','2022-08-04 23:53:14',68),(7,7,0,0,0,0,100,0,'2022-08-04 23:53:15','2022-08-04 23:53:15',72),(8,7,0,0,0,0,100,0,'2022-08-04 23:53:16','2022-08-04 23:53:16',73),(9,7,0,0,0,0,100,0,'2022-08-09 01:00:02','2022-08-09 01:00:02',39),(10,7,0,0,0,0,100,0,'2022-08-09 01:00:03','2022-08-09 01:00:03',65),(11,7,0,0,0,0,100,0,'2022-08-09 01:00:03','2022-08-09 01:00:03',66),(12,7,0,0,0,0,100,0,'2022-08-09 01:00:04','2022-08-09 01:00:04',67),(13,7,0,0,0,0,100,0,'2022-08-09 01:00:04','2022-08-09 01:00:04',68),(15,7,0,0,0,0,100,0,'2022-08-09 01:00:05','2022-08-09 01:00:05',72),(16,7,0,0,0,0,100,0,'2022-08-09 01:00:06','2022-08-09 01:00:06',73),(17,7,0,0,0,0,100,0,'2022-08-16 01:00:01','2022-08-16 01:00:01',39),(18,7,0,0,0,0,100,0,'2022-08-16 01:00:03','2022-08-16 01:00:03',65),(19,7,0,0,0,0,100,0,'2022-08-16 01:00:03','2022-08-16 01:00:03',66),(20,7,0,0,0,0,100,0,'2022-08-16 01:00:04','2022-08-16 01:00:04',67),(21,7,0,0,0,0,100,0,'2022-08-16 01:00:04','2022-08-16 01:00:04',68),(23,7,0,0,0,0,100,0,'2022-08-16 01:00:06','2022-08-16 01:00:06',72),(24,7,0,0,0,0,100,0,'2022-08-16 01:00:06','2022-08-16 01:00:06',73),(25,8,0,0,0,0,100,0,'2022-09-06 01:00:02','2022-09-06 01:00:02',39),(26,8,0,0,0,0,100,0,'2022-09-06 01:00:03','2022-09-06 01:00:03',65),(27,8,0,0,0,0,100,0,'2022-09-06 01:00:04','2022-09-06 01:00:04',66),(28,8,0,0,0,0,100,0,'2022-09-06 01:00:05','2022-09-06 01:00:05',67),(29,8,0,0,0,0,100,0,'2022-09-06 01:00:05','2022-09-06 01:00:05',68),(31,8,0,0,0,0,100,0,'2022-09-06 01:00:06','2022-09-06 01:00:06',72),(32,8,0,0,0,0,100,0,'2022-09-06 01:00:07','2022-09-06 01:00:07',73),(33,8,0,0,0,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',74),(34,8,0,0,0,0,100,0,'2022-09-13 01:00:02','2022-09-13 01:00:02',39),(35,8,0,0,0,0,100,0,'2022-09-13 01:00:03','2022-09-13 01:00:03',65),(36,8,0,0,0,0,100,0,'2022-09-13 01:00:03','2022-09-13 01:00:03',66),(37,8,0,0,0,0,100,0,'2022-09-13 01:00:04','2022-09-13 01:00:04',67),(38,8,0,0,0,0,100,0,'2022-09-13 01:00:04','2022-09-13 01:00:04',68),(39,8,0,0,0,0,100,0,'2022-09-13 01:00:05','2022-09-13 01:00:05',72),(40,8,0,0,0,0,100,0,'2022-09-13 01:00:05','2022-09-13 01:00:05',73),(41,8,0,0,0,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',74),(42,8,0,0,0,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',75),(43,8,0,0,0,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',76);
/*!40000 ALTER TABLE `monthly_goal` ENABLE KEYS */;
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

-- Dump completed on 2022-10-10 11:06:32