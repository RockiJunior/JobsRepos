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
-- Table structure for table `individual_commissions`
--

DROP TABLE IF EXISTS `individual_commissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `individual_commissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `week` int NOT NULL,
  `amount_desembolsos_first` float DEFAULT NULL,
  `quantity_desembolsos_first` int NOT NULL,
  `commission_desembolsos_first` float NOT NULL,
  `fee_first_stretch` float NOT NULL,
  `amount_desembolsos_second` float DEFAULT NULL,
  `quantity_desembolsos_second` int NOT NULL,
  `commission_desembolsos_second` float NOT NULL,
  `fee_second_stretch` float NOT NULL,
  `quantity_consultas` int NOT NULL,
  `minimum_consultas` int NOT NULL,
  `commission_consultas` float NOT NULL,
  `fee_consultas` float NOT NULL,
  `amount_recompras` float NOT NULL,
  `commission_recompras` float NOT NULL,
  `fee_recompras` float NOT NULL,
  `commission_casos_al_corriente` float NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL,
  `partnerId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_48b9827f8d23009e09697d49e44` (`partnerId`),
  CONSTRAINT `FK_48b9827f8d23009e09697d49e44` FOREIGN KEY (`partnerId`) REFERENCES `partners` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `individual_commissions`
--

LOCK TABLES `individual_commissions` WRITE;
/*!40000 ALTER TABLE `individual_commissions` DISABLE KEYS */;
INSERT INTO `individual_commissions` VALUES (1,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-04 23:51:22','2022-08-04 23:51:22',39),(2,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-04 23:51:23','2022-08-04 23:51:23',65),(3,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-04 23:51:23','2022-08-04 23:51:23',66),(4,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-04 23:51:24','2022-08-04 23:51:24',67),(5,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-04 23:51:24','2022-08-04 23:51:24',68),(7,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-04 23:51:25','2022-08-04 23:51:25',72),(8,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-04 23:51:25','2022-08-04 23:51:25',73),(9,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-09 01:00:02','2022-08-09 01:00:02',39),(10,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-09 01:00:03','2022-08-09 01:00:03',65),(11,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-09 01:00:03','2022-08-09 01:00:03',66),(12,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-09 01:00:03','2022-08-09 01:00:03',67),(13,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-09 01:00:04','2022-08-09 01:00:04',68),(15,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-09 01:00:05','2022-08-09 01:00:05',72),(16,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-09 01:00:05','2022-08-09 01:00:05',73),(17,33,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-08-16 01:00:01','2022-08-16 01:00:01',39),(18,35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-09-06 01:00:02','2022-09-06 01:00:02',39),(19,35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-09-06 01:00:02','2022-09-06 01:00:02',65),(20,35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-09-06 01:00:03','2022-09-06 01:00:03',66),(21,35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-09-06 01:00:04','2022-09-06 01:00:04',67),(23,35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-09-06 01:00:05','2022-09-06 01:00:05',73),(24,36,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2022-09-13 01:00:01','2022-09-13 01:00:01',39);
/*!40000 ALTER TABLE `individual_commissions` ENABLE KEYS */;
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

-- Dump completed on 2022-10-10 11:05:55
