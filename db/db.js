const mysql = require("mysql2");
const config = require('../config/config');

const dbConnection = {
  db: mysql.createPool({
    host:config.db.host ,
    user: config.db.user,
    password: config.db.password,
    database: config.db.schema,
  }),
};

// host: "localhost",
// user: "root",
// password: "admin123",
// database: "new_schema",
//sudo systemctl restart docker.socket docker.service
//sudo chmod 666 /var/run/docker.sock //docker-entrypoint.sh
module.exports = {
  dbConnection,
};
//ssh -i "ec2.pem" ubuntu@ec2-54-191-32-49.us-west-2.compute.amazonaws.com

// CREATE TABLE `test_db`.`new_table` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `userImg` VARCHAR(255) NULL,
//   `uploadedTime` VARCHAR(45) NULL,
//   PRIMARY KEY (`id`));
