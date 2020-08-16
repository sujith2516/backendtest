/* This initial script assumes the schema is already created */
-- user table
create table user (
	id varchar(36) NOT NULL,
	username varchar(50) NOT NULL UNIQUE,
	password varchar(255) NOT NULL,
	firstname varchar(100),
	lastname varchar(100),
    email varchar(300) NOT NULL,
	createddate datetime,
	PRIMARY KEY (id)
);
