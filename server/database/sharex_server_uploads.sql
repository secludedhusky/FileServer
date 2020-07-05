DROP TABLE IF EXISTS `uploads`;
CREATE TABLE `uploads` (
  `id` varchar(50) NOT NULL,
  `upload_path` text NOT NULL,
  `upload_user` varchar(255) NOT NULL,
  `upload_filename` varchar(255) NOT NULL,
  `upload_mime` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `upload_id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;