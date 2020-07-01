DROP TABLE IF EXISTS `errors`;
CREATE TABLE `errors` (
  `id` int(11) NOT NULL,
  `error_message` varchar(500) NOT NULL,
  `error_data` json NOT NULL,
  `error_date` varchar(45) NOT NULL,
  `error_class` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
