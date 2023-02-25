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
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `validityPassword` bigint NOT NULL,
  `lasts_passwords` text NOT NULL,
  `verified` tinyint NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `motherLastName` varchar(255) DEFAULT NULL,
  `birthDate` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `birthPlace` varchar(255) DEFAULT NULL,
  `age` varchar(255) DEFAULT NULL,
  `rfc` varchar(255) DEFAULT NULL,
  `curp` varchar(255) DEFAULT NULL,
  `civilStatus` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `mobileNumber` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `externalNumber` varchar(255) DEFAULT NULL,
  `internalNumber` varchar(255) DEFAULT NULL,
  `colony` varchar(255) DEFAULT NULL,
  `municipality` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zipcode` varchar(255) DEFAULT NULL,
  `status` enum('0','1','2','3','4','5','6','7','8','9') NOT NULL DEFAULT '1',
  `preAffiliationId` varchar(50) DEFAULT NULL,
  `folio` varchar(50) DEFAULT NULL,
  `alphanumeric` varchar(50) DEFAULT NULL,
  `dischargeDate` datetime DEFAULT NULL,
  `rejectedReason` varchar(255) DEFAULT NULL,
  `rejectedDate` datetime DEFAULT NULL,
  `week` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL,
  `bankAccountId` int DEFAULT NULL,
  `territoryId` int DEFAULT NULL,
  `disableDate` datetime DEFAULT NULL,
  `disableReason` varchar(255) DEFAULT NULL,
  `disabledWrittenReason` varchar(255) DEFAULT NULL,
  `removalDate` datetime DEFAULT NULL,
  `mailsSent` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_6b39bc13ab676e74eada2e744d` (`email`),
  UNIQUE KEY `REL_109d3659d056abf3078700fcc1` (`bankAccountId`),
  KEY `FK_62a5fa1ec0695a111c1a99e2d18` (`territoryId`),
  CONSTRAINT `FK_109d3659d056abf3078700fcc16` FOREIGN KEY (`bankAccountId`) REFERENCES `bank_account` (`id`),
  CONSTRAINT `FK_62a5fa1ec0695a111c1a99e2d18` FOREIGN KEY (`territoryId`) REFERENCES `territories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partners`
--

