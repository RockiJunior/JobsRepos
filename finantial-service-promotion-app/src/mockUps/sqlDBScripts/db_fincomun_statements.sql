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
-- Table structure for table `statements`
--

DROP TABLE IF EXISTS `statements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statements` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `createDate` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `pdfUrl` varchar(255) DEFAULT NULL,
  `videoUrl` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL,
  `validityDate` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statements`
--

LOCK TABLES `statements` WRITE;
/*!40000 ALTER TABLE `statements` DISABLE KEYS */;
INSERT INTO `statements` VALUES ('0bfe4467-2e5d-4b91-bb36-bebcd5699a7c','comunicado3','Inactivo','2022/08/24','Hola','texto',NULL,NULL,NULL,NULL,'2022-08-24 18:43:03','2022-08-24 18:43:03','2022-08-26 05:00:00'),('17b74cd0-d0be-4615-ad87-670a53344c10','Comunicado Julio','Activo','2022/07/27','Bienvenido','Bienvenido al programa',NULL,NULL,NULL,NULL,'2022-07-27 16:04:10','2022-07-27 16:04:10','2022-10-31 06:00:00'),('6ad015e5-6519-47bd-9490-55a9c6289d3f','Comunicado 1','Activo','2022/05/26','Comunicado 1','texto de comunicado','null',NULL,NULL,NULL,'2022-05-27 01:10:28','2022-08-24 18:43:38','2022-11-30 06:00:00'),('745c44ca-9546-4ab2-856d-4ebb1eea0b6f','test vigencia','Inactivo','2022/05/31','comunicado de prueba','mensaje de prueba','url','www.google.com',NULL,NULL,'2022-05-31 17:58:28','2022-05-31 18:05:24','2022-06-05 05:00:00'),('d8b88200-4d67-4c93-8f43-3d984cad4b93','prueba 2 vigencia','Inactivo','2022/05/31','prueba 2','mensaje de rueba 2','url','www.google.com',NULL,NULL,'2022-05-31 18:03:07','2022-05-31 18:03:31','2022-06-05 05:00:00'),('f21f6cd1-85f9-4d24-a833-6f92b6924e4c','Comunicado 2','Inactivo','2022/08/24','Comunicado 2.','Texto',NULL,NULL,NULL,NULL,'2022-08-23 18:16:33','2022-08-23 18:16:33','2022-08-25 05:00:00');
/*!40000 ALTER TABLE `statements` ENABLE KEYS */;
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

-- Dump completed on 2022-10-10 11:06:36
