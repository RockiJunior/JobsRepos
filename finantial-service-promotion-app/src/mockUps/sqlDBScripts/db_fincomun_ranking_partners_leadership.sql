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
-- Table structure for table `ranking_partners_leadership`
--

DROP TABLE IF EXISTS `ranking_partners_leadership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ranking_partners_leadership` (
  `id` int NOT NULL AUTO_INCREMENT,
  `period` enum('1','2','3','4','5','6') NOT NULL,
  `level` enum('No posee ranking','Futuro Líder','Líder Bronce','Líder Plata') NOT NULL,
  `bonusGoal` int NOT NULL DEFAULT '0',
  `monthlyBonus` int NOT NULL DEFAULT '0',
  `networkProd` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL,
  `partnerId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_f7b41955400785140cb86982e39` (`partnerId`),
  CONSTRAINT `FK_f7b41955400785140cb86982e39` FOREIGN KEY (`partnerId`) REFERENCES `partners` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ranking_partners_leadership`
--

LOCK TABLES `ranking_partners_leadership` WRITE;
/*!40000 ALTER TABLE `ranking_partners_leadership` DISABLE KEYS */;
INSERT INTO `ranking_partners_leadership` VALUES (73,'3','No posee ranking',0,0,0,'2022-08-04 23:50:06','2022-08-04 23:50:06',39),(74,'3','No posee ranking',0,0,0,'2022-08-04 23:50:06','2022-08-04 23:50:06',65),(75,'3','No posee ranking',0,0,0,'2022-08-04 23:50:07','2022-08-04 23:50:07',66),(76,'3','No posee ranking',0,0,0,'2022-08-04 23:50:07','2022-08-04 23:50:07',67),(77,'3','No posee ranking',0,0,0,'2022-08-04 23:50:07','2022-08-04 23:50:07',68),(79,'3','No posee ranking',0,0,0,'2022-08-04 23:50:08','2022-08-04 23:50:08',72),(80,'3','No posee ranking',0,0,0,'2022-08-04 23:50:08','2022-08-04 23:50:08',73),(81,'4','No posee ranking',0,0,0,'2022-08-04 23:50:53','2022-08-04 23:50:53',39),(82,'4','No posee ranking',0,0,0,'2022-08-04 23:50:53','2022-08-04 23:50:53',65),(83,'4','No posee ranking',0,0,0,'2022-08-04 23:50:54','2022-08-04 23:50:54',66),(84,'4','No posee ranking',0,0,0,'2022-08-04 23:50:54','2022-08-04 23:50:54',67),(85,'4','No posee ranking',0,0,0,'2022-08-04 23:50:55','2022-08-04 23:50:55',68),(87,'4','No posee ranking',0,0,0,'2022-08-04 23:50:55','2022-08-04 23:50:55',72),(88,'4','No posee ranking',0,0,0,'2022-08-04 23:50:56','2022-08-04 23:50:56',73),(89,'1','No posee ranking',0,0,0,'2022-08-19 16:26:09','2022-08-19 16:26:09',39),(90,'1','No posee ranking',0,0,0,'2022-08-19 16:26:09','2022-08-19 16:26:09',65),(91,'1','No posee ranking',0,0,0,'2022-08-19 16:26:10','2022-08-19 16:26:10',66),(92,'1','No posee ranking',0,0,0,'2022-08-19 16:26:10','2022-08-19 16:26:10',67),(93,'1','No posee ranking',0,0,0,'2022-08-19 16:26:10','2022-08-19 16:26:10',68),(95,'1','No posee ranking',0,0,0,'2022-08-19 16:26:11','2022-08-19 16:26:11',72),(96,'1','No posee ranking',0,0,0,'2022-08-19 16:26:12','2022-08-19 16:26:12',73);
/*!40000 ALTER TABLE `ranking_partners_leadership` ENABLE KEYS */;
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

-- Dump completed on 2022-10-10 11:06:00
