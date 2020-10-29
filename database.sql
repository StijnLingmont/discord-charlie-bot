-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 29, 2020 at 10:05 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `charlie_bot`
--
CREATE DATABASE IF NOT EXISTS `charlie_bot` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `charlie_bot`;

-- --------------------------------------------------------

--
-- Table structure for table `ah_products`
--

CREATE TABLE `ah_products` (
  `id` int(11) NOT NULL,
  `server_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ah_products`
--

INSERT INTO `ah_products` (`id`, `server_id`, `name`, `url`) VALUES
(3, '767380625036017685', 'Frikandelbroodje', 'https://www.ah.nl/producten/product/wi230720/ah-frikandelbroodje'),
(4, '767380625036017685', 'Pita shoarma', 'https://www.ah.nl/producten/product/wi213257/ah-pita-shoarma');

-- --------------------------------------------------------

--
-- Table structure for table `blacklist`
--

CREATE TABLE `blacklist` (
  `id` int(11) NOT NULL,
  `server_id` varchar(255) NOT NULL,
  `banned_word` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blacklist`
--

INSERT INTO `blacklist` (`id`, `server_id`, `banned_word`) VALUES
(15, '767380625036017685', 'kanker');

-- --------------------------------------------------------

--
-- Table structure for table `destiny_user`
--

CREATE TABLE `destiny_user` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `refresh_token` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `destiny_user`
--

INSERT INTO `destiny_user` (`id`, `username`, `refresh_token`) VALUES
('19990575', 'Stijneratios', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `scoreboard`
--

CREATE TABLE `scoreboard` (
  `id` int(11) NOT NULL,
  `server_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `xp` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `scoreboard`
--

INSERT INTO `scoreboard` (`id`, `server_id`, `user_id`, `level`, `xp`) VALUES
(26, '767380625036017685', '177008446061805568', 12, 5108),
(27, '767380625036017685', '767493855666765865', 999, 399700);

-- --------------------------------------------------------

--
-- Table structure for table `servers`
--

CREATE TABLE `servers` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `servers`
--

INSERT INTO `servers` (`id`, `name`) VALUES
('767380625036017685', 'Developer Omgeving Stijn');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`) VALUES
('177008446061805568', 'Stijnkingnl'),
('767493855666765865', 'SLDev');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ah_products`
--
ALTER TABLE `ah_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ah_product_server_id` (`server_id`);

--
-- Indexes for table `blacklist`
--
ALTER TABLE `blacklist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `blacklist_server_id` (`server_id`);

--
-- Indexes for table `destiny_user`
--
ALTER TABLE `destiny_user`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `scoreboard`
--
ALTER TABLE `scoreboard`
  ADD PRIMARY KEY (`id`),
  ADD KEY `server_id` (`server_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `servers`
--
ALTER TABLE `servers`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ah_products`
--
ALTER TABLE `ah_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `blacklist`
--
ALTER TABLE `blacklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `scoreboard`
--
ALTER TABLE `scoreboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ah_products`
--
ALTER TABLE `ah_products`
  ADD CONSTRAINT `ah_product_server_id` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blacklist`
--
ALTER TABLE `blacklist`
  ADD CONSTRAINT `blacklist_server_id` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `scoreboard`
--
ALTER TABLE `scoreboard`
  ADD CONSTRAINT `server_id` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
