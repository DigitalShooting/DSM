-- Adminer 4.2.2 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

CREATE TABLE `manschaft` (
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vereinID` int(11) NOT NULL,
  `saisonID` int(11) NOT NULL,
  `note` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `memberIn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `manschaftID` int(11) NOT NULL,
  `stamm` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userID_manschaftID` (`userID`,`manschaftID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `rwk` (
  `manschaftHeim` int(11) NOT NULL,
  `manschaftGast` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL DEFAULT '0000-00-00',
  `saisonID` int(11) NOT NULL,
  `note` text COLLATE utf8_unicode_ci NOT NULL,
  `done` tinyint(1) unsigned zerofill NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `saison` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `note` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `session` (
  `id` tinytext COLLATE utf8_unicode_ci NOT NULL,
  `sessionGroupID` tinytext COLLATE utf8_unicode_ci NOT NULL,
  `part` text COLLATE utf8_unicode_ci NOT NULL,
  `unixtime` bigint(20) NOT NULL,
  PRIMARY KEY (`id`(20),`sessionGroupID`(20))
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `sessionGroup` (
  `id` tinytext COLLATE utf8_unicode_ci NOT NULL,
  `disziplin` tinytext COLLATE utf8_unicode_ci NOT NULL,
  `unixtime` bigint(20) NOT NULL,
  `userID` int(11) NOT NULL,
  `line` tinytext COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`(20))
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `shot` (
  `number` int(11) NOT NULL,
  `sessionID` tinytext COLLATE utf8_unicode_ci NOT NULL,
  `serie` int(11) NOT NULL,
  `ring` double NOT NULL,
  `ringValue` double NOT NULL,
  `teiler` double NOT NULL,
  `winkel` double NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `unixtime` bigint(20) NOT NULL,
  `id` int(11) NOT NULL,
  PRIMARY KEY (`number`,`sessionID`(20)),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `shotIn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `rwkID` int(11) NOT NULL,
  `ersatz` tinyint(1) NOT NULL,
  `gast` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userID_rwkID_gast` (`userID`,`rwkID`,`gast`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


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


CREATE TABLE `verein` (
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `note` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- 2016-02-03 16:17:07
