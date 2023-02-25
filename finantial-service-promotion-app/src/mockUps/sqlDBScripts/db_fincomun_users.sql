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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `validity_password` bigint NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL,
  `lasts_passwords` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Denis Ferreyra','denis.ferreyra@gigigo.com','$2b$10$SDZHQSJ1alUHp7DbszpwduIQPae1zMNp600PjClwp9owTjqgwKDym',1663943246560,'2022-05-26 17:30:28','2022-05-26 17:30:28',''),(3,'Karen Alvarado','karen.alvarado@econocom.com','$2b$10$r6corMsjhBT7Yabn3MlcyeVPWoDletEQ/QNxsVkmEPDreLE0Ihtey',1663943246560,'2022-05-26 20:44:26','2022-07-26 13:57:22',''),(7,'Eduardo','eduardo.minon@gigigo.com','$2b$10$r6corMsjhBT7Yabn3MlcyeVPWoDletEQ/QNxsVkmEPDreLE0Ihtey',1663943246560,'2022-06-22 20:24:06','2022-06-22 20:24:06',''),(13,'Edgar Ortega','edgar.ortega@econocom.com','$2b$10$oKY37rIV7tRpoSCxwBNdquSCUIZ1xhoNXHqI0g08XEMrsx.CgXQve',1663943246560,'2022-07-21 21:57:53','2022-07-21 21:57:53',''),(14,'Santiago','santiago.marcelino@gigigo.com','$2b$10$jvGhagvBI57o6H7Z9X58NuL5bvV.7L.KpFjlcvtz3NRxJP6CzE1CS',1663943246560,'2022-07-25 14:27:27','2022-08-02 14:51:53','$2b$10$idMUTQkISmjuTy9bFZkE4ujtSqZSHu6pphRAkzian5WuhWjmkPADW,$2b$10$jvGhagvBI57o6H7Z9X58NuL5bvV.7L.KpFjlcvtz3NRxJP6CzE1CS'),(15,'Gabriel','gabrielvillarroel_11@hotmail.com','$2b$10$lWh65mAXvtpF5Zkxf4KixebjWLAXpu4lTkehjwVsowcYwnv8aPkLa',1663943246560,'2022-07-29 16:35:20','2022-09-01 17:10:32','$2b$10$k4wsAb8wDteJCplPKJa7me7hM2aBYgGLvxZCFvOTyGuOIYwpeBlHe,$2b$10$9Qx0xy4LzVIOWKHrEHKfv.EdsxtSyyKkopBjFZ8b.GeeHGt7ro8Ii,$2b$10$s.2WQXmM8c.12tkOYmUybOCeOD.0Ttr5fkkVzCOac1DI5k37i521e,$2b$10$ccYNwn8boOm6z2zsLaaWce1038EJIZ5kK8PdLUKzBLTIIzXt/L63O,$2b$10$lWh65mAXvtpF5Zkxf4KixebjWLAXpu4lTkehjwVsowcYwnv8aPkLa'),(16,'Miriam Vargas','miriam.vargas@econocom.com','$2b$10$ZH825Kv3hYtStxGMbin3audQhgtBG4.hRYKWdmW0CxgzQwWQktGVG',1666627909113,'2022-08-25 16:11:49','2022-08-25 16:11:49','$2b$10$ZH825Kv3hYtStxGMbin3audQhgtBG4.hRYKWdmW0CxgzQwWQktGVG');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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

-- Dump completed on 2022-10-10 11:05:46
