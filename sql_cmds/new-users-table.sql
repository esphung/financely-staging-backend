CREATE TABLE users (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, username varchar(25) NOT NULL, password varchar(30) NOT NULL, created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated timestamp DEFAULT NOW() ON UPDATE NOW());
