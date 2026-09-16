-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 09, 2026 at 03:36 AM
-- Server version: 11.8.8-MariaDB-log

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u647959341_supplyManageDb`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `actor_user_id` int(10) UNSIGNED NOT NULL,
  `actor_role` varchar(30) DEFAULT NULL,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) DEFAULT NULL,
  `summary` varchar(255) NOT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `ip` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `session_id` varchar(64) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `actor_user_id`, `actor_role`, `module`, `action`, `entity_type`, `entity_id`, `amount`, `summary`, `meta`, `ip`, `user_agent`, `session_id`, `created_at`) VALUES
(1, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:23:36'),
(2, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:15'),
(3, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:16'),
(4, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:16'),
(5, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:16'),
(6, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:16'),
(7, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:18'),
(8, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:19'),
(9, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:19'),
(10, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:19'),
(11, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:19'),
(12, 2, 'Array', 'auth', 'logout', 'user', 2, NULL, 'User logged out', NULL, '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:22'),
(13, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:26'),
(14, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:26'),
(15, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:27'),
(16, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:27'),
(17, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:27'),
(18, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:27'),
(19, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:25:39'),
(20, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:21'),
(21, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:22'),
(22, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:22'),
(23, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:22'),
(24, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:23'),
(25, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:23'),
(26, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:42'),
(27, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:43'),
(28, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:43'),
(29, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:43'),
(30, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:43'),
(31, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:47'),
(32, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:48'),
(33, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:48'),
(34, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:48'),
(35, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sd2oobmdsanmed2gm4btedctpf', '2026-08-18 09:31:48'),
(36, 290, 'Array', 'auth', 'logout', 'user', 290, NULL, 'User logged out', NULL, '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:58:36'),
(37, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 09:58:46'),
(38, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:42'),
(39, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:42'),
(40, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:42'),
(41, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:42'),
(42, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:42'),
(43, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:49'),
(44, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:49'),
(45, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:50'),
(46, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:50'),
(47, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:50'),
(48, 2, 'Array', 'auth', 'logout', 'user', 2, NULL, 'User logged out', NULL, '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:51'),
(49, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:54'),
(50, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:55'),
(51, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:55'),
(52, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:55'),
(53, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:55'),
(54, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:00:56'),
(55, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:04'),
(56, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:04'),
(57, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:04'),
(58, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:04'),
(59, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:04'),
(60, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:13'),
(61, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:13'),
(62, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:13'),
(63, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:13'),
(64, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:13'),
(65, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:24'),
(66, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:24'),
(67, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:24'),
(68, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:24'),
(69, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:01:24'),
(70, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'u73gkh0kst6ptodnr6t8chrgm0', '2026-08-18 10:01:36'),
(71, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'u73gkh0kst6ptodnr6t8chrgm0', '2026-08-18 10:01:37'),
(72, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'u73gkh0kst6ptodnr6t8chrgm0', '2026-08-18 10:01:37'),
(73, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'u73gkh0kst6ptodnr6t8chrgm0', '2026-08-18 10:01:38'),
(74, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'u73gkh0kst6ptodnr6t8chrgm0', '2026-08-18 10:01:38'),
(75, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'u73gkh0kst6ptodnr6t8chrgm0', '2026-08-18 10:01:38'),
(76, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:02:03'),
(77, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:02:03'),
(78, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:02:03'),
(79, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:02:03'),
(80, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:02:03'),
(81, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:03:08'),
(82, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:03:08'),
(83, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:03:08'),
(84, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:03:08'),
(85, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:03:08'),
(86, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:37:53'),
(87, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:37:53'),
(88, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:37:54'),
(89, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:37:54'),
(90, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:37:54'),
(91, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:00'),
(92, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:01'),
(93, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:01'),
(94, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:01'),
(95, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:01'),
(96, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:02'),
(97, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:07'),
(98, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:07'),
(99, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:07'),
(100, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:09'),
(101, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:10'),
(102, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:10'),
(103, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:10'),
(104, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-18 10:38:10'),
(105, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '5ijjo58l4d25ab0peb3v3gkqjm', '2026-08-18 10:38:22'),
(106, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '5ijjo58l4d25ab0peb3v3gkqjm', '2026-08-18 10:38:23'),
(107, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '5ijjo58l4d25ab0peb3v3gkqjm', '2026-08-18 10:38:23'),
(108, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '5ijjo58l4d25ab0peb3v3gkqjm', '2026-08-18 10:38:23'),
(109, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '5ijjo58l4d25ab0peb3v3gkqjm', '2026-08-18 10:38:24'),
(110, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '5ijjo58l4d25ab0peb3v3gkqjm', '2026-08-18 10:38:24'),
(111, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', '5ijjo58l4d25ab0peb3v3gkqjm', '2026-08-18 10:38:34'),
(112, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', '5ijjo58l4d25ab0peb3v3gkqjm', '2026-08-18 10:38:34'),
(113, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', '5ijjo58l4d25ab0peb3v3gkqjm', '2026-08-18 10:38:34'),
(114, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', '5ijjo58l4d25ab0peb3v3gkqjm', '2026-08-18 10:38:34'),
(115, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', '5ijjo58l4d25ab0peb3v3gkqjm', '2026-08-18 10:38:34'),
(116, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:15:39'),
(117, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:15:40'),
(118, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:15:40'),
(119, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:15:40'),
(120, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:15:41'),
(121, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:15:41'),
(122, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":3,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:15:44'),
(123, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:16:16'),
(124, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:16:16'),
(125, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:16:17'),
(126, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:16:18'),
(127, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:16:20'),
(128, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:16:21'),
(129, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:16:21'),
(130, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:16:21'),
(131, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '1m3ehs7pdmbidaned3vvhedcfi', '2026-08-19 09:16:23'),
(132, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:17:19'),
(133, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:21:41'),
(134, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:21:42'),
(135, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:21:42'),
(136, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:21:42'),
(137, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:21:42'),
(138, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:03'),
(139, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:03'),
(140, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:03'),
(141, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:03'),
(142, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:04'),
(143, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:06'),
(144, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:09'),
(145, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:10'),
(146, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:10'),
(147, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:10'),
(148, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:28'),
(149, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:28'),
(150, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:28'),
(151, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:23:28'),
(152, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:27'),
(153, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:28'),
(154, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:28');
INSERT INTO `activity_logs` (`id`, `actor_user_id`, `actor_role`, `module`, `action`, `entity_type`, `entity_id`, `amount`, `summary`, `meta`, `ip`, `user_agent`, `session_id`, `created_at`) VALUES
(155, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:28'),
(156, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:28'),
(157, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:28'),
(158, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:28'),
(159, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:28'),
(160, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:28'),
(161, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:29'),
(162, 2, 'Array', 'auth', 'logout', 'user', 2, NULL, 'User logged out', NULL, '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:31'),
(163, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:35'),
(164, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:35'),
(165, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:35'),
(166, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:36'),
(167, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:36'),
(168, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:36'),
(169, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:24:45'),
(170, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:27:40'),
(171, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:27:40'),
(172, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:27:40'),
(173, 2, 'Array', 'users', 'view', NULL, NULL, NULL, 'Viewed users list', '{\"total_users\":4,\"actor_id\":2,\"actor_role\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '0dh7jiftr8j4vo9o4sjutgpjpd', '2026-08-19 09:27:40'),
(174, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'pc4inuae3udgfo4hlg37tt1nev', '2026-08-19 11:27:45'),
(175, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '59.152.6.145', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', '6rjjmevkk79gjms3fj709ham8c', '2026-08-19 14:55:15'),
(176, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '59.152.3.118', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36', '1pl7lbp31gcn747a9vs0agbc5l', '2026-08-19 21:33:17'),
(177, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '103.253.47.179', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'dq2crcro3d0rkr4pvqvssk2de9', '2026-08-24 17:21:18'),
(178, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '103.67.159.111', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'c7dk88heq9rdam19q69eq33qp0', '2026-08-25 12:17:56'),
(179, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '103.67.159.45', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'm8gh2hed80i93q829n5o1cfoa1', '2026-08-25 12:26:00'),
(180, 2, 'Array', 'auth', 'login', 'user', 2, NULL, 'User logged in', '{\"login_id\":2,\"roles\":[\"manager\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '6r4vibcccg0lvl523u74hb8umc', '2026-08-25 12:28:45'),
(181, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '103.67.159.111', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'udsdgl9j5i13f30j4la4j13f21', '2026-08-25 12:53:35'),
(182, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', 'qo39cflvspqde5c6mkuora3o5u', '2026-08-25 12:53:42'),
(183, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', 'jb5jsmsbo99asagf91jrh7r8gt', '2026-08-25 16:07:33'),
(184, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', 'bfe0ej8vv5n2nk7gjjqojqn16g', '2026-08-25 16:13:07'),
(185, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', 'bfe0ej8vv5n2nk7gjjqojqn16g', '2026-08-25 16:13:07'),
(186, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '6u88p92ukmvbc152ekopqlski7', '2026-08-25 17:03:43'),
(187, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '59.152.3.25', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '6u88p92ukmvbc152ekopqlski7', '2026-08-25 18:55:02'),
(188, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '59.152.6.125', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '6u88p92ukmvbc152ekopqlski7', '2026-08-25 19:16:12'),
(189, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '47havib1601uba8l3mddkmcnvf', '2026-08-26 10:49:27'),
(190, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'k54b0opjsehmbp576419kivqra', '2026-08-26 13:02:41'),
(191, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '103.67.156.212', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'm8o9tpk6pin6i4aafrimlg2uh4', '2026-08-27 22:28:57'),
(192, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '103.253.47.43', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '649at5e9hnfpgmkv399nqnp9m7', '2026-08-28 19:52:08'),
(193, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'qgsc7jv4pbmqkccsmumphvd36k', '2026-08-29 16:19:58'),
(194, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '43.245.122.21', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'sdtsgvo8iujudm77qdg5vdihj8', '2026-08-29 17:42:48'),
(195, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '103.67.156.173', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'o700ivi1j1f7botthk51s4v3a7', '2026-08-31 07:16:57'),
(196, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', 'a70nc1cmtb8d6i6b0h58osj1et', '2026-08-31 08:01:48'),
(197, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '20bkphu3amj9n08j01gtrm6qtu', '2026-08-31 08:25:45'),
(198, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'dsluah6q9sdnoe0oqf1gl95t71', '2026-08-31 09:48:41'),
(199, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', 'hg53j1v20tprgtp69bj417mti4', '2026-08-31 10:14:00'),
(200, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '103.253.44.160', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'arr914qpte5q4m46fvqa3sdrlo', '2026-08-31 12:14:33'),
(201, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', '86ocs2a6vi1t2gnda68gbqbcpd', '2026-08-31 13:02:47'),
(202, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'bas3q5nf9cfs8eic0a2pug9rro', '2026-08-31 23:17:48'),
(203, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '2401:1900:80b7:e4ea:fcec:3fff:fedf:3b45', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'sdj768cvomvh83trfavdeq7n26', '2026-09-01 15:52:17'),
(204, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', 'b0dfnifoqtqdpoatcfqtmivhsn', '2026-09-01 16:04:17'),
(205, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '103.67.159.4', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', '3pnft6jf4tuo4gnt16g966ies8', '2026-09-02 07:54:56'),
(206, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '59.152.6.80', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'no66mnnjh6eqkkhcupj89lpcff', '2026-09-03 22:50:50'),
(207, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '116.58.203.146', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'vpc59a3d2lt6r21bhbcgj13q6f', '2026-09-04 15:28:30'),
(208, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'r5kkv1q7m1irq7v9pr8dhip6iq', '2026-09-05 09:22:11'),
(209, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', '71vb5n6gtpknsjv40gnr92khe8', '2026-09-05 09:54:08'),
(210, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '59.152.6.40', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', '997jb9q4t08ht76lj8ddqe7ah6', '2026-09-05 16:02:47'),
(211, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '59.152.2.27', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'pqds62etjr1cd0dlabges6v9ue', '2026-09-05 20:20:25'),
(212, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '2400:c600:5350:81ea:ade0:da8b:a97d:7194', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', '430pd5ng03eqm10ip9pt9ef8oh', '2026-09-05 23:55:42'),
(213, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '2400:c600:5350:81ea:ade0:da8b:a97d:7194', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', '430pd5ng03eqm10ip9pt9ef8oh', '2026-09-05 23:55:44'),
(214, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '2400:c600:5350:81ea:ade0:da8b:a97d:7194', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', '430pd5ng03eqm10ip9pt9ef8oh', '2026-09-05 23:55:49'),
(215, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'qg4m7btng6glprchheaeubdf49', '2026-09-06 12:22:38'),
(216, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '43.245.123.131', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', '84n4o4vd83eb0vaipbppn8fqib', '2026-09-06 17:02:12'),
(217, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '59.152.7.169', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'bqkmj76kf8udvrmg3ciamo2beu', '2026-09-07 16:05:11'),
(218, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', '9n7t3l2vpagvudl8mqpde0lgjq', '2026-09-07 21:09:10'),
(219, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '59.152.2.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'o4bopvo112e4f5tbdc4eaooatb', '2026-09-08 11:19:42'),
(220, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', 'i6ah6qsuecj4m2via5usfqpgug', '2026-09-08 11:29:15'),
(221, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '59.152.2.203', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', '477otse7g24h947ms1ts7cok6m', '2026-09-08 16:07:53'),
(222, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'ogtloob19blj8p4kiil4pocv04', '2026-09-08 16:25:50'),
(223, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '59.152.6.175', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'gfr406k9clpkr2liccf9ejectq', '2026-09-08 22:43:23'),
(224, 1, 'Array', 'auth', 'login', 'user', 1, NULL, 'User logged in', '{\"login_id\":1,\"roles\":[\"manager\",\"investor\"]}', '182.48.76.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'oeo9t0i1tadtqksdrepbds4npo', '2026-09-09 09:32:27');

-- --------------------------------------------------------

--
-- Table structure for table `cash`
--

CREATE TABLE `cash` (
  `id` int(11) NOT NULL,
  `type` varchar(10) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `refId` varchar(100) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `date` date DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `approval_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `reject_reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cash`
--

