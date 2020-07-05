DROP TABLE IF EXISTS `uploads`;
CREATE TABLE `uploads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `upload_id` varchar(36) NOT NULL,
  `upload_path` text NOT NULL,
  `upload_user` varchar(255) NOT NULL,
  `upload_filename` varchar(255) NOT NULL,
  `upload_mime` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `upload_id_UNIQUE` (`upload_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
