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
-- Table structure for table `leadership_commissions`
--

DROP TABLE IF EXISTS `leadership_commissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leadership_commissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `week` int NOT NULL,
  `consultas_commission` float NOT NULL,
  `consultas_quantity` int NOT NULL,
  `credito_1` float NOT NULL,
  `credito_2` float NOT NULL,
  `credito_3` float NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL,
  `partnerId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_86d7ebf259b6fc13541313d2d67` (`partnerId`),
  CONSTRAINT `FK_86d7ebf259b6fc13541313d2d67` FOREIGN KEY (`partnerId`) REFERENCES `partners` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leadership_commissions`
--

LOCK TABLES `leadership_commissions` WRITE;
/*!40000 ALTER TABLE `leadership_commissions` DISABLE KEYS */;
INSERT INTO `leadership_commissions` VALUES (12,30,0,0,0,0,0,'2022-07-26 01:00:06','2022-07-26 01:00:06',39),(13,30,0,0,0,0,0,'2022-07-26 01:00:07','2022-07-26 01:00:07',39),(26,32,0,0,0,0,0,'2022-08-04 23:52:19','2022-08-04 23:52:19',39),(27,32,0,0,0,0,0,'2022-08-04 23:52:19','2022-08-04 23:52:19',65),(28,32,0,0,0,0,0,'2022-08-04 23:52:20','2022-08-04 23:52:20',66),(29,32,0,0,0,0,0,'2022-08-04 23:52:20','2022-08-04 23:52:20',67),(30,32,0,0,0,0,0,'2022-08-04 23:52:20','2022-08-04 23:52:20',68),(32,32,0,0,0,0,0,'2022-08-04 23:52:21','2022-08-04 23:52:21',72),(33,32,0,0,0,0,0,'2022-08-04 23:52:21','2022-08-04 23:52:21',73),(34,32,0,0,0,0,0,'2022-08-09 01:00:01','2022-08-09 01:00:01',39),(35,32,0,0,0,0,0,'2022-08-09 01:00:02','2022-08-09 01:00:02',65),(36,32,0,0,0,0,0,'2022-08-09 01:00:03','2022-08-09 01:00:03',66),(37,32,0,0,0,0,0,'2022-08-09 01:00:03','2022-08-09 01:00:03',67),(38,32,0,0,0,0,0,'2022-08-09 01:00:03','2022-08-09 01:00:03',68),(40,32,0,0,0,0,0,'2022-08-09 01:00:04','2022-08-09 01:00:04',72),(41,32,0,0,0,0,0,'2022-08-09 01:00:04','2022-08-09 01:00:04',73),(42,33,0,0,0,0,0,'2022-08-16 01:00:01','2022-08-16 01:00:01',39),(43,33,0,0,0,0,0,'2022-08-16 01:00:02','2022-08-16 01:00:02',65),(44,33,0,0,0,0,0,'2022-08-16 01:00:02','2022-08-16 01:00:02',66),(45,33,0,0,0,0,0,'2022-08-16 01:00:03','2022-08-16 01:00:03',67),(46,33,0,0,0,0,0,'2022-08-16 01:00:03','2022-08-16 01:00:03',68),(48,33,0,0,0,0,0,'2022-08-16 01:00:04','2022-08-16 01:00:04',72),(49,33,0,0,0,0,0,'2022-08-16 01:00:04','2022-08-16 01:00:04',73),(50,36,0,0,0,0,0,'2022-09-06 01:00:02','2022-09-06 01:00:02',39),(51,36,0,0,0,0,0,'2022-09-06 01:00:02','2022-09-06 01:00:02',65),(52,36,0,0,0,0,0,'2022-09-06 01:00:02','2022-09-06 01:00:02',66),(53,36,0,0,0,0,0,'2022-09-06 01:00:04','2022-09-06 01:00:04',67),(55,36,0,0,0,0,0,'2022-09-06 01:00:05','2022-09-06 01:00:05',73),(56,37,0,0,0,0,0,'2022-09-13 01:00:02','2022-09-13 01:00:02',39),(57,37,0,0,0,0,0,'2022-09-13 01:00:03','2022-09-13 01:00:03',65),(58,37,0,0,0,0,0,'2022-09-13 01:00:03','2022-09-13 01:00:03',66),(59,37,0,0,0,0,0,'2022-09-13 01:00:03','2022-09-13 01:00:03',67),(60,37,0,0,0,0,0,'2022-09-13 01:00:04','2022-09-13 01:00:04',73),(61,37,0,0,0,0,0,'2022-09-13 01:00:04','2022-09-13 01:00:04',76);
/*!40000 ALTER TABLE `leadership_commissions` ENABLE KEYS */;
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

-- Dump completed on 2022-10-10 11:07:40