INSERT INTO `cash` (`id`, `type`, `source`, `purpose`, `amount`, `category`, `refId`, `remarks`, `date`, `createdAt`, `approval_status`, `approved_by`, `approved_at`, `reject_reason`) VALUES
(1, 'in', 'à¦®à§‹à¦ƒ à¦¤à¦¾à¦®à¦¾à¦¨à§à¦¨à¦¾ à¦†à¦•à§à¦¤à¦¾à¦° à¦ªà§à¦°à¦¾à¦¥à¦®à¦¿à¦• à¦¬à¦¿à¦¨à¦¿à§Ÿà§‹à¦—', NULL, 250000, 'invest', '', '', '2026-08-08', '2026-08-08 00:00:00', 'approved', 1, '2026-08-08 00:00:00', NULL),
(2, 'out', '', 'à¦¸à§à¦œà¦•à¦¿ à¦®à¦¨à§‹à¦Ÿà¦¨ à¦¬à§à¦²à¦¾à¦• à¦“ à¦—à§à¦°à§€à¦¨ à¦•à¦¾à¦²à¦¾à¦° à¦®à¦¡à§‡à¦² à§¨à§¦à§¨à§«', 170000, 'purchase', NULL, NULL, '2026-08-08', '2026-08-08 00:00:00', 'approved', 1, '2026-08-08 00:00:00', NULL),
(3, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¦à§¨ à¦¸à¦¾à¦‡à¦«à§à¦° à¦°à¦¹à¦®à¦¾à¦¨ à¦à¦° à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 93500, 'downpayment', '', '', '2026-08-08', '2026-08-08 00:00:00', 'approved', 1, '2026-08-08 00:00:00', NULL),
(4, 'out', '', 'Oppo A6c Chocolate Colour (4/64) New', 18200, 'purchase', NULL, NULL, '2026-08-08', '2026-08-08 00:00:00', 'approved', 1, '2026-08-08 00:00:00', NULL),
(5, 'out', '', 'Oppo A6x (4+64) Sky Old Set', 14000, 'purchase', NULL, NULL, '2026-08-09', '2026-08-09 00:00:00', 'approved', 1, '2026-08-09 00:00:00', NULL),
(6, 'out', '', 'vivo y05e (4+64|)', 16210, 'purchase', NULL, NULL, '2026-08-11', '2026-08-11 00:00:00', 'approved', 1, '2026-08-11 00:00:00', NULL),
(7, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¦à§© à¦¹à¦¾à¦¸à¦¾à¦¨ à¦à¦° à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 3000, 'downpayment', '', '', '2026-08-11', '2026-08-11 00:00:00', 'approved', 1, '2026-08-11 00:00:00', NULL),
(8, 'out', '', 'WFE- 2H2-GDXX-XX (Inverter', 31960, 'purchase', NULL, NULL, '2026-08-11', '2026-08-11 00:00:00', 'approved', 1, '2026-08-11 00:00:00', NULL),
(9, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¦à§ª à¦¸à§‹à¦¹à§‡à¦² à¦®à¦¿à§Ÿà¦¾ à¦•à¦¿à¦¸à§à¦¤à¦¿ à¦à¦° à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 10000, 'downpayment', '', '', '2026-08-11', '2026-08-11 00:00:00', 'approved', 1, '2026-08-11 00:00:00', NULL),
(10, 'out', '', '65w Solar & 40 w volvo Battery', 9345, 'purchase', NULL, NULL, '2026-08-13', '2026-08-13 00:00:00', 'approved', 1, '2026-08-13 00:00:00', NULL),
(11, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¦à§« à¦†à¦¬à§‡à¦¦à¦¿à¦¨ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 3065, 'downpayment', '', '', '2026-08-13', '2026-08-13 00:00:00', 'approved', 1, '2026-08-13 00:00:00', NULL),
(12, 'out', '', 'Oppo A6k (6+128) purple colour', 24920, 'purchase', NULL, NULL, '2026-08-13', '2026-08-13 00:00:00', 'approved', 1, '2026-08-13 00:00:00', NULL),
(13, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¦à§¬ à¦‰à¦®à¦° à¦«à¦¾à¦°à§à¦• à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 8083, 'downpayment', '', '', '2026-08-13', '2026-08-13 00:00:00', 'approved', 1, '2026-08-13 00:00:00', NULL),
(14, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¦à§­ à¦¸à¦¬à§à¦œ à¦¹à¦• à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 4000, 'downpayment', '', '', '2026-08-15', '2026-08-15 00:00:00', 'approved', 1, '2026-08-15 00:00:00', NULL),
(15, 'out', '', 'Oppo A6 (6+128) Gold Colour New', 27700, 'purchase', NULL, NULL, '2026-08-15', '2026-08-15 00:00:00', 'approved', 1, '2026-08-15 00:00:00', NULL),
(16, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¦à§® à¦¶à¦¾à¦®à§€à¦® à¦•à¦¾à¦‰à¦›à¦¾à¦° à¦®à¦¾à¦¸à§à¦® à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 7000, 'downpayment', '', '', '2026-08-15', '2026-08-15 00:00:00', 'approved', 1, '2026-08-15 00:00:00', NULL),
(17, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¦à§¯ à¦¹à¦¾à¦¨à§à¦¨à¦¾à¦¨ à¦®à¦¿à§Ÿà¦¾ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 5083, 'downpayment', '', '', '2026-08-16', '2026-08-16 00:00:00', 'approved', 1, '2026-08-16 00:00:00', NULL),
(18, 'in', 'à¦®à§‹à¦ƒ à¦¤à¦¾à¦®à¦¾à¦¨à§à¦¨à¦¾ à¦†à¦•à§à¦¤à¦¾à¦° à¦à¦° à¦¬à¦¿à¦¨à¦¿à§Ÿà§‹à¦—', NULL, 40000, 'invest', '', '', '2026-08-17', '2026-08-17 00:00:00', 'approved', 1, '2026-08-17 00:00:00', NULL),
(19, 'out', '', ' Oppo A6K (6+128) Violet Color', 24850, 'purchase', NULL, NULL, '2026-08-17', '2026-08-17 00:00:00', 'approved', 1, '2026-08-17 00:00:00', NULL),
(20, 'in', 'à¦†à¦‡à¦¡à¦¿ à§§à§¨ à¦†à¦‡à¦¨à¦¾à¦² à¦¹à¦• à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 8083, 'downpayment', '', '', '2026-08-17', '2026-08-17 00:00:00', 'approved', 1, '2026-08-17 00:00:00', NULL),
(21, 'out', '', 'RFL Wardrop 5th Drawer', 8810, 'purchase', NULL, NULL, '2026-08-18', '2026-08-18 00:00:00', 'approved', 1, '2026-08-18 00:00:00', NULL),
(22, 'in', 'à¦†à¦‡à¦¡à¦¿ à§§à§© à¦°à¦¾à¦¸à§‡à¦² à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 2155, 'downpayment', '', '', '2026-08-18', '2026-08-18 00:00:00', 'approved', 1, '2026-08-18 00:00:00', NULL),
(23, 'out', '', 'Oppo A6x (4+64) purple Old Set', 10720, 'purchase', NULL, NULL, '2026-08-18', '2026-08-18 00:00:00', 'approved', 1, '2026-08-18 00:00:00', NULL),
(24, 'in', 'à¦†à¦‡à¦¡à¦¿ à§§à§ª à¦¹à§‹à¦¸à§‡à¦¨ à¦®à¦¿à§Ÿà¦¾ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 4500, 'downpayment', '', '', '2026-08-18', '2026-08-18 00:00:00', 'approved', 1, '2026-08-18 00:00:00', NULL),
(25, 'out', '', 'MSI Graphic Card & Monitor', 62620, 'purchase', NULL, NULL, '2026-08-19', '2026-08-19 00:00:00', 'approved', 1, '2026-08-19 00:00:00', NULL),
(26, 'in', 'à¦†à¦‡à¦¡à¦¿ à§§à§¦ à¦†à¦¬à§ à¦¬à¦•à¦° à¦¸à¦¿à¦¦à§à¦¦à¦¿à¦• à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 16286, 'downpayment', '', '', '2026-08-19', '2026-08-19 00:00:00', 'approved', 1, '2026-08-19 00:00:00', NULL),
(27, 'out', '', 'MSI Monitor & Apolo UPS', 15720, 'purchase', NULL, NULL, '2026-08-19', '2026-08-19 00:00:00', 'approved', 1, '2026-08-19 00:00:00', NULL),
(28, 'in', 'à¦†à¦‡à¦¡à¦¿ à§§à§§ à¦†à¦²à§€ à¦†à¦¹à¦®à¦¦ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 4000, 'downpayment', '', '', '2026-08-19', '2026-08-19 00:00:00', 'approved', 1, '2026-08-19 00:00:00', NULL),
(29, 'out', '', 'Honor x7d (8+256) Old set', 17340, 'purchase', NULL, NULL, '2026-08-20', '2026-08-20 00:00:00', 'approved', 1, '2026-08-20 00:00:00', NULL),
(30, 'in', 'à¦†à¦‡à¦¡à¦¿ à§§à§« à¦¸à¦¿à¦ªà¦¨ à¦®à¦¿à§Ÿà¦¾ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 6700, 'downpayment', '', '', '2026-08-20', '2026-08-20 00:00:00', 'approved', 1, '2026-08-20 00:00:00', NULL),
(31, 'out', '', 'Oppo A6x (4+128) Old Set', 12420, 'purchase', NULL, NULL, '2026-08-20', '2026-08-20 00:00:00', 'approved', 1, '2026-08-20 00:00:00', NULL),
(32, 'in', 'à¦¨à§Ÿà¦¨ à¦¸à§‡à¦²à§à¦¨ à§¨à§¦à§¦à§¦/à§¨à§¦à¦œà¦¨ à¦²à¦Ÿà¦¾à¦°à¦¿à¦° à¦Ÿà¦¾à¦•à¦¾ à¦ªà§‡à§Ÿà§‡à¦›à¦¿', NULL, 40000, 'others', '', '', '2026-08-20', '2026-08-20 00:00:00', 'approved', 1, '2026-08-20 00:00:00', NULL),
(33, 'in', 'à¦†à¦‡à¦¡à¦¿ à§§à§¬ à¦†à¦¬à§à¦¦à§à¦² à¦¹à¦¾à¦®à¦¿à¦¦ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', NULL, 10600, 'downpayment', '', '', '2026-08-22', '2026-08-22 00:00:00', 'approved', 1, '2026-08-22 00:00:00', NULL),
(34, 'out', '', 'Oppo A6s Pro (8+256) & Luminous IPS 1050 evo d', 47300, 'purchase', NULL, NULL, '2026-08-22', '2026-08-22 00:00:00', 'approved', 1, '2026-08-22 00:00:00', NULL),
(35, 'in', 'à¦•à§à¦°à¦¿à§Ÿà§‡à¦Ÿà¦¿à¦­ à¦¥à§‡à¦•à§‡ à¦¹à¦¾à¦“à¦²à¦¾à¦¤', NULL, 25000, 'loan', '', 'à§¦à§§/à§¦à§¯/à§¨à§¦à§¨à§¬ à¦ à¦«à§‡à¦°à¦¤ à¦¦à¦¿à¦¤à§‡ à¦¹à¦¬à§‡à¥¤', '2026-08-24', '2026-08-24 22:32:17', 'approved', 1, '2026-08-24 22:32:40', NULL),
(36, 'in', 'à¦†à¦‡à¦¡à¦¿ à§§à§­ à¦¦à§‡à¦²à§‹à§Ÿà¦¾à¦° à¦¹à§‹à¦¸à§‡à¦¨ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 5683, 'downpayment', '', '', '2026-08-26', '2026-08-31 10:06:11', 'approved', 1, '2026-08-31 10:07:22', NULL),
(37, 'out', '', 'Oppo A6c (4+64) New', 19260, 'purchase', NULL, NULL, '2026-08-26', '2026-08-31 10:09:16', 'approved', 1, '2026-08-31 10:09:32', NULL),
(38, 'in', 'à¦†à¦‡à¦¡à¦¿ à§§à§® à¦°à¦«à¦¿à¦•à§à¦² à¦‡à¦¸à¦²à¦¾à¦® à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 5000, 'downpayment', '', '', '2026-08-27', '2026-09-08 11:47:26', 'approved', 1, '2026-09-08 11:47:45', NULL),
(39, 'out', '', 'VIVO Y05E NEW (4+64)', 16110, 'purchase', NULL, NULL, '2026-08-27', '2026-09-08 11:49:27', 'approved', 1, '2026-09-08 11:49:36', NULL),
(40, 'in', 'à¦†à¦‡à¦¡à¦¿ à§§à§¯ à¦«à§à¦² à¦­à¦¾à¦¨à§ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 7000, 'downpayment', '', '', '2026-08-27', '2026-09-08 11:51:33', 'approved', 1, '2026-09-08 11:51:42', NULL),
(41, 'in', 'à¦¹à§‹à¦¸à¦¾à¦‡à¦¨ à¦­à¦¾à¦‡ à¦¥à§‡à¦•à§‡ à¦¹à¦¾à¦“à¦²à¦¾à¦¤ à¦¨à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡ ', NULL, 200000, 'loan', '', '', '2026-08-29', '2026-09-08 11:52:53', 'approved', 1, '2026-09-08 11:54:33', NULL),
(42, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¨à§¦ à¦œà§à§Ÿà§‡à¦² à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 5500, 'downpayment', '', '', '2026-08-29', '2026-09-08 11:54:08', 'approved', 1, '2026-09-08 11:54:31', NULL),
(43, 'out', '', 'SAMSUNG A07 (4+64) NEW', 15620, 'purchase', NULL, NULL, '2026-08-29', '2026-09-08 11:55:36', 'approved', 1, '2026-09-08 11:55:44', NULL),
(44, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¨à§§ à¦°à¦¾à§Ÿà¦¹à¦¾à¦¨ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 9500, 'downpayment', '', '', '2026-08-29', '2026-09-08 11:57:06', 'approved', 1, '2026-09-08 11:57:13', NULL),
(45, 'out', '', 'LUMINOUS IPS 1450E & OLD BATTERY', 24120, 'purchase', NULL, NULL, '2026-08-29', '2026-09-08 11:58:31', 'approved', 1, '2026-09-08 11:58:47', NULL),
(46, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¨à§¨ à¦°à§à¦®à¦¿ à¦†à¦•à§à¦¤à¦¾à¦° à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 5000, 'downpayment', '', '', '2026-08-31', '2026-09-08 11:59:27', 'approved', 1, '2026-09-08 12:01:12', NULL),
(47, 'in', 'à¦°à¦¾à¦œà¦¿à¦¬ à¦¦à¦¾à¦¦à¦¾ à§« à¦Ÿà¦¿ à¦«à§‹à¦¨ (A07 4+64) à¦¬à¦¾à¦•à§€ à¦¦à¦¿à§Ÿà§‡à¦›à§‡ ', NULL, 78000, 'loan', '', '', '2026-08-31', '2026-09-08 12:01:03', 'approved', 1, '2026-09-08 12:01:10', NULL),
(48, 'out', '', 'SAMSUNG A07 (4+64) NEW', 15620, 'purchase', NULL, NULL, '2026-08-31', '2026-09-08 12:02:17', 'approved', 1, '2026-09-08 12:02:30', NULL),
(49, 'in', 'à¦†à¦¬à§à¦¦à§à¦² à¦¹à¦¾à¦¨à§à¦¨à¦¾à¦¨ à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿ à¦ªà¦°à¦¿à¦¶à§‹à¦§ ', NULL, 2900, 'installment', '', '', '2026-09-01', '2026-09-08 12:05:40', 'approved', 1, '2026-09-08 12:06:52', NULL),
(50, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¨à§© à¦¬à§à¦°à¦¹à¦¾à¦¨ à¦‰à¦¦à¦¦à§€à¦¨ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 4000, 'downpayment', '', '', '2026-09-01', '2026-09-08 12:06:37', 'approved', 1, '2026-09-08 12:06:51', NULL),
(51, 'out', '', 'SAMSUNG A07 (4+64) NEW', 16190, 'purchase', NULL, NULL, '2026-09-01', '2026-09-08 12:07:45', 'approved', 1, '2026-09-08 12:07:59', NULL),
(52, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¨à§ª à¦¸à§à¦®à¦¨ à¦®à¦¿à§Ÿà¦¾ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 4000, 'downpayment', '', '', '2026-09-01', '2026-09-08 12:08:46', 'approved', 1, '2026-09-08 12:08:56', NULL),
(53, 'out', '', 'REDMI A07 PRO (4+64) NEW', 16195, 'purchase', NULL, NULL, '2026-09-01', '2026-09-08 12:11:20', 'approved', 1, '2026-09-08 12:12:37', NULL),
(54, 'out', '', 'SAMSUNG A07 (4+64) NEW', 16260, '', NULL, NULL, '2026-09-02', '2026-09-08 12:12:25', 'approved', 1, '2026-09-08 12:12:35', NULL),
(55, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¨à§« à¦•à¦¾à¦°à§à¦¡ à§¨à§ª à¦†à¦¬à§ à¦¸à§à¦«à¦¿à§Ÿà¦¾à¦¨ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 10000, 'downpayment', '', '', '2026-09-02', '2026-09-08 12:13:50', 'approved', 1, '2026-09-08 12:13:58', NULL),
(56, 'out', '', 'REDMI A7 PRO ( 4+64) NEW', 16195, 'purchase', NULL, NULL, '2026-09-02', '2026-09-08 12:15:02', 'approved', 1, '2026-09-08 12:15:15', NULL),
(57, 'in', 'à¦†à¦‡à¦¡à¦¿ à§¨à§¬ à¦•à¦¾à¦°à§à¦¡ à§¨à§« à¦¶à¦¾à¦¹à¦°à¦¿à§Ÿà¦¾à¦° à¦¹à§ƒà¦¦à§Ÿ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 4000, 'downpayment', '', '', '2026-09-02', '2026-09-08 12:16:19', 'approved', 1, '2026-09-08 12:16:26', NULL),
(58, 'out', '', 'TECNO SPARK 50 (6+128) NEW', 21444, 'purchase', NULL, NULL, '2026-09-03', '2026-09-08 12:17:27', 'approved', 1, '2026-09-08 12:17:35', NULL),
(59, 'in', ' à¦•à¦¾à¦°à§à¦¡ à¦¨à¦¾à¦®à§à¦¬à¦¾à¦° à§¨à§¬ à¦œà§Ÿà¦¦à¦° à¦®à¦¿à§Ÿà¦¾ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 5093, 'downpayment', '', '', '2026-09-03', '2026-09-08 12:18:25', 'approved', 1, '2026-09-08 12:18:45', NULL),
(60, 'out', '', 'HONOR X7D (8+256) NEW', 26755, 'purchase', NULL, NULL, '2026-09-03', '2026-09-08 12:20:29', 'approved', 1, '2026-09-08 12:20:39', NULL),
(61, 'in', 'à¦•à¦¾à¦°à§à¦¡ à¦¨à¦¾à¦®à§à¦¬à¦¾à¦° à§¨à§­ à¦†à¦¬à§à¦¦à§à¦² à¦†à¦²à§€ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 8000, 'downpayment', '', '', '2026-09-03', '2026-09-08 12:21:35', 'approved', 1, '2026-09-08 12:21:58', NULL),
(62, 'out', '', 'REALME C85 (6+128) NEW', 20325, 'purchase', NULL, NULL, '2026-09-03', '2026-09-08 12:23:03', 'approved', 1, '2026-09-08 12:23:17', NULL),
(63, 'in', 'à¦•à¦¾à¦°à§à¦¡ à¦¨à¦¾à¦®à§à¦¬à¦¾à¦° à§¨à§® à¦®à¦¿à¦›à¦¬à¦¾à¦¹ à¦†à¦¹à¦®à§‡à¦¦ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 6332, 'downpayment', '', '', '2026-09-03', '2026-09-08 12:24:06', 'approved', 1, '2026-09-08 12:25:35', NULL),
(64, 'out', '', 'à¦°à¦¾à¦œà¦¿à¦¬ à¦¦à¦¾à¦¦à¦¾ à§« à¦Ÿà¦¿ à¦«à§‹à¦¨ (A07 4+64) à¦¬à¦¾à¦•à§€ à¦«à§‡à¦°à¦¤ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡', 78000, 'loan-repayment', NULL, NULL, '2026-09-03', '2026-09-08 12:32:56', 'approved', 1, '2026-09-08 12:33:03', NULL),
(65, 'in', 'à¦°à¦¾à¦œà¦¿à¦¬ à¦¦à¦¾à¦¦à¦¾ à§¬ à¦Ÿà¦¿ à¦«à§‹à¦¨ (Samsung 07 4+64) à¦¬à¦¾à¦•à§€  à¦¦à¦¿à§Ÿà§‡à¦›à§‡ ', NULL, 93600, 'loan', '', '', '2026-09-03', '2026-09-08 12:34:43', 'approved', 1, '2026-09-08 12:34:54', NULL),
(66, 'out', '', 'LUMINOUS IPS 1050 EVO D', 9520, 'purchase', NULL, NULL, '2026-09-06', '2026-09-08 12:35:54', 'approved', 1, '2026-09-08 12:36:00', NULL),
(67, 'in', 'à¦•à¦¾à¦°à§à¦¡ à¦¨à¦¾à¦®à§à¦¬à¦¾à¦° à§¨à§¯ à¦†à¦¬à§à¦² à¦•à¦¾à¦²à¦¾à¦® à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 3550, 'downpayment', '', '', '2026-09-06', '2026-09-08 12:37:50', 'approved', 1, '2026-09-08 12:38:00', NULL),
(68, 'out', '', 'MARCEL FREEZE 176 L MFD-A6C', 29120, 'purchase', NULL, NULL, '2026-09-06', '2026-09-08 12:40:33', 'approved', 1, '2026-09-08 12:40:41', NULL),
(69, 'in', 'à¦•à¦¾à¦°à§à¦¡ à¦¨à¦¾à¦®à§à¦¬à¦¾à¦° à§©à§¦ à¦®à¦¿à¦Ÿà§ à¦†à¦¹à¦®à§‡à¦¦ à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ ', NULL, 10000, 'downpayment', '', '', '2026-09-06', '2026-09-08 12:41:47', 'approved', 1, '2026-09-08 12:42:05', NULL),
(70, 'out', 'company-expense', 'à¦®à§‹à¦¹à¦¾à¦‡à¦®à¦¿à¦¨ à¦ªà¦¾à¦Ÿà§‹à§Ÿà¦¾à¦°à§€à¦° à¦¸à¦¾à¦¥à§‡ à¦«à¦¾à¦‡à¦¨à§à¦¯à¦¾à¦¨à§à¦¸ à¦•à¦¨à¦¸à¦¾à¦²à¦Ÿà§‡à¦¨à§à¦Ÿ à¦«à¦¿ ', 3000, 'office-expense', NULL, NULL, '2026-09-06', '2026-09-08 12:46:16', 'approved', 1, '2026-09-08 12:46:30', NULL),
(71, 'in', 'CARD NUMBER 5 1ST INSTALMENT', NULL, 3500, 'installment', '', '', '2026-09-05', '2026-09-08 12:54:01', 'approved', 1, '2026-09-08 12:54:10', NULL),
(72, 'in', 'CARD NO 3 SHOHEL 01-06TH INSTALMENT (ADVANCE 2000/-)', NULL, 20000, 'installment', '', 'à§©à§¦à§¦à§¦ à¦Ÿà¦¾à¦•à¦¾ à¦•à¦°à§‡ à§¬ à¦•à¦¿à¦¸à§à¦¤à¦¿ à§§à§®,à§¦à§¦à§¦/- à¦†à¦° à¦¦à§à¦‡ à¦¹à¦¾à¦œà¦¾à¦° à¦Ÿà¦¾à¦•à¦¾ à¦à¦¡à¦­à¦¾à¦¨à§à¦¸ ', '2026-09-06', '2026-09-08 13:00:06', 'approved', 1, '2026-09-08 13:00:12', NULL),
(73, 'in', 'MD ABEDIN CARD NO 4 1ST INSTALMENT', NULL, 1500, 'installment', '', '', '2026-09-06', '2026-09-08 13:02:42', 'approved', 1, '2026-09-08 13:03:14', NULL),
(74, 'in', 'SAIFUR CARD NO 01 1ST INSTALMENT ', NULL, 8000, 'installment', '', '', '2026-09-07', '2026-09-08 13:06:08', 'approved', 1, '2026-09-08 13:06:15', NULL),
(75, 'in', 'HASAN CARD NO 2 1ST INSTALLMENT ', NULL, 2650, 'installment', '', '', '2026-09-07', '2026-09-08 13:10:04', 'approved', 1, '2026-09-08 13:10:43', NULL),
(76, 'in', 'ALI AHMED CARD NO 10 1ST INSTALMENT', NULL, 2300, 'installment', '', '', '2026-09-07', '2026-09-08 13:10:36', 'approved', 1, '2026-09-08 13:10:41', NULL),
(78, 'in', 'DAILY INSTALMENT COLLECTION  ', NULL, 8500, 'daily-installment', '', '', '2026-09-07', '2026-09-07 16:38:45', 'approved', 1, '2026-09-07 16:38:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `company_expenses`
--

CREATE TABLE `company_expenses` (
  `id` int(11) NOT NULL,
  `expense_date` date NOT NULL,
  `title` varchar(150) NOT NULL,
  `details` text DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `category` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_applications`
--

CREATE TABLE `customer_applications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `application_card` enum('green','yellow','red','shop') NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_address` text NOT NULL,
  `customer_nid_front` varchar(255) NOT NULL,
  `customer_nid_back` varchar(255) NOT NULL,
  `customer_photo` varchar(255) NOT NULL,
  `customer_bank_check` varchar(255) DEFAULT NULL,
  `customer_bank_statement` varchar(255) DEFAULT NULL,
  `guarantor_name` varchar(100) NOT NULL,
  `guarantor_phone` varchar(20) NOT NULL,
  `guarantor_address` text NOT NULL,
  `guarantor_nid_front` varchar(255) NOT NULL,
  `guarantor_nid_back` varchar(255) NOT NULL,
  `guarantor_photo` varchar(255) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `mrp` decimal(12,2) NOT NULL,
  `sales_price` decimal(12,2) NOT NULL,
  `down_payment` decimal(12,2) NOT NULL,
  `installments` int(11) NOT NULL,
  `request_date` date NOT NULL,
  `green_note` text DEFAULT NULL,
  `yellow_note` text DEFAULT NULL,
  `red_note` text DEFAULT NULL,
  `shop_note` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `reviewed_by` bigint(20) DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `reject_reason` text DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_guarantors`
--

CREATE TABLE `customer_guarantors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_user_id` bigint(20) UNSIGNED NOT NULL,
  `guarantor_user_id` bigint(20) UNSIGNED NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `assigned_at` datetime NOT NULL DEFAULT current_timestamp(),
  `assigned_by` bigint(20) UNSIGNED DEFAULT NULL,
  `relation` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `daily_installments`
--

CREATE TABLE `daily_installments` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `cardId` int(11) DEFAULT NULL,
  `amount` decimal(14,2) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `receiver` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `update_by` int(11) DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `update_reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `daily_installments`
--

INSERT INTO `daily_installments` (`id`, `userId`, `cardId`, `amount`, `date`, `receiver`, `created_at`, `update_by`, `update_at`, `update_reason`) VALUES
(1, 16, 15, 10600.00, '2026-08-22', '1', '2026-08-22 10:29:39', NULL, NULL, NULL),
(2, 30, 29, 3550.00, '2026-09-07', '1', '2026-09-07 12:04:33', NULL, NULL, NULL),
(3, 21, 20, 9500.00, '2026-08-29', '1', '2026-08-29 10:26:20', NULL, NULL, NULL),
(4, 21, 20, 1200.00, '2026-09-07', '1', '2026-09-07 10:29:39', NULL, NULL, NULL),
(5, 16, 15, 2250.00, '2026-09-07', '1', '2026-09-07 10:29:39', NULL, NULL, NULL),
(7, 7, 6, 4000.00, '2026-08-15', '1', '2026-08-15 10:34:28', NULL, NULL, NULL),
(8, 7, 6, 1500.00, '2026-09-07', '1', '2026-09-07 10:34:28', NULL, NULL, NULL),
(9, 7, 6, 100.00, '2026-09-08', '215', '2026-09-08 16:36:59', NULL, NULL, NULL),
(10, 16, 15, 200.00, '2026-09-08', '215', '2026-09-08 16:37:20', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employer_attendance`
--

CREATE TABLE `employer_attendance` (
  `id` int(10) UNSIGNED NOT NULL,
  `employee_id` int(11) NOT NULL,
  `work_date` date NOT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `status` enum('present','absent') DEFAULT 'present',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `activity_status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `installment_cards`
--

CREATE TABLE `installment_cards` (
  `id` int(11) NOT NULL,
  `card_number` varchar(50) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `reference_user_id` int(11) DEFAULT NULL,
  `product_name` varchar(500) NOT NULL,
  `mrp` decimal(10,2) DEFAULT NULL,
  `purchase_price` decimal(10,2) DEFAULT NULL,
  `additional_cost` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `sale_type` enum('Cash','Installment') DEFAULT 'Installment',
  `sale_price` decimal(10,2) DEFAULT NULL,
  `down_payment` decimal(10,2) DEFAULT NULL,
  `total_due_amount` decimal(10,2) DEFAULT NULL,
  `installment_count` int(11) DEFAULT NULL,
  `per_installment_amount` decimal(10,2) DEFAULT NULL,
  `profit` decimal(10,2) DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `first_installment_date` date DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `status` enum('Running','Fully Paid','Overdue') DEFAULT 'Running',
  `created_at` datetime DEFAULT current_timestamp(),
  `description` varchar(10000) DEFAULT NULL,
  `memo` text DEFAULT NULL,
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `installment_cards`
--

INSERT INTO `installment_cards` (`id`, `card_number`, `user_id`, `reference_user_id`, `product_name`, `mrp`, `purchase_price`, `additional_cost`, `cost_price`, `sale_type`, `sale_price`, `down_payment`, `total_due_amount`, `installment_count`, `per_installment_amount`, `profit`, `delivery_date`, `first_installment_date`, `supplier_id`, `status`, `created_at`, `description`, `memo`, `remarks`) VALUES
(1, '1', 2, 1, 'SUZUKI MONOTON 2026 MODEL BLACK & GREEN', 206500.00, 170000.00, 0.00, 170000.00, 'Installment', 187000.00, 93500.00, 93500.00, 12, 8000.00, 17000.00, '2026-08-08', '2026-09-05', NULL, 'Running', '2026-08-25 13:08:31', NULL, NULL, ''),
(2, '2', 3, 1, 'Vivo y05e (4+64) New', 16599.00, 15770.00, 440.00, 16210.00, 'Installment', 18743.00, 3000.00, 15743.00, 6, 2650.00, 2533.00, '2026-08-08', '2026-09-05', NULL, 'Running', '2026-08-25 16:08:39', NULL, NULL, NULL),
(3, '3', 4, 1, 'WALTON FRIDGE 213 L.', 39990.00, 31790.00, 170.00, 31960.00, 'Installment', 43148.00, 10000.00, 33148.00, 12, 3000.00, 11188.00, '2026-08-11', '2026-09-05', NULL, 'Running', '2026-08-25 16:29:49', NULL, NULL, NULL),
(4, '4', 5, 1, '65 WATT SOLAR & BATTERY', 10968.00, 9100.00, 245.00, 9345.00, 'Installment', 12065.00, 3065.00, 9000.00, 6, 1500.00, 2720.00, '2026-08-13', '2026-09-05', NULL, 'Running', '2026-08-25 16:38:46', NULL, NULL, ''),
(5, '5', 6, 1, 'OPPO A6K (6+128)', 25999.00, 24310.00, 610.00, 24920.00, 'Installment', 29083.00, 8083.00, 21000.00, 6, 3500.00, 4163.00, '2026-08-13', '2026-09-05', NULL, 'Running', '2026-08-25 16:52:51', NULL, NULL, NULL),
(6, '6', 7, 1, 'OPPO A6K (4+64)', 20000.00, 14000.00, 0.00, 14000.00, 'Installment', 19734.00, 4000.00, 15734.00, 6, 2650.00, 5734.00, '2026-08-15', '2026-09-05', NULL, 'Running', '2026-08-25 16:58:42', NULL, NULL, 'Daily'),
(7, '7', 8, 1, 'OPPO A6 (6+128)', 28999.00, 26970.00, 730.00, 27700.00, 'Installment', 32383.00, 7000.00, 25383.00, 6, 4250.00, 4683.00, '2026-08-15', '2026-09-05', NULL, 'Running', '2026-08-25 17:06:14', NULL, NULL, NULL),
(8, '8', 9, 1, 'OPPO A6C (4+64)', 19999.00, 17950.00, 250.00, 18200.00, 'Installment', 22483.00, 5083.00, 17400.00, 6, 2900.00, 4283.00, '2026-08-18', '2026-09-05', NULL, 'Running', '2026-08-25 17:10:41', NULL, NULL, NULL),
(9, '9', 10, 1, 'GRAPHIC CARD AND MONITOR', 66320.00, 62200.00, 420.00, 62620.00, 'Installment', 76268.00, 16268.00, 60000.00, 12, 5000.00, 13648.00, '2026-08-19', '2026-09-05', NULL, 'Running', '2026-08-25 17:14:46', NULL, NULL, NULL),
(10, '10', 11, 1, 'MSI MONITOR AND UPS', 14650.00, 15300.00, 420.00, 15720.00, 'Installment', 17677.00, 4000.00, 13677.00, 6, 2300.00, 1957.00, '2026-08-19', '2026-09-05', NULL, 'Running', '2026-08-25 17:18:39', NULL, NULL, NULL),
(11, '11', 12, 1, 'OPPO A6K (6+128)', 25999.00, 24310.00, 540.00, 24850.00, 'Installment', 29083.00, 8083.00, 21000.00, 6, 3500.00, 4233.00, '2026-08-17', '2026-09-05', NULL, 'Running', '2026-08-25 17:22:32', NULL, NULL, NULL),
(12, '12', 13, 1, 'RFL WARDROP 5 DRAWER', 12600.00, 8800.00, 10.00, 8810.00, 'Installment', 9955.00, 2155.00, 7800.00, 6, 1300.00, 1145.00, '2026-08-18', '2026-09-05', NULL, 'Running', '2026-08-25 17:27:58', NULL, NULL, NULL),
(13, '13', 14, 1, 'OPPO A6X (4+64)', 19999.00, 10300.00, 420.00, 10720.00, 'Installment', 16500.00, 4500.00, 12000.00, 6, 2000.00, 5780.00, '2026-08-18', '2026-09-05', NULL, 'Running', '2026-08-25 17:31:35', NULL, NULL, NULL),
(14, '14', 15, 1, 'HONOR X7D (6+128)', 25999.00, 17000.00, 340.00, 17340.00, 'Installment', 22600.00, 6700.00, 15900.00, 6, 2650.00, 5260.00, '2026-08-20', '2026-09-05', NULL, 'Running', '2026-08-25 17:34:40', NULL, NULL, NULL),
(15, '15', 16, 1, 'OPPO A6S PRO (8+256) + LUMINOUS IPS', 50990.00, 46690.00, 610.00, 47300.00, 'Installment', 56200.00, 10600.00, 45600.00, 12, 3800.00, 8900.00, '2026-08-22', '2026-09-05', NULL, 'Running', '2026-08-25 17:37:50', NULL, NULL, 'Daily'),
(16, '16', 17, 1, 'Oppo A6c (4+64) New', 19999.00, 18900.00, 360.00, 19260.00, 'Installment', 22483.00, 5683.00, 16800.00, 6, 2800.00, 3223.00, '2026-08-26', '2026-09-05', NULL, 'Running', '2026-08-27 23:08:17', NULL, NULL, NULL),
(17, '17', 18, 1, 'Vivo y05e (4+64) New', 16599.00, 15770.00, 340.00, 16110.00, 'Installment', 18743.00, 5000.00, 13743.00, 6, 2300.00, 2633.00, '2026-08-27', '2026-09-05', NULL, 'Running', '2026-08-27 23:35:14', NULL, NULL, NULL),
(18, '18', 19, 1, 'Oppo A6x (4+128) Old Set', 21999.00, 12000.00, 420.00, 12420.00, 'Installment', 16984.00, 7000.00, 9984.00, 6, 1700.00, 4564.00, '2026-08-27', '2026-09-05', NULL, 'Running', '2026-08-27 23:59:05', NULL, NULL, NULL),
(19, '19', 20, 1, 'SAMSUNG A07(4+64)', 16999.00, 15600.00, 20.00, 15620.00, 'Installment', 18700.00, 5500.00, 13200.00, 6, 2200.00, 3080.00, '2026-08-29', '2026-09-01', NULL, 'Running', '2026-08-29 16:04:11', NULL, NULL, NULL),
(20, '20', 21, 1, 'LUMINOUS IPS AND BATTERY', 29120.00, 24000.00, 120.00, 24120.00, 'Installment', 32032.00, 9500.00, 22532.00, 6, 3800.00, 7912.00, '2026-08-29', '2026-09-05', NULL, 'Running', '2026-08-29 16:04:24', NULL, NULL, 'Daily'),
(21, '21', 22, 1, 'SAMSUNG A07 (4+64) NEW', 16999.00, 15600.00, 20.00, 15620.00, 'Installment', 18700.00, 5000.00, 13700.00, 6, 2300.00, 3080.00, '2026-08-31', '2026-09-20', NULL, 'Running', '2026-08-31 15:31:25', NULL, NULL, NULL),
(22, '22', 23, 1, 'SAMSUNG A07 (4+64) NEW', 17199.00, 15600.00, 590.00, 16190.00, 'Installment', 19678.00, 4000.00, 15678.00, 6, 2600.00, 3488.00, '2026-09-01', '2026-10-05', NULL, 'Running', '2026-09-01 22:33:14', NULL, NULL, NULL),
(23, '23', 24, 1, 'Redmi A7 Pro (4+64) New', 16999.00, 15505.00, 690.00, 16195.00, 'Installment', 19459.00, 4000.00, 15459.00, 6, 2600.00, 3264.00, '2026-09-01', '2026-10-05', NULL, 'Running', '2026-09-01 22:47:14', NULL, NULL, NULL),
(24, '24', 25, 1, 'SAMSUNG A07 (4+64) NEW', 17199.00, 15600.00, 660.00, 16260.00, 'Installment', 19645.00, 10000.00, 9645.00, 6, 1650.00, 3385.00, '2026-09-03', '2026-10-05', NULL, 'Running', '2026-09-03 23:27:43', NULL, NULL, NULL),
(25, '25', 26, 1, 'Redmi A7 Pro (4+64) New', 16999.00, 15505.00, 690.00, 16195.00, 'Installment', 19459.00, 4000.00, 15459.00, 6, 2650.00, 3264.00, '2026-09-03', '2026-10-05', NULL, 'Running', '2026-09-03 23:33:16', NULL, NULL, NULL),
(26, '26', 27, 1, 'Tecno Spark 50 (6+128) New', 21999.00, 20754.00, 690.00, 21444.00, 'Installment', 26093.00, 5093.00, 21000.00, 6, 3500.00, 4649.00, '2026-09-03', '2026-10-05', NULL, 'Running', '2026-09-05 09:57:28', NULL, NULL, NULL),
(27, '27', 28, 1, 'Honor x7d (8+256) New', 27999.00, 26065.00, 690.00, 26755.00, 'Installment', 31558.00, 8000.00, 23558.00, 6, 4000.00, 4803.00, '2026-09-03', '2026-10-05', NULL, 'Running', '2026-09-05 10:01:02', NULL, NULL, NULL),
(28, '28', 29, 1, 'Realme c85 (6+128)', 21999.00, 20150.00, 175.00, 20325.00, 'Installment', 24332.00, 6332.00, 18000.00, 6, 3000.00, 4007.00, '2026-09-03', '2026-10-05', NULL, 'Running', '2026-09-05 10:04:23', NULL, NULL, NULL),
(29, '29', 30, 1, 'LUMINOUS IPS 1050 EVO D', 10500.00, 9500.00, 20.00, 9520.00, 'Installment', 11683.00, 3550.00, 8133.00, 6, 1400.00, 2163.00, '2026-09-06', '2026-10-05', NULL, 'Running', '2026-09-07 16:12:05', NULL, NULL, 'Daily'),
(30, '30', 31, 1, 'MARCEL FREEZE 176 L MFD-A6C', 35690.00, 29000.00, 120.00, 29120.00, 'Installment', 41044.00, 10000.00, 31044.00, 12, 2600.00, 11924.00, '2026-09-06', '2026-10-05', NULL, 'Running', '2026-09-07 16:16:31', NULL, NULL, NULL);

--
-- Triggers `installment_cards`
--
DELIMITER $$
CREATE TRIGGER `trg_before_insert_installment_cards` BEFORE INSERT ON `installment_cards` FOR EACH ROW BEGIN
  SET NEW.profit = NEW.sale_price - NEW.cost_price;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_update_installment_cards` BEFORE UPDATE ON `installment_cards` FOR EACH ROW BEGIN
  SET NEW.profit = NEW.sale_price - NEW.cost_price;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `installment_files`
--

CREATE TABLE `installment_files` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL,
  `has_cheque` enum('yes','no') DEFAULT 'no',
  `file_received_date` date DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `installment_payments`
--

CREATE TABLE `installment_payments` (
  `id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL,
  `installment_no` int(11) NOT NULL COMMENT 'à§§, à§¨, à§©â€¦',
  `tag` varchar(50) DEFAULT NULL COMMENT 'à¦¯à§‡à¦®à¦¨: à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿, à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ',
  `due_amount` decimal(10,2) DEFAULT NULL,
  `principal_amount` decimal(10,2) DEFAULT NULL,
  `profit_amount` decimal(10,2) DEFAULT NULL,
  `due_date` date NOT NULL,
  `paid_date` date DEFAULT NULL,
  `payment_method` enum('Cash','Bank','Bkash','Nagad','Rocket','Card','Other') NOT NULL DEFAULT 'Cash',
  `receipt_number` varchar(50) DEFAULT NULL,
  `signature` int(11) DEFAULT NULL,
  `status` enum('Unpaid','Paid') DEFAULT 'Unpaid',
  `created_at` datetime DEFAULT NULL,
  `collected_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `installment_payments`
--

INSERT INTO `installment_payments` (`id`, `card_id`, `installment_no`, `tag`, `due_amount`, `principal_amount`, `profit_amount`, `due_date`, `paid_date`, `payment_method`, `receipt_number`, `signature`, `status`, `created_at`, `collected_by`, `updated_at`) VALUES
(1, 1, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 93500.00, 85000.00, 8500.00, '2026-08-08', '2026-08-08', 'Cash', '', NULL, 'Paid', '2026-08-25 13:09:48', NULL, '2026-08-25 07:09:48'),
(2, 1, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 8000.00, 7272.73, 727.27, '2026-09-05', '2026-09-07', 'Cash', NULL, NULL, 'Paid', '2026-08-25 13:09:48', 1, '2026-09-07 15:09:39'),
(3, 1, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 8000.00, 7272.73, 727.27, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 13:09:48', NULL, '2026-08-25 07:09:48'),
(4, 1, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 8000.00, 7272.73, 727.27, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 13:09:48', NULL, '2026-08-25 07:09:48'),
(5, 1, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 8000.00, 7272.73, 727.27, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 13:09:48', NULL, '2026-08-25 07:09:48'),
(6, 1, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 8000.00, 7272.73, 727.27, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 13:09:48', NULL, '2026-08-25 07:09:48'),
(7, 1, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 8000.00, 7272.73, 727.27, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 13:09:48', NULL, '2026-08-25 07:09:48'),
(8, 1, 7, 'à§­à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 8000.00, 7272.73, 727.27, '2027-03-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 13:09:48', NULL, '2026-08-25 07:09:48'),
(9, 1, 8, 'à§®à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 8000.00, 7272.73, 727.27, '2027-04-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 13:09:48', NULL, '2026-08-25 07:09:48'),
(10, 1, 9, 'à§¯à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 8000.00, 7272.73, 727.27, '2027-05-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 13:09:48', NULL, '2026-08-25 07:09:48'),
(11, 1, 10, 'à§§à§¦à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 8000.00, 7272.73, 727.27, '2027-06-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 13:09:48', NULL, '2026-08-25 07:09:48'),
(12, 1, 11, 'à§§à§§à¦¤à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 8000.00, 7272.73, 727.27, '2027-07-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 13:09:48', NULL, '2026-08-25 07:09:48'),
(13, 1, 12, 'à§§à§¨à¦¤à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 5500.00, 5000.00, 500.00, '2027-08-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 13:09:48', NULL, '2026-08-25 07:09:48'),
(14, 3, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 10000.00, 7407.06, 2592.94, '2026-08-11', '2026-08-11', 'Cash', '', NULL, 'Paid', '2026-08-25 16:31:08', NULL, '2026-08-25 10:31:08'),
(15, 3, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2222.12, 777.88, '2026-09-05', '2026-09-06', 'Cash', NULL, NULL, 'Paid', '2026-08-25 16:31:08', 1, '2026-09-06 11:49:09'),
(16, 3, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2222.12, 777.88, '2026-10-05', '2026-09-06', 'Cash', NULL, NULL, 'Paid', '2026-08-25 16:31:08', 1, '2026-09-06 11:49:13'),
(17, 3, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2222.12, 777.88, '2026-11-05', '2026-09-06', 'Cash', NULL, NULL, 'Paid', '2026-08-25 16:31:08', 1, '2026-09-06 11:49:16'),
(18, 3, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2222.12, 777.88, '2026-12-05', '2026-09-06', 'Cash', NULL, NULL, 'Paid', '2026-08-25 16:31:08', 1, '2026-09-06 11:49:20'),
(19, 3, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2222.12, 777.88, '2027-01-05', '2026-09-06', 'Cash', NULL, NULL, 'Paid', '2026-08-25 16:31:08', 1, '2026-09-06 11:49:23'),
(20, 3, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2222.12, 777.88, '2027-02-05', '2026-09-06', 'Cash', NULL, NULL, 'Paid', '2026-08-25 16:31:08', 1, '2026-09-06 11:49:27'),
(21, 3, 7, 'à§­à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2222.12, 777.88, '2027-03-05', NULL, 'Cash', 'à§¨à§¦à§¦à§¦/- à¦Ÿà¦¾à¦•à¦¾ à¦¦à§‡à¦“à§Ÿà¦¾', NULL, 'Unpaid', '2026-08-25 16:31:08', 1, '2026-09-06 11:51:01'),
(22, 3, 8, 'à§®à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2222.12, 777.88, '2027-04-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:31:08', NULL, '2026-08-25 10:31:08'),
(23, 3, 9, 'à§¯à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2222.12, 777.88, '2027-05-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:31:08', NULL, '2026-08-25 10:31:08'),
(24, 3, 10, 'à§§à§¦à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2222.12, 777.88, '2027-06-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:31:08', NULL, '2026-08-25 10:31:08'),
(25, 3, 11, 'à§§à§§à¦¤à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2222.12, 777.88, '2027-07-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:31:08', NULL, '2026-08-25 10:31:08'),
(26, 3, 12, 'à§§à§¨à¦¤à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 148.00, 109.62, 38.38, '2027-08-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:31:08', NULL, '2026-08-25 10:31:08'),
(27, 4, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 3065.00, 2374.01, 690.99, '2026-08-13', '2026-08-13', 'Cash', '', NULL, 'Paid', '2026-08-25 16:39:34', NULL, '2026-08-25 10:39:34'),
(28, 4, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 1500.00, 1161.83, 338.17, '2026-09-05', '2026-09-06', 'Cash', NULL, NULL, 'Paid', '2026-08-25 16:39:34', 290, '2026-09-06 07:11:39'),
(29, 4, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1500.00, 1161.83, 338.17, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:39:34', NULL, '2026-08-26 07:03:26'),
(30, 4, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1500.00, 1161.83, 338.17, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:39:34', NULL, '2026-08-26 07:03:32'),
(31, 4, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1500.00, 1161.83, 338.17, '2026-12-13', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:39:34', NULL, '2026-08-26 07:03:17'),
(32, 4, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 1500.00, 1161.83, 338.17, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:39:34', NULL, '2026-08-26 07:03:43'),
(33, 4, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 1500.00, 1161.83, 338.17, '2027-02-02', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:39:34', NULL, '2026-08-26 07:03:46'),
(40, 2, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 3000.00, 2594.57, 405.43, '2026-08-08', '2026-08-08', 'Cash', '', NULL, 'Paid', '2026-08-25 16:44:44', NULL, '2026-08-25 10:44:44'),
(41, 2, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2291.87, 358.13, '2026-09-05', '2026-09-07', 'Cash', NULL, NULL, 'Paid', '2026-08-25 16:44:44', 290, '2026-09-07 06:23:37'),
(42, 2, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2291.87, 358.13, '2026-10-05', NULL, 'Cash', NULL, NULL, 'Unpaid', '2026-08-25 16:44:44', 215, '2026-09-06 16:13:54'),
(43, 2, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2291.87, 358.13, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:44:44', NULL, '2026-08-25 10:44:44'),
(44, 2, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2291.87, 358.13, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:44:44', NULL, '2026-08-25 10:44:44'),
(45, 2, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2291.87, 358.13, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:44:44', NULL, '2026-08-25 10:44:44'),
(46, 2, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2493.00, 2156.09, 336.91, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:44:44', NULL, '2026-08-25 10:44:44'),
(47, 5, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 8083.00, 6925.98, 1157.02, '2026-08-13', '2026-08-13', 'Cash', '', NULL, 'Paid', '2026-08-25 16:55:02', NULL, '2026-08-25 10:55:02'),
(48, 5, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2999.00, 501.00, '2026-09-05', '2026-09-05', 'Cash', NULL, NULL, 'Paid', '2026-08-25 16:55:02', 1, '2026-09-05 17:56:39'),
(49, 5, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2999.00, 501.00, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:55:02', NULL, '2026-08-25 10:55:02'),
(50, 5, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2999.00, 501.00, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:55:02', NULL, '2026-08-25 10:55:02'),
(51, 5, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2999.00, 501.00, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:55:02', NULL, '2026-08-25 10:55:02'),
(52, 5, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2999.00, 501.00, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:55:02', NULL, '2026-08-25 10:55:02'),
(53, 5, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2999.00, 501.00, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:55:02', NULL, '2026-08-25 10:55:02'),
(54, 6, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 4000.00, 2837.74, 1162.26, '2026-08-15', '2026-08-15', 'Cash', '', NULL, 'Paid', '2026-08-25 16:59:19', NULL, '2026-08-25 10:59:19'),
(55, 6, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 1880.00, 770.00, '2026-09-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:59:19', NULL, '2026-08-25 10:59:19'),
(56, 6, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 1880.00, 770.00, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:59:19', NULL, '2026-08-25 10:59:19'),
(57, 6, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 1880.00, 770.00, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:59:19', NULL, '2026-08-25 10:59:19'),
(58, 6, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 1880.00, 770.00, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:59:19', NULL, '2026-08-25 10:59:19'),
(59, 6, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 1880.00, 770.00, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:59:19', NULL, '2026-08-25 10:59:19'),
(60, 6, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2484.00, 1762.24, 721.76, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 16:59:19', NULL, '2026-08-25 10:59:19'),
(61, 7, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 7000.00, 5987.71, 1012.29, '2026-08-15', '2026-08-15', 'Cash', '', NULL, 'Paid', '2026-08-25 17:08:10', NULL, '2026-08-25 11:08:10'),
(62, 7, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 4250.00, 3635.40, 614.60, '2026-09-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:08:10', NULL, '2026-08-25 11:08:10'),
(63, 7, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 4250.00, 3635.40, 614.60, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:08:10', NULL, '2026-08-25 11:08:10'),
(64, 7, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 4250.00, 3635.40, 614.60, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:08:10', NULL, '2026-08-25 11:08:10'),
(65, 7, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 4250.00, 3635.40, 614.60, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:08:10', NULL, '2026-08-25 11:08:10'),
(66, 7, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 4250.00, 3635.40, 614.60, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:08:10', NULL, '2026-08-25 11:08:10'),
(67, 7, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 4133.00, 3535.31, 597.69, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:08:10', NULL, '2026-08-25 11:08:10'),
(68, 8, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 5083.00, 4114.69, 968.31, '2026-08-18', '2026-08-18', 'Cash', '', NULL, 'Paid', '2026-08-25 17:11:17', NULL, '2026-08-25 11:11:17'),
(69, 8, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2900.00, 2347.55, 552.45, '2026-09-05', '2026-09-01', 'Cash', NULL, NULL, 'Paid', '2026-08-25 17:11:17', 215, '2026-09-01 10:27:19'),
(70, 8, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2900.00, 2347.55, 552.45, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:11:17', NULL, '2026-08-25 11:11:17'),
(71, 8, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2900.00, 2347.55, 552.45, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:11:17', NULL, '2026-08-25 11:11:17'),
(72, 8, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2900.00, 2347.55, 552.45, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:11:17', NULL, '2026-08-25 11:11:17'),
(73, 8, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2900.00, 2347.55, 552.45, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:11:17', NULL, '2026-08-25 11:11:17'),
(74, 8, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2900.00, 2347.55, 552.45, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:11:17', NULL, '2026-08-25 11:11:17'),
(75, 9, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 16268.00, 13356.88, 2911.12, '2026-08-19', '2026-08-19', 'Cash', '', NULL, 'Paid', '2026-08-25 17:15:34', NULL, '2026-08-25 11:15:34'),
(76, 9, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 5000.00, 4105.26, 894.74, '2026-09-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:15:34', NULL, '2026-08-25 11:15:34'),
(77, 9, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 5000.00, 4105.26, 894.74, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:15:34', NULL, '2026-08-25 11:15:34'),
(78, 9, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 5000.00, 4105.26, 894.74, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:15:34', NULL, '2026-08-25 11:15:34'),
(79, 9, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 5000.00, 4105.26, 894.74, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:15:34', NULL, '2026-08-25 11:15:34'),
(80, 9, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 5000.00, 4105.26, 894.74, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:15:34', NULL, '2026-08-25 11:15:34'),
(81, 9, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 5000.00, 4105.26, 894.74, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:15:34', NULL, '2026-08-25 11:15:34'),
(82, 9, 7, 'à§­à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 5000.00, 4105.26, 894.74, '2027-03-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:15:34', NULL, '2026-08-25 11:15:34'),
(83, 9, 8, 'à§®à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 5000.00, 4105.26, 894.74, '2027-04-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:15:34', NULL, '2026-08-25 11:15:34'),
(84, 9, 9, 'à§¯à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 5000.00, 4105.26, 894.74, '2027-05-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:15:34', NULL, '2026-08-25 11:15:34'),
(85, 9, 10, 'à§§à§¦à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 5000.00, 4105.26, 894.74, '2027-06-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:15:34', NULL, '2026-08-25 11:15:34'),
(86, 9, 11, 'à§§à§§à¦¤à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 5000.00, 4105.26, 894.74, '2027-07-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:15:34', NULL, '2026-08-25 11:15:34'),
(87, 9, 12, 'à§§à§¨à¦¤à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 5000.00, 4105.26, 894.74, '2027-08-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:15:34', NULL, '2026-08-25 11:15:34'),
(88, 10, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 4000.00, 3557.16, 442.84, '2026-08-19', '2026-08-19', 'Cash', '', NULL, 'Paid', '2026-08-25 17:20:13', NULL, '2026-08-25 11:20:13'),
(89, 10, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 2045.37, 254.63, '2026-09-05', '2026-09-07', 'Cash', NULL, NULL, 'Paid', '2026-08-25 17:20:13', 1, '2026-09-07 10:38:23'),
(90, 10, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 2045.37, 254.63, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:20:13', NULL, '2026-08-25 11:20:13'),
(91, 10, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 2045.37, 254.63, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:20:13', NULL, '2026-08-25 11:20:13'),
(92, 10, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 2045.37, 254.63, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:20:13', NULL, '2026-08-25 11:20:13'),
(93, 10, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 2045.37, 254.63, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:20:13', NULL, '2026-08-25 11:20:13'),
(94, 10, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2177.00, 1935.99, 241.01, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:20:13', NULL, '2026-08-25 11:20:13'),
(95, 11, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 8083.00, 6906.53, 1176.47, '2026-08-17', '2026-08-17', 'Cash', '', NULL, 'Paid', '2026-08-25 17:23:13', NULL, '2026-08-25 11:23:13'),
(96, 11, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2990.58, 509.42, '2026-09-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:23:13', NULL, '2026-08-25 11:23:13'),
(97, 11, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2990.58, 509.42, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:23:13', NULL, '2026-08-25 11:23:13'),
(98, 11, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2990.58, 509.42, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:23:13', NULL, '2026-08-25 11:23:13'),
(99, 11, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2990.58, 509.42, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:23:13', NULL, '2026-08-25 11:23:13'),
(100, 11, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2990.58, 509.42, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:23:13', NULL, '2026-08-25 11:23:13'),
(101, 11, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2990.58, 509.42, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:23:13', NULL, '2026-08-25 11:23:13'),
(102, 12, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 2155.00, 1907.14, 247.86, '2026-08-18', '2026-08-18', 'Cash', '', NULL, 'Paid', '2026-08-25 17:28:29', NULL, '2026-08-25 11:28:29'),
(103, 12, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 1300.00, 1150.48, 149.52, '2026-09-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:28:29', NULL, '2026-08-25 11:28:29'),
(104, 12, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1300.00, 1150.48, 149.52, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:28:29', NULL, '2026-08-25 11:28:29'),
(105, 12, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1300.00, 1150.48, 149.52, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:28:29', NULL, '2026-08-25 11:28:29'),
(106, 12, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1300.00, 1150.48, 149.52, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:28:29', NULL, '2026-08-25 11:28:29'),
(107, 12, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 1300.00, 1150.48, 149.52, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:28:29', NULL, '2026-08-25 11:28:29'),
(108, 12, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 1300.00, 1150.48, 149.52, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:28:29', NULL, '2026-08-25 11:28:29'),
(109, 13, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 4500.00, 2923.64, 1576.36, '2026-08-18', '2026-08-18', 'Cash', '', NULL, 'Paid', '2026-08-25 17:32:09', NULL, '2026-08-25 11:32:09'),
(110, 13, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2000.00, 1299.39, 700.61, '2026-09-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:32:09', NULL, '2026-08-25 11:32:09'),
(111, 13, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2000.00, 1299.39, 700.61, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:32:09', NULL, '2026-08-25 11:32:09'),
(112, 13, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2000.00, 1299.39, 700.61, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:32:09', NULL, '2026-08-25 11:32:09'),
(113, 13, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2000.00, 1299.39, 700.61, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:32:09', NULL, '2026-08-25 11:32:09'),
(114, 13, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2000.00, 1299.39, 700.61, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:32:09', NULL, '2026-08-25 11:32:09'),
(115, 13, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2000.00, 1299.39, 700.61, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:32:09', NULL, '2026-08-25 11:32:09'),
(116, 14, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 6700.00, 5140.62, 1559.38, '2026-08-20', '2026-08-20', 'Cash', '', NULL, 'Paid', '2026-08-25 17:35:15', NULL, '2026-08-25 11:35:15'),
(117, 14, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2033.23, 616.77, '2026-09-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:35:15', NULL, '2026-08-25 11:35:15'),
(118, 14, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2033.23, 616.77, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:35:15', NULL, '2026-08-25 11:35:15'),
(119, 14, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2033.23, 616.77, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:35:15', NULL, '2026-08-25 11:35:15'),
(120, 14, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2033.23, 616.77, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:35:15', NULL, '2026-08-25 11:35:15'),
(121, 14, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2033.23, 616.77, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:35:15', NULL, '2026-08-25 11:35:15'),
(122, 14, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2033.23, 616.77, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:35:15', NULL, '2026-08-25 11:35:15'),
(123, 15, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 10600.00, 8921.35, 1678.65, '2026-08-22', '2026-08-22', 'Cash', '', NULL, 'Paid', '2026-08-25 17:38:39', NULL, '2026-08-25 11:38:39'),
(124, 15, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 3198.22, 601.78, '2026-09-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:38:39', NULL, '2026-08-25 11:38:39'),
(125, 15, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 3198.22, 601.78, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:38:39', NULL, '2026-08-25 11:38:39'),
(126, 15, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 3198.22, 601.78, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:38:39', NULL, '2026-08-25 11:38:39'),
(127, 15, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 3198.22, 601.78, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:38:39', NULL, '2026-08-25 11:38:39'),
(128, 15, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 3198.22, 601.78, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:38:39', NULL, '2026-08-25 11:38:39'),
(129, 15, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 3198.22, 601.78, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:38:39', NULL, '2026-08-25 11:38:39'),
(130, 15, 7, 'à§­à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 3198.22, 601.78, '2027-03-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:38:39', NULL, '2026-08-25 11:38:39'),
(131, 15, 8, 'à§®à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 3198.22, 601.78, '2027-04-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:38:39', NULL, '2026-08-25 11:38:39'),
(132, 15, 9, 'à§¯à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 3198.22, 601.78, '2027-05-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:38:39', NULL, '2026-08-25 11:38:39'),
(133, 15, 10, 'à§§à§¦à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 3198.22, 601.78, '2027-06-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:38:39', NULL, '2026-08-25 11:38:39'),
(134, 15, 11, 'à§§à§§à¦¤à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 3198.22, 601.78, '2027-07-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:38:39', NULL, '2026-08-25 11:38:39'),
(135, 15, 12, 'à§§à§¨à¦¤à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 3198.22, 601.78, '2027-08-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-25 17:38:39', NULL, '2026-08-25 11:38:39'),
(136, 16, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 5683.00, 4868.33, 814.67, '2026-08-26', '2026-08-26', 'Cash', '', NULL, 'Paid', '2026-08-27 23:08:50', NULL, '2026-08-27 17:08:50'),
(137, 16, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2800.00, 2398.61, 401.39, '2026-09-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:08:50', NULL, '2026-08-27 17:08:50'),
(138, 16, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2800.00, 2398.61, 401.39, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:08:50', NULL, '2026-08-27 17:08:50'),
(139, 16, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2800.00, 2398.61, 401.39, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:08:50', NULL, '2026-08-27 17:08:50'),
(140, 16, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2800.00, 2398.61, 401.39, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:08:50', NULL, '2026-08-27 17:08:50'),
(141, 16, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2800.00, 2398.61, 401.39, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:08:50', NULL, '2026-08-27 17:08:50'),
(142, 16, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2800.00, 2398.61, 401.39, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:08:50', NULL, '2026-08-27 17:08:50'),
(143, 17, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 5000.00, 4297.60, 702.40, '2026-08-27', '2026-08-27', 'Cash', '', NULL, 'Paid', '2026-08-27 23:36:48', NULL, '2026-08-27 17:36:48'),
(144, 17, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 1976.90, 323.10, '2026-09-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:36:48', NULL, '2026-08-27 17:36:48'),
(145, 17, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 1976.90, 323.10, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:36:48', NULL, '2026-08-27 17:36:48'),
(146, 17, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 1976.90, 323.10, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:36:48', NULL, '2026-08-27 17:36:48'),
(147, 17, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 1976.90, 323.10, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:36:48', NULL, '2026-08-27 17:36:48'),
(148, 17, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 1976.90, 323.10, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:36:48', NULL, '2026-08-27 17:36:48'),
(149, 17, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2243.00, 1927.91, 315.09, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:36:48', NULL, '2026-08-27 17:36:48'),
(150, 18, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 7000.00, 5118.94, 1881.06, '2026-08-27', '2026-08-27', 'Cash', '', NULL, 'Paid', '2026-08-27 23:59:40', NULL, '2026-08-27 17:59:40'),
(151, 18, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 1700.00, 1243.17, 456.83, '2026-09-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:59:40', NULL, '2026-08-27 17:59:40'),
(152, 18, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1700.00, 1243.17, 456.83, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:59:40', NULL, '2026-08-27 17:59:40'),
(153, 18, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1700.00, 1243.17, 456.83, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:59:40', NULL, '2026-08-27 17:59:40'),
(154, 18, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1700.00, 1243.17, 456.83, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:59:40', NULL, '2026-08-27 17:59:40'),
(155, 18, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 1700.00, 1243.17, 456.83, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:59:40', NULL, '2026-08-27 17:59:40'),
(156, 18, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 1484.00, 1085.21, 398.79, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-27 23:59:40', NULL, '2026-08-27 17:59:40'),
(164, 19, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 5500.00, 4594.12, 905.88, '2026-08-29', '2026-08-29', 'Cash', '', NULL, 'Paid', '2026-08-29 16:27:19', NULL, '2026-08-29 10:27:19'),
(165, 19, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2200.00, 1837.65, 362.35, '2026-09-01', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-29 16:27:19', NULL, '2026-08-29 10:27:19'),
(166, 19, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2200.00, 1837.65, 362.35, '2026-10-01', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-29 16:27:19', NULL, '2026-08-29 10:27:19'),
(167, 19, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2200.00, 1837.65, 362.35, '2026-11-01', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-29 16:27:19', NULL, '2026-08-29 10:27:19'),
(168, 19, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2200.00, 1837.65, 362.35, '2026-12-01', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-29 16:27:19', NULL, '2026-08-29 10:27:19'),
(169, 19, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2200.00, 1837.65, 362.35, '2027-01-01', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-29 16:27:19', NULL, '2026-08-29 10:27:19'),
(170, 19, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2200.00, 1837.65, 362.35, '2027-02-01', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-29 16:27:19', NULL, '2026-08-29 10:27:19'),
(178, 20, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 9500.00, 7153.47, 2346.53, '2026-08-29', '2026-08-29', 'Cash', '', NULL, 'Paid', '2026-08-31 09:49:08', NULL, '2026-08-31 03:49:08'),
(179, 20, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 2861.39, 938.61, '2026-09-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-31 09:49:08', NULL, '2026-08-31 03:49:08'),
(180, 20, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 2861.39, 938.61, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-31 09:49:08', NULL, '2026-08-31 03:49:08'),
(181, 20, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 2861.39, 938.61, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-31 09:49:08', NULL, '2026-08-31 03:49:08'),
(182, 20, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 2861.39, 938.61, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-31 09:49:08', NULL, '2026-08-31 03:49:08'),
(183, 20, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3800.00, 2861.39, 938.61, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-31 09:49:08', NULL, '2026-08-31 03:49:08'),
(184, 20, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 3532.00, 2659.59, 872.41, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-31 09:49:08', NULL, '2026-08-31 03:49:08'),
(185, 21, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 5000.00, 4176.47, 823.53, '2026-08-31', '2026-08-31', 'Cash', '', NULL, 'Paid', '2026-08-31 15:32:35', NULL, '2026-08-31 09:32:35'),
(186, 21, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 1921.18, 378.82, '2026-09-20', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-31 15:32:35', NULL, '2026-08-31 09:32:35'),
(187, 21, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 1921.18, 378.82, '2026-10-20', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-31 15:32:35', NULL, '2026-08-31 09:32:35'),
(188, 21, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 1921.18, 378.82, '2026-11-20', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-31 15:32:35', NULL, '2026-08-31 09:32:35'),
(189, 21, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 1921.18, 378.82, '2026-12-20', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-31 15:32:35', NULL, '2026-08-31 09:32:35'),
(190, 21, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2300.00, 1921.18, 378.82, '2027-01-20', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-31 15:32:35', NULL, '2026-08-31 09:32:35'),
(191, 21, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2200.00, 1837.65, 362.35, '2027-02-20', NULL, 'Cash', '', NULL, 'Unpaid', '2026-08-31 15:32:35', NULL, '2026-08-31 09:32:35'),
(192, 22, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 4000.00, 3290.98, 709.02, '2026-09-01', '2026-09-01', 'Cash', '', NULL, 'Paid', '2026-09-01 22:35:07', NULL, '2026-09-01 16:35:07'),
(193, 22, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 2139.14, 460.86, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-01 22:35:07', NULL, '2026-09-01 16:35:07'),
(194, 22, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 2139.14, 460.86, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-01 22:35:07', NULL, '2026-09-01 16:35:07'),
(195, 22, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 2139.14, 460.86, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-01 22:35:07', NULL, '2026-09-01 16:35:07'),
(196, 22, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 2139.14, 460.86, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-01 22:35:07', NULL, '2026-09-01 16:35:07'),
(197, 22, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 2139.14, 460.86, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-01 22:35:07', NULL, '2026-09-01 16:35:07'),
(198, 22, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2678.00, 2203.31, 474.69, '2027-03-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-01 22:35:07', NULL, '2026-09-01 16:35:07'),
(199, 23, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 4000.00, 3329.05, 670.95, '2026-09-01', '2026-09-01', 'Cash', '', NULL, 'Paid', '2026-09-01 22:48:15', NULL, '2026-09-01 16:48:15'),
(200, 23, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 2163.88, 436.12, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-01 22:48:15', NULL, '2026-09-01 16:48:15'),
(201, 23, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 2163.88, 436.12, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-01 22:48:15', NULL, '2026-09-01 16:48:15'),
(202, 23, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 2163.88, 436.12, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-01 22:48:15', NULL, '2026-09-01 16:48:15'),
(203, 23, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 2163.88, 436.12, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-01 22:48:15', NULL, '2026-09-01 16:48:15'),
(204, 23, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 2163.88, 436.12, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-01 22:48:15', NULL, '2026-09-01 16:48:15'),
(205, 23, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2459.00, 2046.53, 412.47, '2027-03-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-01 22:48:15', NULL, '2026-09-01 16:48:15'),
(206, 24, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 10000.00, 8276.92, 1723.08, '2026-09-03', '2026-09-03', 'Cash', '', NULL, 'Paid', '2026-09-03 23:29:05', NULL, '2026-09-03 17:29:05'),
(207, 24, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 1650.00, 1365.69, 284.31, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-03 23:29:05', NULL, '2026-09-03 17:29:05'),
(208, 24, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1650.00, 1365.69, 284.31, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-03 23:29:05', NULL, '2026-09-03 17:29:05'),
(209, 24, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1650.00, 1365.69, 284.31, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-03 23:29:05', NULL, '2026-09-03 17:29:05'),
(210, 24, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1650.00, 1365.69, 284.31, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-03 23:29:05', NULL, '2026-09-03 17:29:05'),
(211, 24, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 1650.00, 1365.69, 284.31, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-03 23:29:05', NULL, '2026-09-03 17:29:05'),
(212, 24, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 1395.00, 1154.63, 240.37, '2027-03-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-03 23:29:05', NULL, '2026-09-03 17:29:05'),
(213, 25, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 4000.00, 3329.05, 670.95, '2026-09-03', '2026-09-03', 'Cash', '', NULL, 'Paid', '2026-09-03 23:34:40', NULL, '2026-09-03 17:34:40'),
(214, 25, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2205.50, 444.50, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-03 23:34:40', NULL, '2026-09-03 17:34:40'),
(215, 25, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2205.50, 444.50, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-03 23:34:40', NULL, '2026-09-03 17:34:40'),
(216, 25, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2205.50, 444.50, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-03 23:34:40', NULL, '2026-09-03 17:34:40'),
(217, 25, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2205.50, 444.50, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-03 23:34:40', NULL, '2026-09-03 17:34:40'),
(218, 25, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2650.00, 2205.50, 444.50, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-03 23:34:40', NULL, '2026-09-03 17:34:40'),
(219, 25, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2209.00, 1838.47, 370.53, '2027-03-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-03 23:34:40', NULL, '2026-09-03 17:34:40'),
(220, 26, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 5093.00, 4185.58, 907.42, '2026-09-03', '2026-09-03', 'Cash', '', NULL, 'Paid', '2026-09-05 09:58:17', NULL, '2026-09-05 03:58:17'),
(221, 26, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2876.40, 623.60, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 09:58:17', NULL, '2026-09-05 03:58:17'),
(222, 26, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2876.40, 623.60, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 09:58:17', NULL, '2026-09-05 03:58:17'),
(223, 26, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2876.40, 623.60, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 09:58:17', NULL, '2026-09-05 03:58:17'),
(224, 26, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2876.40, 623.60, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 09:58:17', NULL, '2026-09-05 03:58:17'),
(225, 26, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2876.40, 623.60, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 09:58:17', NULL, '2026-09-05 03:58:17'),
(226, 26, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 3500.00, 2876.40, 623.60, '2027-03-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 09:58:17', NULL, '2026-09-05 03:58:17'),
(227, 27, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 8000.00, 6782.43, 1217.57, '2026-09-03', '2026-09-03', 'Cash', '', NULL, 'Paid', '2026-09-05 10:01:58', NULL, '2026-09-05 04:01:58'),
(228, 27, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 4000.00, 3391.22, 608.78, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 10:01:58', NULL, '2026-09-05 04:01:58'),
(229, 27, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 4000.00, 3391.22, 608.78, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 10:01:58', NULL, '2026-09-05 04:01:58'),
(230, 27, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 4000.00, 3391.22, 608.78, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 10:01:58', NULL, '2026-09-05 04:01:58'),
(231, 27, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 4000.00, 3391.22, 608.78, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 10:01:58', NULL, '2026-09-05 04:01:58'),
(232, 27, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 4000.00, 3391.22, 608.78, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 10:01:58', NULL, '2026-09-05 04:01:58'),
(233, 27, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 3558.00, 3016.49, 541.51, '2027-03-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 10:01:58', NULL, '2026-09-05 04:01:58'),
(234, 28, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 6332.00, 5289.24, 1042.76, '2026-09-03', '2026-09-03', 'Cash', '', NULL, 'Paid', '2026-09-05 10:04:39', NULL, '2026-09-05 04:04:39'),
(235, 28, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2505.96, 494.04, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 10:04:39', NULL, '2026-09-05 04:04:39'),
(236, 28, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2505.96, 494.04, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 10:04:39', NULL, '2026-09-05 04:04:39'),
(237, 28, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2505.96, 494.04, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 10:04:39', NULL, '2026-09-05 04:04:39'),
(238, 28, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2505.96, 494.04, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 10:04:39', NULL, '2026-09-05 04:04:39'),
(239, 28, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2505.96, 494.04, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 10:04:39', NULL, '2026-09-05 04:04:39'),
(240, 28, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 3000.00, 2505.96, 494.04, '2027-03-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-05 10:04:39', NULL, '2026-09-05 04:04:39'),
(241, 29, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 3550.00, 2892.75, 657.25, '2026-09-06', '2026-09-06', 'Cash', '', NULL, 'Paid', '2026-09-07 16:12:59', NULL, '2026-09-07 10:12:59'),
(242, 29, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 1400.00, 1140.80, 259.20, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:12:59', NULL, '2026-09-07 10:12:59'),
(243, 29, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1400.00, 1140.80, 259.20, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:12:59', NULL, '2026-09-07 10:12:59'),
(244, 29, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1400.00, 1140.80, 259.20, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:12:59', NULL, '2026-09-07 10:12:59'),
(245, 29, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 1400.00, 1140.80, 259.20, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:12:59', NULL, '2026-09-07 10:12:59'),
(246, 29, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 1400.00, 1140.80, 259.20, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:12:59', NULL, '2026-09-07 10:12:59'),
(247, 29, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 1133.00, 923.24, 209.76, '2027-03-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:12:59', NULL, '2026-09-07 10:12:59'),
(248, 30, 0, 'à¦¡à¦¾à¦‰à¦¨ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ', 10000.00, 7094.83, 2905.17, '2026-09-06', '2026-09-06', 'Cash', '', NULL, 'Paid', '2026-09-07 16:18:29', NULL, '2026-09-07 10:18:29'),
(249, 30, 1, 'à§§à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 1844.65, 755.35, '2026-10-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:18:29', NULL, '2026-09-07 10:18:29'),
(250, 30, 2, 'à§¨à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 1844.65, 755.35, '2026-11-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:18:29', NULL, '2026-09-07 10:18:29'),
(251, 30, 3, 'à§©à§Ÿ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 1844.65, 755.35, '2026-12-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:18:29', NULL, '2026-09-07 10:18:29'),
(252, 30, 4, 'à§ªà¦°à§à¦¥ à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 1844.65, 755.35, '2027-01-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:18:29', NULL, '2026-09-07 10:18:29'),
(253, 30, 5, 'à§«à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 1844.65, 755.35, '2027-02-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:18:29', NULL, '2026-09-07 10:18:29'),
(254, 30, 6, 'à§¬à¦·à§à¦  à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 1844.65, 755.35, '2027-03-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:18:29', NULL, '2026-09-07 10:18:29'),
(255, 30, 7, 'à§­à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 1844.65, 755.35, '2027-04-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:18:29', NULL, '2026-09-07 10:18:29'),
(256, 30, 8, 'à§®à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 1844.65, 755.35, '2027-05-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:18:29', NULL, '2026-09-07 10:18:29'),
(257, 30, 9, 'à§¯à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 1844.65, 755.35, '2027-06-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:18:29', NULL, '2026-09-07 10:18:29'),
(258, 30, 10, 'à§§à§¦à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 1844.65, 755.35, '2027-07-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:18:29', NULL, '2026-09-07 10:18:29'),
(259, 30, 11, 'à§§à§§à¦¤à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2600.00, 1844.65, 755.35, '2027-08-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:18:29', NULL, '2026-09-07 10:18:29'),
(260, 30, 12, 'à§§à§¨à¦¤à¦® à¦•à¦¿à¦¸à§à¦¤à¦¿', 2444.00, 1733.98, 710.02, '2027-09-05', NULL, 'Cash', '', NULL, 'Unpaid', '2026-09-07 16:18:29', NULL, '2026-09-07 10:18:29');

-- --------------------------------------------------------

--
-- Table structure for table `investment_cards`
--

CREATE TABLE `investment_cards` (
  `id` int(11) NOT NULL,
  `investor_id` int(11) DEFAULT NULL,
  `card_name` varchar(100) DEFAULT NULL,
  `investment_amount` decimal(10,2) DEFAULT NULL,
  `payment_type` enum('onetime','daily','weekly','monthly','flexible','shorttime') DEFAULT 'flexible',
  `start_date` date DEFAULT NULL,
  `maturity_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('running','closed') DEFAULT 'running',
  `created_at` date DEFAULT current_timestamp(),
  `total_time_wighted_value` int(255) DEFAULT NULL,
  `reference_user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `investment_cards`
--

INSERT INTO `investment_cards` (`id`, `investor_id`, `card_name`, `investment_amount`, `payment_type`, `start_date`, `maturity_date`, `end_date`, `status`, `created_at`, `total_time_wighted_value`, `reference_user_id`) VALUES
(1, 1, 'à¦¶à¦¾à¦¹à¦°à¦¿à§Ÿà¦¾à¦° à¦°à§à¦¬à§‡à¦²', 330000.00, 'flexible', '2026-08-01', '2027-08-01', NULL, 'running', '2026-08-25', 4770000, 1);

-- --------------------------------------------------------

--
-- Table structure for table `investment_installments`
--

CREATE TABLE `investment_installments` (
  `id` int(11) NOT NULL,
  `investor_id` int(11) DEFAULT NULL,
  `investment_no` int(11) DEFAULT NULL,
  `investment_date` date DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `signature_by` varchar(100) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `update_reason` varchar(255) DEFAULT NULL,
  `active_days` int(255) DEFAULT NULL,
  `time_wighted_value` int(255) DEFAULT NULL,
  `investment_card_no` int(255) DEFAULT NULL,
  `source_profit_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `investment_installments`
--

INSERT INTO `investment_installments` (`id`, `investor_id`, `investment_no`, `investment_date`, `amount`, `signature_by`, `updated_by`, `updated_at`, `update_reason`, `active_days`, `time_wighted_value`, `investment_card_no`, `source_profit_id`) VALUES
(1, 1, 1, '2026-08-08', 250000.00, '2', NULL, NULL, NULL, 17, 4250000, 1, NULL),
(2, 1, 2, '2026-08-17', 40000.00, '2', NULL, NULL, NULL, 8, 320000, 1, NULL),
(3, 1, 3, '2026-08-20', 40000.00, '2', NULL, NULL, NULL, 5, 200000, 1, NULL);

--
-- Triggers `investment_installments`
--
DELIMITER $$
CREATE TRIGGER `trg_ad_investment_installments` AFTER DELETE ON `investment_installments` FOR EACH ROW BEGIN
    IF OLD.investment_card_no IS NOT NULL THEN
        UPDATE investment_cards ic
        SET
            ic.total_time_wighted_value = (
                SELECT COALESCE(SUM(ii.time_wighted_value), 0)
                FROM investment_installments ii
                WHERE ii.investment_card_no = OLD.investment_card_no
            ),
            ic.investment_amount = (
                SELECT COALESCE(SUM(ii.amount), 0)
                FROM investment_installments ii
                WHERE ii.investment_card_no = OLD.investment_card_no
            )
        WHERE ic.id = OLD.investment_card_no;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_ai_investment_installments` AFTER INSERT ON `investment_installments` FOR EACH ROW BEGIN
    IF NEW.investment_card_no IS NOT NULL THEN
        UPDATE investment_cards ic
        SET
            ic.total_time_wighted_value = (
                SELECT COALESCE(SUM(ii.time_wighted_value), 0)
                FROM investment_installments ii
                WHERE ii.investment_card_no = NEW.investment_card_no
            ),
            ic.investment_amount = (
                SELECT COALESCE(SUM(ii.amount), 0)
                FROM investment_installments ii
                WHERE ii.investment_card_no = NEW.investment_card_no
            )
        WHERE ic.id = NEW.investment_card_no;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_au_investment_installments` AFTER UPDATE ON `investment_installments` FOR EACH ROW BEGIN
    -- à¦ªà§à¦°à§‹à¦¨à§‹ card à¦†à¦ªà¦¡à§‡à¦Ÿ (à¦¯à¦¦à¦¿ card change à¦¹à§Ÿà§‡ à¦¥à¦¾à¦•à§‡)
    IF OLD.investment_card_no IS NOT NULL
       AND OLD.investment_card_no <> NEW.investment_card_no THEN

        UPDATE investment_cards ic
        SET
            ic.total_time_wighted_value = (
                SELECT COALESCE(SUM(ii.time_wighted_value), 0)
                FROM investment_installments ii
                WHERE ii.investment_card_no = OLD.investment_card_no
            ),
            ic.investment_amount = (
                SELECT COALESCE(SUM(ii.amount), 0)
                FROM investment_installments ii
                WHERE ii.investment_card_no = OLD.investment_card_no
            )
        WHERE ic.id = OLD.investment_card_no;

    END IF;

    -- à¦¨à¦¤à§à¦¨ card à¦†à¦ªà¦¡à§‡à¦Ÿ
    IF NEW.investment_card_no IS NOT NULL THEN

        UPDATE investment_cards ic
        SET
            ic.total_time_wighted_value = (
                SELECT COALESCE(SUM(ii.time_wighted_value), 0)
                FROM investment_installments ii
                WHERE ii.investment_card_no = NEW.investment_card_no
            ),
            ic.investment_amount = (
                SELECT COALESCE(SUM(ii.amount), 0)
                FROM investment_installments ii
                WHERE ii.investment_card_no = NEW.investment_card_no
            )
        WHERE ic.id = NEW.investment_card_no;

    END IF;

END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_investments` BEFORE INSERT ON `investment_installments` FOR EACH ROW BEGIN
    -- investment_date à¦¥à¦¾à¦•à¦²à§‡ active_days à¦¹à¦¿à¦¸à¦¾à¦¬ à¦•à¦°à§‹
    IF NEW.investment_date IS NOT NULL THEN
        SET NEW.active_days = DATEDIFF(CURDATE(), NEW.investment_date);
    ELSE
        SET NEW.active_days = 0;
    END IF;

    -- time_wighted_value à¦¹à¦¿à¦¸à¦¾à¦¬ à¦•à¦°à§‹
    IF NEW.amount IS NULL THEN
        SET NEW.time_wighted_value = NEW.active_days * 0;
    ELSE
        SET NEW.time_wighted_value = NEW.active_days * NEW.amount;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_update_investments` BEFORE UPDATE ON `investment_installments` FOR EACH ROW BEGIN
    DECLARE v_status VARCHAR(20);

    -- Card à¦à¦° status à¦¬à§‡à¦° à¦•à¦°à§‹
    IF NEW.investment_card_no IS NOT NULL THEN
        SELECT status
        INTO v_status
        FROM investment_cards
        WHERE id = NEW.investment_card_no
        LIMIT 1;
    ELSE
        SET v_status = NULL;
    END IF;

    -- Card closed à¦¨à¦¾ à¦¹à¦²à§‡ active_days à¦“ time_wighted_value update à¦•à¦°à§‹
    IF v_status IS NULL OR v_status <> 'closed' THEN


        IF NEW.investment_date IS NOT NULL THEN
            SET NEW.active_days = DATEDIFF(CURDATE(), NEW.investment_date);
        ELSE
            SET NEW.active_days = 0;
        END IF;

        IF NEW.amount IS NULL THEN
            SET NEW.time_wighted_value = NEW.active_days * 0;
        ELSE
            SET NEW.time_wighted_value = NEW.active_days * NEW.amount;
        END IF;

    ELSE
        -- Card closed à¦¹à¦²à§‡ à¦†à¦—à§‡à¦° à¦®à¦¾à¦¨ à¦°à§‡à¦–à§‡ à¦¦à¦¾à¦“
        SET NEW.active_days = OLD.active_days;
        SET NEW.time_wighted_value = OLD.time_wighted_value;
    END IF;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `investment_installmentss`
--

CREATE TABLE `investment_installmentss` (
  `id` int(11) NOT NULL,
  `investor_id` int(11) DEFAULT NULL,
  `investment_no` int(11) DEFAULT NULL,
  `investment_date` date DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `signature_by` varchar(100) DEFAULT NULL,
  `active_days` int(255) DEFAULT NULL,
  `time_wighted_value` int(255) DEFAULT NULL,
  `investment_card_no` int(255) DEFAULT NULL,
  `source_profit_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `investment_profit_cards`
--

CREATE TABLE `investment_profit_cards` (
  `id` int(11) NOT NULL,
  `main_card_id` int(11) NOT NULL,
  `amount` decimal(12,2) DEFAULT 0.00,
  `status` enum('running','closed') DEFAULT 'running',
  `total_time_weighted_value` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `investment_profit_installments`
--

CREATE TABLE `investment_profit_installments` (
  `id` int(11) NOT NULL,
  `profit_card_id` int(11) NOT NULL,
  `amount` decimal(12,2) DEFAULT 0.00,
  `investment_date` date NOT NULL,
  `active_days` int(11) DEFAULT 0,
  `time_weighted_value` decimal(15,2) DEFAULT 0.00,
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `investment_profit_installments`
--
DELIMITER $$
CREATE TRIGGER `trg_after_profit_installment` AFTER INSERT ON `investment_profit_installments` FOR EACH ROW BEGIN

    DECLARE card_exists INT DEFAULT 0;

    /* ???? check card exists */
    SELECT COUNT(*) INTO card_exists
    FROM investment_profit_cards
    WHERE id = NEW.profit_card_id;

    /* ???? if card not exists â†’ create card */
    IF card_exists = 0 THEN

        INSERT INTO investment_profit_cards (
            id,
            main_card_id,
            amount,
            status,
            total_time_weighted_value
        )
        VALUES (
            NEW.profit_card_id,
            NEW.profit_card_id,   -- âš ï¸ à¦¤à§‹à¦®à¦¾à¦° structure à¦…à¦¨à§à¦¯à¦¾à§Ÿà§€ change à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à§‹
            0,
            'running',
            0
        );

    END IF;

    /* ???? amount add */
    UPDATE investment_profit_cards
    SET amount = IFNULL(amount,0) + NEW.amount
    WHERE id = NEW.profit_card_id;

    /* ???? weight sum update */
    UPDATE investment_profit_cards ipc
    SET total_time_weighted_value = (
        SELECT IFNULL(SUM(time_weighted_value),0)
        FROM investment_profit_installments
        WHERE profit_card_id = NEW.profit_card_id
    )
    WHERE ipc.id = NEW.profit_card_id;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `investment_withdraw_requests`
--

CREATE TABLE `investment_withdraw_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `investor_id` bigint(20) UNSIGNED NOT NULL,
  `card_id` bigint(20) UNSIGNED NOT NULL,
  `withdraw_date` date NOT NULL,
  `maturity_date` date DEFAULT NULL,
  `requested_at` datetime NOT NULL DEFAULT current_timestamp(),
  `total_profit` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payable_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `mobile` varchar(20) DEFAULT NULL,
  `reason` text NOT NULL,
  `status` enum('pending','rejected','paid') NOT NULL DEFAULT 'pending',
  `requested_by` bigint(20) UNSIGNED NOT NULL,
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `reject_reason` text DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_number` varchar(50) DEFAULT NULL,
  `bank_account_name` varchar(100) DEFAULT NULL,
  `bank_branch` varchar(100) DEFAULT NULL,
  `bank_statement_image` varchar(255) DEFAULT NULL,
  `bkash_number` varchar(20) DEFAULT NULL,
  `nagad_number` varchar(20) DEFAULT NULL,
  `rocket_number` varchar(20) DEFAULT NULL,
  `updated_date` date DEFAULT NULL,
  `updated_time` time DEFAULT NULL,
  `review` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profit_generator`
--

CREATE TABLE `profit_generator` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `investor_id` bigint(20) UNSIGNED NOT NULL,
  `beneficiary_id` bigint(20) DEFAULT NULL,
  `card_id` bigint(20) UNSIGNED NOT NULL,
  `start_date` date NOT NULL,
  `maturity_date` date NOT NULL,
  `weight_value` bigint(20) NOT NULL DEFAULT 0,
  `percent` decimal(10,4) NOT NULL DEFAULT 0.0000,
  `amount` decimal(15,2) NOT NULL COMMENT 'invested amount',
  `profit_amount` decimal(15,4) NOT NULL DEFAULT 0.0000,
  `status` enum('pending','withdraw','auto_reinvest','user_reinvest','forfeited','paid','reinvest') NOT NULL DEFAULT 'pending',
  `profit_month` tinyint(4) NOT NULL,
  `profit_year` smallint(6) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `action_date` datetime DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `original_profit_amount` decimal(15,2) DEFAULT NULL,
  `original_weight_value` decimal(15,2) DEFAULT NULL,
  `original_percent` decimal(15,4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profit_history`
--

CREATE TABLE `profit_history` (
  `id` int(11) NOT NULL,
  `investor_id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL,
  `status` enum('withdraw','reinvest','auto_reinvest') DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `profit_year` int(11) DEFAULT NULL,
  `profit_month` int(11) NOT NULL DEFAULT 0,
  `action_name` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `requested_at` date DEFAULT NULL,
  `decision_at` datetime DEFAULT NULL,
  `decision_by` int(11) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_cards`
--

CREATE TABLE `sales_cards` (
  `id` int(11) NOT NULL,
  `card_number` varchar(50) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `reference_user_id` int(11) DEFAULT NULL,
  `sale_type` enum('Cash','Installment') DEFAULT 'Installment',
  `total_price` decimal(10,2) DEFAULT 0.00,
  `down_payment` decimal(10,2) DEFAULT 0.00,
  `total_due_amount` decimal(10,2) DEFAULT 0.00,
  `installment_count` int(11) DEFAULT 0,
  `per_installment_amount` decimal(10,2) DEFAULT 0.00,
  `profit` decimal(10,2) DEFAULT 0.00,
  `delivery_date` date DEFAULT NULL,
  `first_installment_date` date DEFAULT NULL,
  `status` enum('Running','Fully Paid','Overdue') DEFAULT 'Running',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_items`
--

CREATE TABLE `sales_items` (
  `id` int(11) NOT NULL,
  `sale_card_id` int(11) NOT NULL,
  `product_name` varchar(500) NOT NULL,
  `qty` int(11) DEFAULT 1,
  `purchase_price` decimal(10,2) DEFAULT 0.00,
  `sale_price` decimal(10,2) DEFAULT 0.00,
  `memo` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_credit_ledger`
--

CREATE TABLE `staff_credit_ledger` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `task_id` int(11) DEFAULT NULL,
  `credit_points` int(11) NOT NULL,
  `type` enum('TASK_COMPLETE','BONUS','PENALTY') NOT NULL DEFAULT 'TASK_COMPLETE',
  `note` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_daily_tasks`
--

CREATE TABLE `staff_daily_tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_date` date NOT NULL,
  `due_date` date NOT NULL,
  `staff_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `details` text DEFAULT NULL,
  `status` enum('todo','doing','complete') NOT NULL DEFAULT 'todo',
  `priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
  `credit_points` varchar(50) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` date NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Stock_Inventory`
--

CREATE TABLE `Stock_Inventory` (
  `id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `brand` varchar(50) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `imei1` varchar(50) DEFAULT NULL,
  `imei2` varchar(50) DEFAULT NULL,
  `variant` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `purchase_price` decimal(10,2) DEFAULT NULL,
  `mrp` decimal(10,2) DEFAULT NULL,
  `supplier` varchar(100) DEFAULT NULL,
  `status` enum('available','sold') DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_payment`
--

CREATE TABLE `supplier_payment` (
  `id` int(11) NOT NULL,
  `memo_no` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `shop_name` varchar(100) DEFAULT NULL,
  `supplier` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `paid` decimal(10,2) DEFAULT NULL,
  `due` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `id_number` varchar(50) DEFAULT NULL,
  `id_type` enum('smart_nid','voter_id','birthday_certificate','passport') DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `password` varchar(255) DEFAULT '12345',
  `photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `id_number`, `id_type`, `mobile`, `address`, `start_date`, `password`, `photo`) VALUES
(1, 'SHAHRIYAR RUBEL', '01941145876', 'smart_nid', '01941145876', 'RAFIQ MANZIL, MANGALKATA BAZAR, SUNAMGANJ', '2026-08-01', 'T@Ru122333', 'uploads/rubel_290.webp'),
(2, 'SAIFUR RAHMAN', '5553535302', 'voter_id', '01641295513', 'CHOMAD NAGAR, BONGAW BAZAR, SUNAMGANJ.', '2026-08-08', '12345', 'uploads/saifur_rahman.jpg'),
(3, 'MD HASAN MAHMUD', '6017519148', 'voter_id', '01932873459', 'RAJANAGAR, MANGALKATA, SUNAMGANJ.', '2026-08-08', '12345', 'uploads/md_hasan_mahmud.jpg'),
(4, 'SHOHEL MIAH', '9579384034', 'voter_id', '01601511771', 'KONA GAW, MANGALKATA, SUNAMGANJ', '2026-08-11', '12345', 'uploads/shohel_miah.jpg'),
(5, 'MD ABEDIN', '5553576835', 'voter_id', '01627365584', 'CHOMED NAGAR, MANGALKATA, SUNAMGANJ.', '2026-08-13', '12344', 'uploads/md_abedin.jpg'),
(6, 'OMOR FARUK', '4653601387', 'smart_nid', '01786501061', 'MANGALKATA, SUNAMGANJ SADAR, SUNAMGANJ.', '2026-08-13', '12345', 'uploads/omor_faruk.jpg'),
(7, 'MD SABUJ HAQ', '9576780267', 'smart_nid', '01787821124', 'JORJORIYA, MANGALKATA, SUNAMGANJ.', '2026-08-15', '12345', 'uploads/md_sabuj_haq.jpg'),
(8, 'SHAMIM KAWSAR MASUM', '5506734747', 'smart_nid', '01304435207', 'BAYSARPAR, MANGALKATA, SUNAMGANJ.', '2026-08-15', '12345', 'uploads/shamim_kawsar_masum.jpg'),
(9, 'MD HANNAN MIA', '1918388909', 'smart_nid', '0199825593', 'MANGALKATA, GASIGAW, SUNAMGANJ.', '2026-08-16', '12345', 'uploads/md_hannan_mia.jpg'),
(10, 'MD ABU BOKOR SIDDIK', '8731786755', 'voter_id', '01306366086', 'SAYEDPUR,  MANGALKATA, SUNAMGANJ.', '2026-08-19', '12345', 'uploads/md_abu_bokor_siddik.jpg'),
(11, 'ALI AHAMAD', '6428801531', 'smart_nid', '01712899179', 'NURUJPUR, MANGALKATA, SUNAMGANJ.', '2026-08-19', '12345', 'uploads/ali_ahamad.jpg'),
(12, 'MD AYNAL HAQ', '908933345874', 'voter_id', '01709272586', 'GASIGAW, MANGALKATA, SUNAMGANJ.', '2026-08-17', '12345', 'uploads/md_aynal_haq.jpg'),
(13, 'MD RASEL MIA', '7358594005', 'voter_id', '01621478033', 'KANDIGAW, MANGALKATA, SUNAMGANJ.', '2026-08-18', '12345', 'uploads/md_rasel_mia.jpg'),
(14, 'MD HOSSEN MIA', '5131392838', 'voter_id', '01875532457', 'MANGALKATA, GASIGAW, SUNAMGANJ.', '2026-08-18', '12345', 'uploads/md_hossen_mia.jpg'),
(15, 'SHIPON MIA', '3781582832', 'voter_id', '01960178107', 'JORJORIYA, MANGALKATA, SUNAMGANJ.', '2026-08-20', '12345', 'uploads/shipon_mia.jpg'),
(16, 'ABDUL HAKIM', '5970259130', 'smart_nid', '01716571966', 'MANGALKATA, GASIGAW, SUNAMGANJ.', '2026-08-22', '12345', 'uploads/abdul_hakim.jpg'),
(17, 'DELWAR HOSSAIN', '8706108274', 'smart_nid', '01333142293', 'MANGALKATA, GASIGAW, SUNAMGANJ SADAR, SUNAMGANJ.', '2026-08-26', '12345', 'uploads/delwar_hossain.webp'),
(18, 'MD RAFIQUL ISLAM', '3758510444', 'voter_id', '01309401589', 'KAIYARGAW, MANGALKATA, SUNAMGANJ.', '2026-08-27', '12345', 'uploads/md_rafiqul_islam.jpg'),
(19, 'MST FUL BANU', '9118520676', 'smart_nid', '01406910202', 'RAJANAGAR, MANGALKATA, SUNAMGANJ.', '2026-08-27', '12345', 'uploads/mst_ful_banu.jpg'),
(20, 'TORIQUL ISLAM JEWEL', '8227204', 'smart_nid', '01799119572', 'ALTAB MONJIL, KATA,SUNAMGANJ SADAR, SUNAMGANJ', '2026-08-29', '12345', 'uploads/toriqul_islam_jewel.jpg'),
(21, 'AZIZUR RAHMAN RAIHAN', '5565535498', 'voter_id', '01758227752', 'MONGOLKATA,SUNAMGANJ SADAR,SUNAMGANJ', '2026-08-29', '12345', 'uploads/azizur_rahman_raihan.webp'),
(22, 'RUMI AKTER', '1508501465', 'smart_nid', '01339258353', 'BALIKANDI, MANGALKATA, SUNAMGANJ SADAR.', '2026-08-31', '12345', 'uploads/rumi_akter.jpg'),
(23, 'MD BORHAN UDDIN', '2406080545', 'voter_id', '01727110996', 'MANGALKATA, GHASIGAW, SUNAMGANJ.', '2026-09-01', '12345', 'uploads/md_borhan_uddin.jpg'),
(24, 'MD SUMON MIA', '3767305232', 'voter_id', '01330739340', 'PARBATIPUR, MANGALKATA, SUNAMGANJ.', '2026-09-01', '12345', 'uploads/md_sumon_mia.jpg'),
(25, 'MD ABU SUFIAN', '9167383036', 'voter_id', '01766975246', 'VHOISHARPAR', '2026-09-03', '12345', 'uploads/md_abu_sufian.jpg'),
(26, 'SHSRIYAR RUKON HRIDOY', '4658470770', 'voter_id', '01811347932', 'KONAGON,MONGOL KATA, SUNAMGANJ SADAR,SUNAMGANJ', '2026-09-03', '12345', 'uploads/shsriyar_rukon_hridoy.jpg'),
(27, 'MD JOYDOR MIA', '4169216084', 'smart_nid', '01727488327', 'PARBOTIPUR, MONGOL KATA, SUNAMGANJ SADAR, SUNAMGANJ', '2026-09-03', '12345', 'uploads/md_joydor_mia.jpg'),
(28, 'ABDUL ALI', '4656049600', 'voter_id', '01730202729', 'NARAYANTOLA LOMBAHATI,SUNAMGANJ SADR, SUNAMGANJ', '2026-09-03', '12345', 'uploads/abdul_ali.jpg'),
(29, 'MISBAH AHMED', '1026779775', 'voter_id', '01795439285', 'SOMEDNAGAR BONGOW,MONGOL KATA,SUNAMGANJ, SADSR,SUNAMGANJ', '2026-09-03', '12345', 'uploads/misbah_ahmed.jpg'),
(30, 'ABUL KALAM AZAD', '9130019525', 'voter_id', '01984826575', 'KHAGERGOW, MONGOL KATA, SUNAMGANJ SADAR, SUNAMGANJ', '2026-09-07', '12345', 'uploads/abul_kalam_azad.webp'),
(31, 'MITU AHMED', '3716589738', 'smart_nid', '01757642406', 'ARIN NAGAR, SUNAMGANJ', '2026-09-07', '12345', 'uploads/mitu_ahmed.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('admin','manager','staff','supplier','investor','customer','developer','granter') NOT NULL,
  `assigned_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `user_id`, `role`, `assigned_at`) VALUES
(6, 1, 'manager', '2026-08-25 06:38:03'),
(7, 1, 'investor', '2026-08-25 06:38:12'),
(8, 2, 'customer', '2026-08-25 13:04:13'),
(10, 4, 'customer', '2026-08-25 16:21:02'),
(11, 5, 'customer', '2026-08-25 16:35:32'),
(12, 3, 'customer', '2026-08-25 16:36:15'),
(13, 6, 'customer', '2026-08-25 16:51:28'),
(14, 7, 'customer', '2026-08-25 16:58:17'),
(15, 8, 'customer', '2026-08-25 17:05:52'),
(16, 9, 'customer', '2026-08-25 17:10:00'),
(17, 10, 'customer', '2026-08-25 17:14:39'),
(18, 11, 'customer', '2026-08-25 17:18:50'),
(19, 12, 'customer', '2026-08-25 17:25:48'),
(20, 13, 'customer', '2026-08-25 17:28:50'),
(21, 14, 'customer', '2026-08-25 17:31:24'),
(22, 15, 'customer', '2026-08-25 17:35:11'),
(23, 16, 'customer', '2026-08-25 17:37:13'),
(24, 17, 'customer', '2026-08-27 23:05:43'),
(25, 18, 'customer', '2026-08-27 23:32:39'),
(26, 19, 'customer', '2026-08-27 23:40:21'),
(27, 20, 'customer', '2026-08-29 15:42:41'),
(28, 21, 'customer', '2026-08-29 15:47:39'),
(29, 22, 'customer', '2026-08-31 15:29:01'),
(30, 23, 'customer', '2026-09-01 22:31:12'),
(31, 24, 'customer', '2026-09-01 22:45:07'),
(32, 25, 'customer', '2026-09-03 22:13:48'),
(33, 26, 'customer', '2026-09-03 22:19:42'),
(37, 27, 'customer', '2026-09-05 09:23:09'),
(39, 28, 'customer', '2026-09-05 09:23:14'),
(40, 29, 'customer', '2026-09-05 09:23:19'),
(41, 30, 'customer', '2026-09-07 15:03:57'),
(42, 31, 'customer', '2026-09-07 15:12:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_action_time` (`action`,`created_at`),
  ADD KEY `idx_module_time` (`module`,`created_at`),
  ADD KEY `idx_entity` (`entity_type`,`entity_id`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_session` (`session_id`);

--
-- Indexes for table `cash`
--
ALTER TABLE `cash`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company_expenses`
--
ALTER TABLE `company_expenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer_applications`
--
ALTER TABLE `customer_applications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer_guarantors`
--
ALTER TABLE `customer_guarantors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_primary` (`customer_user_id`,`guarantor_user_id`),
  ADD KEY `idx_customer` (`customer_user_id`),
  ADD KEY `idx_guarantor` (`guarantor_user_id`);

--
-- Indexes for table `daily_installments`
--
ALTER TABLE `daily_installments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employer_attendance`
--
ALTER TABLE `employer_attendance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `installment_cards`
--
ALTER TABLE `installment_cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_customer` (`user_id`),
  ADD KEY `fk_supplier` (`supplier_id`);

--
-- Indexes for table `installment_files`
--
ALTER TABLE `installment_files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `installment_payments`
--
ALTER TABLE `installment_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `card_id` (`card_id`);

--
-- Indexes for table `investment_cards`
--
ALTER TABLE `investment_cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`investor_id`);

--
-- Indexes for table `investment_installments`
--
ALTER TABLE `investment_installments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investment_installmentss`
--
ALTER TABLE `investment_installmentss`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investment_profit_cards`
--
ALTER TABLE `investment_profit_cards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investment_profit_installments`
--
ALTER TABLE `investment_profit_installments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investment_withdraw_requests`
--
ALTER TABLE `investment_withdraw_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_investor` (`investor_id`),
  ADD KEY `idx_card` (`card_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_withdraw_date` (`withdraw_date`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `profit_generator`
--
ALTER TABLE `profit_generator`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `profit_history`
--
ALTER TABLE `profit_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_profit_period` (`investor_id`,`card_id`,`status`,`profit_year`,`profit_month`,`action_name`);

--
-- Indexes for table `sales_cards`
--
ALTER TABLE `sales_cards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_items`
--
ALTER TABLE `sales_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_card_id` (`sale_card_id`);

--
-- Indexes for table `staff_credit_ledger`
--
ALTER TABLE `staff_credit_ledger`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_task_award` (`task_id`,`type`),
  ADD KEY `idx_staff_date` (`staff_id`,`created_at`);

--
-- Indexes for table `staff_daily_tasks`
--
ALTER TABLE `staff_daily_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_staff_due` (`staff_id`,`due_date`),
  ADD KEY `idx_staff_status` (`staff_id`,`status`),
  ADD KEY `idx_task_date` (`task_date`);

--
-- Indexes for table `Stock_Inventory`
--
ALTER TABLE `Stock_Inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `imei1` (`imei1`),
  ADD UNIQUE KEY `imei2` (`imei2`);

--
-- Indexes for table `supplier_payment`
--
ALTER TABLE `supplier_payment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nid` (`id_number`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_user_role` (`user_id`,`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=225;

--
-- AUTO_INCREMENT for table `cash`
--
ALTER TABLE `cash`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `company_expenses`
--
ALTER TABLE `company_expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_applications`
--
ALTER TABLE `customer_applications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_guarantors`
--
ALTER TABLE `customer_guarantors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `daily_installments`
--
ALTER TABLE `daily_installments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `employer_attendance`
--
ALTER TABLE `employer_attendance`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `installment_cards`
--
ALTER TABLE `installment_cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `installment_files`
--
ALTER TABLE `installment_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `installment_payments`
--
ALTER TABLE `installment_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=261;

--
-- AUTO_INCREMENT for table `investment_cards`
--
ALTER TABLE `investment_cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `investment_installments`
--
ALTER TABLE `investment_installments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `investment_installmentss`
--
ALTER TABLE `investment_installmentss`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `investment_profit_cards`
--
ALTER TABLE `investment_profit_cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `investment_profit_installments`
--
ALTER TABLE `investment_profit_installments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `investment_withdraw_requests`
--
ALTER TABLE `investment_withdraw_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profit_generator`
--
ALTER TABLE `profit_generator`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profit_history`
--
ALTER TABLE `profit_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales_cards`
--
ALTER TABLE `sales_cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales_items`
--
ALTER TABLE `sales_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff_credit_ledger`
--
ALTER TABLE `staff_credit_ledger`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff_daily_tasks`
--
ALTER TABLE `staff_daily_tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `Stock_Inventory`
--
ALTER TABLE `Stock_Inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_payment`
--
ALTER TABLE `supplier_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `installment_payments`
--
ALTER TABLE `installment_payments`
  ADD CONSTRAINT `installment_payments_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `installment_cards` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales_items`
--
ALTER TABLE `sales_items`
  ADD CONSTRAINT `sales_items_ibfk_1` FOREIGN KEY (`sale_card_id`) REFERENCES `sales_cards` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

