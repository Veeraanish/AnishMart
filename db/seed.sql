-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: anishmart
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`id`, `name`) VALUES (2,'Electronics'),(3,'Fashion'),(1,'Groceries'),(4,'Home');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `image_url`, `stock`, `created_at`, `is_active`) VALUES (2,'Wireless Mouse','2.4 GHz wireless mouse',699.00,'Electronics','/images/wireless mouse.png',15,'2026-09-03 07:22:48',1),(3,'Cotton T-Shirt','Comfort-fit cotton T-shirt',499.00,'Fashion','/images/Cotton T-Shirt.png',30,'2026-09-03 07:22:48',1),(4,'Water Bottle','1 litre reusable bottle',299.00,'Home','/images/Water Bottle.png',20,'2026-09-03 07:22:48',1),(5,'Laptop','Powerful laptop for everyday use',55000.00,'Electronics','/images/laptop.png',9,'2026-09-04 04:57:49',1),(6,'Wireless Headphones','High quality wireless headphones',2500.00,'Electronics','/images/wireless headphones.png',19,'2026-09-04 04:57:49',1),(7,'Smart Watch','Modern smart watch with useful features',3500.00,'Electronics','/images/smart watch.png',14,'2026-09-04 04:57:49',1),(8,'The Alchemist','Popular inspirational novel',450.00,'Books','/images/The Alchemist.png',25,'2026-09-04 04:57:49',1),(9,'Clean Code','Programming and software development book',900.00,'Books','/images/Clean Code.png',14,'2026-09-04 04:57:49',1),(10,'Atomic Habits','Book about building better habits',550.00,'Books','/images/Atomic Habits.png',20,'2026-09-04 04:57:49',1),(11,'Men T-Shirt','Comfortable casual cotton T-shirt',599.00,'Fashion','/images/Men T-Shirt.png',30,'2026-09-04 04:57:49',1),(12,'Women Handbag','Stylish everyday handbag',1299.00,'Fashion','/images/Women Handbag.png',1,'2026-09-04 04:57:49',1),(13,'Casual Shoes','Comfortable casual shoes',1799.00,'Fashion','/images/Casual Shoes.png',3,'2026-09-04 04:57:49',1),(14,'Table Lamp','Modern LED table lamp',799.00,'Home','/images/Table Lamp.png',20,'2026-09-04 04:57:49',1),(15,'Coffee Mug','Premium ceramic coffee mug',299.00,'Home','/images/Coffee Mug.png',36,'2026-09-04 04:57:49',1),(18,'Test Watch','Smart Stylish waatch',999.00,'electronics','/images/test watch.png',13,'2026-09-04 10:22:30',1),(20,'vijay','nice',5655656.00,'1','/images/vijay.png',66,'2026-09-05 08:46:43',0),(21,'pen','easy to order',200.00,'statinary','/images/pen.png',1,'2026-09-05 17:18:02',0),(22,'flower pot','give roiyal look',399.00,'home','/images/flower pot.png',99,'2026-09-06 14:22:48',1),(23,'pen','smooth',10.00,'stationary','/images/pen.png',80,'2026-09-19 16:51:18',1),(24,'lipstick','',200.00,'beatuy','/images/lipstick.png',12,'2026-09-20 04:31:34',1),(25,'sunscreen','very light weight',199.00,'beatuy',NULL,14,'2026-09-21 09:50:05',1);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-05 20:29:12