LOCK TABLES `partners` WRITE;
/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
INSERT INTO `partners` VALUES (39,'alejandro.vargas@gigigo.com','$2b$10$KCMyxkr3d/Ha4JJ7f7elpOpGY8P7SCfv1sxnKwY8jTKbQP1PiubYq',1663516082613,'$2b$10$KCMyxkr3d/Ha4JJ7f7elpOpGY8P7SCfv1sxnKwY8jTKbQP1PiubYq',1,'Alejandro','Vargas','Chávez','12/09/1986','Mexicana','Ciudad de México','35','VAXAHEIRBFJDI','VAXAJEKENELDODBDNS','Divorciado','Masculino','5511111111','340 Avenida Horacio','34','4','Polanco','Miguel Hidalgo','Ciudad de México','11560','6','PRE-00039','A100114','DXBB8O','2022-07-27 18:30:14','Este usuario ya ha sido activado por el sistema',NULL,30,'2022-07-20 15:48:03','2022-07-20 15:49:25',45,136,NULL,NULL,NULL,NULL,0),(65,'santiago.marcelino@gigigo.com','$2b$10$9mBOlxHzZWnLS8FJlU.JHebL7s34S8h2piQDv4I2J1p0CZbGfBeVS',1664289115863,'$2b$10$8KgEydVELpba.0EC6Vkv4O/8.gNflucAqC01rFmOdJwT86Zh0NFS6,$2b$10$tpf8FYvZE4b1gubAqU/iaeV35XWOYd1WJPX4AkS42n5gZyc7TkumG,$2b$10$8r204cBb6SXERMpm7Xx14uqqCjfgRlp9KM8eXWpK79mNiSAHvAE1u,$2b$10$Abb68x3hXgO3VBGoOKiBqeFuRjwht45XxMFj91tZHuOEOsb6WmRn6,$2b$10$9mBOlxHzZWnLS8FJlU.JHebL7s34S8h2piQDv4I2J1p0CZbGfBeVS',1,'Santiago','Marcelino','Flores','29/07/1987','Mexicana','Puebla','35','JHGHHBBJJKKKK','MARFFGGHHHKKKKKKKK','Soltero','Masculino','5512345678','Centauro','125','7','Prado Churubusco','Coyoacan','Ciudad De México','04230','6','PRE-00065','A100140','TD81AM','2022-07-29 14:55:15','Este usuario ya ha sido activado por el sistema',NULL,30,'2022-07-29 14:31:56','2022-08-02 14:54:30',65,132,NULL,NULL,NULL,NULL,1),(66,'juan.oropeza@yopmail.com','$2b$10$FVNOXCi4SJQ1LZVkzeRmreNbW8SDv5JZXfHVk7bTsJM3mg.OYYQXi',1664291202492,'$2b$10$FVNOXCi4SJQ1LZVkzeRmreNbW8SDv5JZXfHVk7bTsJM3mg.OYYQXi',1,'Juan','Oropeza','Ortiz','29/07/2004','Mexicana','Ciudad de México','18','OEQE12456754A','OEQE123488HDFRRD11','Unión libre','Masculino','5545332145','Horacio','340','mz ofna 2','Chapultepec Morales','Miguel Hidalgo','Ciudad De México','11570','6','PRE-00066','A100141','WQJ637','2022-07-29 15:15:49','Este usuario ya ha sido activado por el sistema',NULL,30,'2022-07-29 15:06:43','2022-07-29 15:09:57',66,136,NULL,NULL,NULL,NULL,1),(67,'david.ortiz@yopmail.com','$2b$10$HZ0nVcHk8nargZn.Np7XVOpOziXWkEvfJtexjxNq1GMyYReS3p1qS',1664293420653,'$2b$10$HZ0nVcHk8nargZn.Np7XVOpOziXWkEvfJtexjxNq1GMyYReS3p1qS',1,'David','Ortiz','López','09/07/1982','Mexicana','Ciudad de México','40','OEQE163637838','OEQE12873833838392','Casado','Masculino','5545332145','Horacio','340','mz oficina 2','Chapultepec Morales','Miguel Hidalgo','Ciudad De México','11570','6','PRE-00067','A100142','2VZ19V','2022-07-29 15:53:45','Este usuario ya ha sido activado por el sistema',NULL,30,'2022-07-29 15:43:41','2022-07-29 15:47:03',67,136,NULL,NULL,NULL,NULL,1),(68,'karen.alvarado@gigigo.com','$2b$10$MCNN1d4BnXihC39WD5PNTOkbHZUvJbRzqk8UN6of7HtDXvAL6Fl8m',1664294636933,'$2b$10$yojeWtHUXjODkQ.34tS8YeNx1J5EsmQ7EbQ2y2PhmlqADZZ1iXYXW,$2b$10$rUmz7IdMalvqvg0BaqwvVei6l0j9pPbrdUSLfqnPHB14SOjQ5TyC.,$2b$10$sqGCXOur6aBLE1jos1LN9ObQA9eX8uXY86wV8xlndeYSI/u9immiO,$2b$10$MCNN1d4BnXihC39WD5PNTOkbHZUvJbRzqk8UN6of7HtDXvAL6Fl8m',1,'Karen','Alvarado','Martínez','01/07/1987','Mexicana','Ciudad de México','35','AAMK890430R84','AAMK890430MDFLRR07','Casado','Femenino','5525071672','Horacio','340','','Chapultepec Morales','Miguel Hidalgo','Ciudad de México','03560','9','PRE-00068',NULL,'R5ODAW','2022-07-29 16:16:10','Este usuario ya ha sido activado por el sistema',NULL,30,'2022-07-29 16:03:57','2022-07-29 17:00:56',68,136,'2022-07-29 17:04:00','Tuve una mala experiencia con la app','tdofhrc\n','2022-09-06 01:00:02',1),(72,'karen.alvarado+1@gigigo.com','$2b$10$W/C4fCb2IRjloBOQzDv0QuwcxO2uef2R1yPRV2slD82W/b33rgDpy',1664306959718,'$2b$10$W/C4fCb2IRjloBOQzDv0QuwcxO2uef2R1yPRV2slD82W/b33rgDpy',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'7','PRE-00072','A100147','IFWYIO',NULL,NULL,'2022-09-02 01:00:03',30,'2022-07-29 19:29:20','2022-09-02 01:00:03',NULL,NULL,NULL,NULL,NULL,NULL,1),(73,'karen.alvarado+2@gigigo.com','$2b$10$aBySjk/BkHEDWu4HsjKTT.5FxkI9nBp6SuJGiGjvOOvJHojq0ZDhW',1664646976386,'$2b$10$aBySjk/BkHEDWu4HsjKTT.5FxkI9nBp6SuJGiGjvOOvJHojq0ZDhW',1,'karen','alvarado','martinez','14/08/1991','Mexicana','Ciudad de México','30','AAMK890430R84','AAMK890430MDFLRR07','Casado','Femenino','5525071672','Monserrat','10','','Bellavista Puente de vigas','Tlalnepantla de Baz','Estado de México','54080','6','PRE-00073','A100148','X4M715','2022-08-08 17:54:03','Este usuario ya ha sido activado por el sistema',NULL,32,'2022-08-02 17:56:17','2022-08-02 17:57:23',72,28,NULL,NULL,NULL,NULL,1),(74,'karen.alvarado+3@gigigo.com','$2b$10$lAuMzPBKaIyJrOkPL.ZoT.tIwuGhJgYT/4KxBHCPmMxvfI5lTYEiS',1667067099088,'$2b$10$lAuMzPBKaIyJrOkPL.ZoT.tIwuGhJgYT/4KxBHCPmMxvfI5lTYEiS',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'7','PRE-00074','A100149','282FMA',NULL,NULL,'2022-09-08 01:00:04',NULL,'2022-08-30 18:11:39','2022-09-08 01:00:04',NULL,NULL,NULL,NULL,NULL,NULL,1),(75,'gabrielvillarroel_11@hotmail.com','$2b$10$ryO6nnZIDGJ.kLBmXCmCqO21D3hnkm.A.dgtkJPRrmOcrjVS64lhi',1667851712614,'$2b$10$ryO6nnZIDGJ.kLBmXCmCqO21D3hnkm.A.dgtkJPRrmOcrjVS64lhi',1,'Gabriel','Villarroel','Caminotti','03/07/1994','Argentino','Marcos Juarez','27','1234567898765','123456789876543212','soltero','Masculino','3454545','tucuman','1562','','Bellavista Puente de vigas','Tlalnepantla de Baz','ESTADO DE MEXICO','03700','5','PRE-00075','A100153','ITMJZM',NULL,NULL,NULL,NULL,'2022-09-08 20:08:33','2022-09-08 20:12:37',74,28,NULL,NULL,NULL,NULL,1),(76,'karen.alvarado+4@gigigo.com','$2b$10$rRKymi4smczieDjPwODYjul5z7mQZFuUDqp/zh/2O0l389pwp52/6',1668186745912,'$2b$10$rRKymi4smczieDjPwODYjul5z7mQZFuUDqp/zh/2O0l389pwp52/6',1,'Karen','Alvarado','Martínez','03/09/1989','Mexicana','Ciudad de México','33','AAMK890430R84','AAMK890430MDFLRR07','Casado','Femenino','5525071672','Horacio','340','','Chapultepec Morales','Miguel Hidalgo','Ciudad de México','06400','6','PRE-00076','A100154','KRLF1B','2022-09-12 17:18:08','Este usuario ya ha sido activado por el sistema',NULL,37,'2022-09-12 17:12:26','2022-09-12 17:14:06',75,136,NULL,NULL,NULL,NULL,1),(78,'karen.alvarado+5@gigigo.com','$2b$10$yEqT3EUCfQ2h0ic.sp7el.MkJAEUQGCFTz7G1q6mQ1UjUsSdlJv7S',1668267415995,'$2b$10$yEqT3EUCfQ2h0ic.sp7el.MkJAEUQGCFTz7G1q6mQ1UjUsSdlJv7S',1,'Barbara','Zavala','Alvaarado','25/02/1997','Mexicana','Estado de México','25','ZAAB970225YTR','ZAAB979225MDFLRR03','Soltero','Femenino','5512345678','horacio','340','','Chapultepec Morales','Miguel Hidalgo','Ciudad de México','45637','3','PRE-00078','A100156','QNLT6W',NULL,NULL,NULL,NULL,'2022-09-13 15:36:56','2022-09-13 15:39:05',77,1,NULL,NULL,NULL,NULL,1),(81,'karen.alvarado+6@gigigo.com','$2b$10$XqrmFKAgs93HYiXB/Xc/RuEQs1gERB9u3oXpATAkmk5yWCxxNQamC',1668370254266,'$2b$10$XqrmFKAgs93HYiXB/Xc/RuEQs1gERB9u3oXpATAkmk5yWCxxNQamC',1,'Ivan','Ramirez','Nuñez','09/09/1996','Mexicana','Estado de México','26','RANI880123QTA','RANI880123HDFLRR07','Casado','Masculino','5529012345','pino','10','','tucuman','Irapuato','Guanajuato','73728','6','PRE-00081','A100159','NV3OCB','2022-09-14 20:23:43','Este usuario ya ha sido activado por el sistema',NULL,37,'2022-09-14 20:10:54','2022-09-14 20:12:25',80,136,NULL,NULL,NULL,NULL,1),(82,'gabrielvillarroel_14@hotmail.com','$2b$10$KJoaIpLxzuG6.6OmIdQ5QeNnCL385ZXRl5iNa7l0utkWagVyAWGWK',1668370527588,'$2b$10$KJoaIpLxzuG6.6OmIdQ5QeNnCL385ZXRl5iNa7l0utkWagVyAWGWK',1,'gabreklff','jdkfowkrbt','jzjdkwvrhf','14/09/1994','Mexicana','Aguascalientes','28','1234789997635','125684949471638977','Soltero','Masculino','93472552354','akdbfb','1562','','hidalgo','huehuetoca','estado de mexico','56794','6','PRE-00082','A100160','2X8Z4Y','2022-09-14 20:20:13','Este usuario ya ha sido activado por el sistema',NULL,37,'2022-09-14 20:15:28','2022-09-14 20:17:12',81,136,NULL,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;
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

-- Dump completed on 2022-10-10 11:06:45
