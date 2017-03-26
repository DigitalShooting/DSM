-- Adminer 4.2.5 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `manschaft`;
CREATE TABLE `manschaft` (
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `note` text COLLATE utf8_unicode_ci NOT NULL,
  `anzahlSchuetzen` int(5) NOT NULL DEFAULT '4',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `lastName` text COLLATE utf8_unicode_ci NOT NULL,
  `firstName` text COLLATE utf8_unicode_ci NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `undef8` text COLLATE utf8_unicode_ci NOT NULL,
  `vereinID` int(11) NOT NULL,
  `note` text COLLATE utf8_unicode_ci NOT NULL,
  `undef0` text COLLATE utf8_unicode_ci NOT NULL,
  `undef1` text COLLATE utf8_unicode_ci NOT NULL,
  `undef2` text COLLATE utf8_unicode_ci NOT NULL,
  `undef3` text COLLATE utf8_unicode_ci NOT NULL,
  `undef4` text COLLATE utf8_unicode_ci NOT NULL,
  `undef5` text COLLATE utf8_unicode_ci NOT NULL,
  `undef6` text COLLATE utf8_unicode_ci NOT NULL,
  `undef7` text COLLATE utf8_unicode_ci NOT NULL,
  `passnummer` text COLLATE utf8_unicode_ci NOT NULL,
  `undef9` text COLLATE utf8_unicode_ci NOT NULL,
  `undef10` text COLLATE utf8_unicode_ci NOT NULL,
  `undef11` text COLLATE utf8_unicode_ci NOT NULL,
  `undef12` text COLLATE utf8_unicode_ci NOT NULL,
  `undef13` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `verein`;
CREATE TABLE `verein` (
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `note` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- 2017-03-26 23:06:34
