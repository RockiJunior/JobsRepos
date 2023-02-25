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
-- Table structure for table `ranking_partners_individual`
--

DROP TABLE IF EXISTS `ranking_partners_individual`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ranking_partners_individual` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rank` varchar(255) NOT NULL,
  `score` int NOT NULL,
  `cuatrim` enum('1','2','3') NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL,
  `partnerId` int DEFAULT NULL,
  `week` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_174fe444570adf3ddfde63a3d14` (`partnerId`),
  CONSTRAINT `FK_174fe444570adf3ddfde63a3d14` FOREIGN KEY (`partnerId`) REFERENCES `partners` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ranking_partners_individual`
--

LOCK TABLES `ranking_partners_individual` WRITE;
/*!40000 ALTER TABLE `ranking_partners_individual` DISABLE KEYS */;
INSERT INTO `ranking_partners_individual` VALUES (48,'Asociado',0,'1','2022-07-27 18:30:14','2022-07-27 18:30:14',39,NULL),(60,'Asociado',0,'1','2022-07-29 14:55:15','2022-07-29 14:55:15',65,NULL),(61,'Asociado',0,'1','2022-07-29 15:15:49','2022-07-29 15:15:49',66,NULL),(62,'Asociado',0,'1','2022-07-29 15:53:45','2022-07-29 15:53:45',67,NULL),(66,'Asociado',0,'1','2022-07-29 19:43:33','2022-07-29 19:43:33',72,NULL),(99,'Asociado',0,'2','2022-08-04 23:47:49','2022-08-04 23:47:49',39,NULL),(100,'Asociado',0,'2','2022-08-04 23:47:49','2022-08-04 23:47:49',65,NULL),(101,'Asociado',0,'2','2022-08-04 23:47:50','2022-08-04 23:47:50',66,NULL),(102,'Asociado',0,'2','2022-08-04 23:47:50','2022-08-04 23:47:50',67,NULL),(103,'Asociado',0,'2','2022-08-04 23:47:51','2022-08-04 23:47:51',68,NULL),(105,'Asociado',0,'2','2022-08-04 23:47:51','2022-08-04 23:47:51',72,NULL),(106,'Asociado',0,'2','2022-08-04 23:47:52','2022-08-04 23:47:52',73,NULL),(107,'Asociado',0,'2','2022-08-08 17:54:04','2022-08-08 17:54:04',73,NULL),(108,'Asociado',0,'3','2022-09-12 17:18:08','2022-09-12 17:18:08',76,NULL),(109,'Asociado',0,'3','2022-09-14 20:20:13','2022-09-14 20:20:13',82,NULL),(110,'Asociado',0,'3','2022-09-14 20:23:43','2022-09-14 20:23:43',81,NULL);
/*!40000 ALTER TABLE `ranking_partners_individual` ENABLE KEYS */;
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

-- Dump completed on 2022-10-10 11:06:41
