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
-- Table structure for table `commissions`
--

DROP TABLE IF EXISTS `commissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `commissionName` varchar(255) NOT NULL,
  `conceptId` int NOT NULL,
  `typeCommissionId` int NOT NULL,
  `ranking` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `levelId` int NOT NULL,
  `calculationBasis` varchar(255) NOT NULL,
  `rule` varchar(255) DEFAULT NULL,
  `ruleValue` varchar(255) DEFAULT NULL,
  `measurmentUnitId` int NOT NULL,
  `measurment_value` int NOT NULL,
  `paymentChronologyId` int NOT NULL,
  `apply_since` date NOT NULL,
  `is_active` tinyint NOT NULL,
  `ruleComputeValue` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commissions`
--

LOCK TABLES `commissions` WRITE;
/*!40000 ALTER TABLE `commissions` DISABLE KEYS */;
INSERT INTO `commissions` VALUES (1,'Consultas',1,1,'Individual','Crédito',4,'Total de consultas de la semana','Mayor o igual a 10','Mayor o igual a',1,250,1,'2010-05-22',1,10),(2,'Colocación semanal 1',2,2,'Individual','Crédito',1,'Cantidad de Desembolsos semanal','Menor que 5','Menor que',2,5,1,'2010-05-22',1,5),(3,'Colocación semanal 2',2,2,'Individual','Crédito',1,'Cantidad de Desembolsos semanal','Mayor o igual a 5','Mayor o igual a',2,6,1,'2010-05-22',1,5),(4,'Colocación semanal 3',2,2,'Individual','Crédito',2,'Cantidad de Desembolsos semanal','Menor que 5','Menor que',2,5,1,'2010-05-22',1,5),(5,'Colocación semanal 4',2,2,'Individual','Crédito',2,'Cantidad de Desembolsos semanal','Mayor o igual a 5','Mayor o igual a',2,6,1,'2010-05-22',1,5),(6,'Colocación semanal 5',2,2,'Individual','Crédito',3,'Cantidad de Desembolsos semanal','Menor que 5','Menor que',2,6,1,'2010-05-22',1,5),(7,'Colocación semanal 6',2,2,'Individual','Crédito',3,'Cantidad de Desembolsos semanal','Mayor o igual a 5','Mayor o igual a',2,7,1,'2010-05-22',1,5),(8,'Recompra Digital 1',3,3,'Individual','Crédito',1,'1er Recompra Digital','','',2,1,1,'2010-05-22',1,0),(9,'Recompra Digital 2',3,3,'Individual','Crédito',2,'1er Recompra Digital','','',2,2,1,'2010-05-22',1,0),(10,'Recompra Digital 3',3,3,'Individual','Crédito',3,'1er Recompra Digital','','',2,3,1,'2010-05-22',1,0),(11,'Bono Mensual',4,4,'Individual','Crédito',4,'Cantidad de Desembolsos mensual','mayor que 6','mayor que',2,1,2,'2010-05-22',1,6),(12,'Caso al Corriente',5,5,'Individual','Crédito',4,'1er Caso al Corriente','','',1,100,1,'2010-05-22',1,0),(13,'Consultas',1,1,'Liderazgo','Crédito',8,'Cantidad de consultas mensual','Consultas','Mayor o igual a',1,300,1,'2010-05-22',1,30),(14,'Pago por Crédito 1',6,3,'Liderazgo','Crédito',5,'Cantidad desembolsos red','Desembolsos','Mayor o igual a',1,100,1,'2010-05-22',1,1),(15,'Pago por Crédito 2',6,3,'Liderazgo','Crédito',7,'Cantidad desembolsos red','Desembolsos','Mayor o igual a',1,225,1,'2010-05-22',1,1),(16,'Pago por Crédito 3',6,3,'Liderazgo','Crédito',6,'Cantidad desembolsos red','Desembolsos','Mayor o igual a',1,275,1,'2010-05-22',1,1),(17,'Meta Cumplida 2',6,4,'Liderazgo','Crédito',7,'Cantidad desembolsos red','Desembolsos','Mayor o igual a',1,100,2,'2010-05-22',1,15),(18,'Meta Cumplida 3',6,4,'Liderazgo','Crédito',6,'Cantidad desembolsos red','Desembolsos','Mayor o igual a',1,100,2,'2020-05-22',1,20);
/*!40000 ALTER TABLE `commissions` ENABLE KEYS */;
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

-- Dump completed on 2022-10-10 11:06:13