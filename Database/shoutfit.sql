-- MySQL dump 10.13  Distrib 5.5.37, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: Shoutfit
-- ------------------------------------------------------
-- Server version	5.5.37-0+wheezy1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `collections`
--

DROP TABLE IF EXISTS `collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `collections` (
  `user_id` bigint(20) NOT NULL,
  `photos` varchar(100) NOT NULL,
  `theme` varchar(50) NOT NULL,
  `share` int(11) NOT NULL,
  `collection_id` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`collection_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collections`
--

LOCK TABLES `collections` WRITE;
/*!40000 ALTER TABLE `collections` DISABLE KEYS */;
INSERT INTO `collections` VALUES (1,'1,2','Butt holes ',0,1),(20,'4,3','Butts ',0,2),(20,'5,6','A',0,3),(21,'9,10','Rff',0,4),(21,'13,14','Hhhhh',1,5);
/*!40000 ALTER TABLE `collections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friends` (
  `friend_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `user_friend_id` bigint(20) NOT NULL,
  PRIMARY KEY (`friend_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos` (
  `photo_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `photo_url` text NOT NULL,
  PRIMARY KEY (`photo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
INSERT INTO `photos` VALUES (1,'http://leadthewayofficial.com/PictureUpload/uploads/24235-1nry0mh.jpg'),(2,'http://leadthewayofficial.com/PictureUpload/uploads/24235-t8pm2i.jpg'),(3,'http://leadthewayofficial.com/PictureUpload/uploads/30015-czi7ps.jpg'),(4,'http://leadthewayofficial.com/PictureUpload/uploads/30015-bps23a.jpg'),(5,'http://leadthewayofficial.com/PictureUpload/uploads/30015-1twd9ve.jpg'),(6,'http://leadthewayofficial.com/PictureUpload/uploads/30015-1dte4p.jpg'),(7,'http://leadthewayofficial.com/PictureUpload/uploads/30015-132ey66.jpg'),(8,'http://leadthewayofficial.com/PictureUpload/uploads/30015-1q4w5lg.jpg'),(9,'http://leadthewayofficial.com/PictureUpload/uploads/30015-1xnrff3.jpg'),(10,'http://leadthewayofficial.com/PictureUpload/uploads/30015-ptla7j.jpg'),(11,'http://leadthewayofficial.com/PictureUpload/uploads/30015-1c400zq.jpg'),(12,'http://leadthewayofficial.com/PictureUpload/uploads/30015-2gcujz.jpg'),(13,'http://leadthewayofficial.com/PictureUpload/uploads/30015-1c95nxx.jpg'),(14,'http://leadthewayofficial.com/PictureUpload/uploads/30015-8jexec.jpg'),(15,'http://leadthewayofficial.com/PictureUpload/uploads/30015-9orwx2.jpg'),(16,'http://leadthewayofficial.com/PictureUpload/uploads/30015-1btho68.jpg');
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `country` varchar(100) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `number` varchar(80) NOT NULL,
  `coins` bigint(20) NOT NULL DEFAULT '20',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `number` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'USA','Nick o\'shea ','6502749403',17),(20,'USA','Paige ','16505159343',15),(21,'USA','Yyy','65588855555555',17),(22,'USA','FAG ','1234568888',20);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votes` (
  `user_id` bigint(20) DEFAULT NULL,
  `url` text,
  `created_at` date NOT NULL,
  `collection_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
INSERT INTO `votes` VALUES (1,'http://leadthewayofficial.com/PictureUpload/uploads/24235-1nry0mh.jpg','0000-00-00',1);
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-10-06  8:43:03
