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
-- Table structure for table `ranking_individual_cms`
--

DROP TABLE IF EXISTS `ranking_individual_cms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ranking_individual_cms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `level` varchar(255) DEFAULT NULL,
  `status` tinyint NOT NULL,
  `apply_since` timestamp NOT NULL,
  `min` int DEFAULT NULL,
  `max` int DEFAULT NULL,
  `score` int DEFAULT NULL,
  `activity` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ranking_individual_cms`
--

LOCK TABLES `ranking_individual_cms` WRITE;
/*!40000 ALTER TABLE `ranking_individual_cms` DISABLE KEYS */;
INSERT INTO `ranking_individual_cms` VALUES (1,'Asociado',1,'2022-03-31 00:00:00',0,1999,0,NULL),(2,'Plata',1,'2022-04-01 00:00:00',2000,4999,0,NULL),(3,'Oro',1,'2022-04-01 00:00:00',5000,90000,0,NULL),(4,NULL,1,'2022-03-29 00:00:00',0,0,30,'Consulta'),(5,NULL,1,'2022-03-31 00:00:00',0,0,35,'Consulta viable'),(6,NULL,1,'2022-03-31 00:00:00',0,0,60,'Desembolso'),(7,NULL,1,'2022-03-29 00:00:00',0,0,60,'Recompra');
/*!40000 ALTER TABLE `ranking_individual_cms` ENABLE KEYS */;
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

-- Dump completed on 2022-10-10 11:06:50
