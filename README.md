Clone the project to local,<br />
Run the below command from project root directory to install all dependencies <br />
>npm install

# Instructions to populate database table:
Required database software: **MySQL**

This project uses *db_migrate* package to populate database tables.<br />
Please open the command prompt in *test_db* location in the project root directory.<br />
Type the command below,<br />
> db-migrate up <br />
Please note that we need to create a databse named **test** prior to run the above command.<br />
This essentially creates required table in MySQL database.<br />
Make sure that database defined in *database.json*(under test_db folder) points to target db.

# config.json
Specifies all the development config settings which are mysql connection settings, jwt_secret, etc,.
We can also add other environments to it like stage, prod.

# utils
All the utility modules available here, like logger, mysql connections, settings, etc,.

# To run the unit tests:
From the project root directory run the below command,
>npm test

# To run the application:
From the project root directory run the below command,
>node app.js


This project is aimed to,
1. register new users (accepts route '/user/register' with username, password, firstname, lastname, email as payload).
2. login with existing user (accepts route '/user/login' with username, password as payload).
