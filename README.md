# Admin Management System

# Project functionalities :
# Description :
* Admin should have the following details to be displayed.
* New clients (mail id and mobile number,state with status “new”- data entered on current date, address check(inside this link, display client address(dummy address any))
* Existing clients (mail id, mobile number,state with status “existing” – data entered on previous date,address check (inside this link, display client address(dummy address any))
* Create roles based on super admin, Kyc admin, Agent privileges 
* Super admin can have all privileges, can view, can edit, can delete all the data
* Kyc admin can view and edit but can’t delete data.
* Agent can view the data and click on address check option to check whether the client entered the address or not.

# Role privileges:
* Super admin can create N number of kyc admins and agents
* KYC admin can create N number of agents along with access to check the address details
* Kyc admin can check how may agents have checked how many forms
* In agent login, when an agent first click the “address check”, that client is picked by that particular agent and it shouldn’t be available for check, but can be displayed as: “picked by this agent(agent name or id)” for other agents.
* Super admin and kyc admin can get to know who have checked the form and at what time they checked.
* The details should be exported as CSV by super admin and kyc admin.

# Tools and Technologies used
* Python 
* Django
* Javascript
* Html
* CSS
* MdBootstrap 
* Jquery
* Postgres
* Version control - Git , Code Repository - Github
* IDE - PyCharm

# Requirements to run this project locally
* Clone the project
* Install all the requirements which are mentioned in the requirements.txt file . You can ignore some unnecessary requirements according  to your local environment variable. 
* Install Postgres locally.
* Create a database in your local.
* Add the database properties in settings.py file.
* Then apply makemigrations and migrate to propagate/see the changes in your database.

# Architecture Applied
* MVT - Model View Template
* Model - Used to create databases.
* View - Used  to create server side business logic ( Used try - except method for server side exception handling)
* Template - Used to represent the data on the client side.

# Database connection with project
Installed PostgreSql_psycopg2 to connect the django engine to the database.
Few connection strings added such as Database name,Username,Password,Host,Port to establish connection database.


