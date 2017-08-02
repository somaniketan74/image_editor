<h2>Image editor</h2>

This repo contains the code for a Image upload,rotate,scale:

<ul>
<li>Mysql</li>
<li>Express</li>
<li>AngularJS</li>
<li>NodeJS</li>
</ul>

<h3>Instructions</h3>

Required package

	1. Mysql
	2. Node
	3. Npm
	4. Bower

simply clone this repo using 

    git clone git@github.com:somaniketan74/image_editor.git

Steps to use project:

	1. npm install
	2. change directory to /public
	3. bower install
	4. Return to main directory
	4. create database 'image' in mysql
	5. create following table in mysql

		CREATE TABLE image_history (
		    ID int NOT NULL AUTO_INCREMENT,
		    Image json,
		    Created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		    PRIMARY KEY (ID)
		);

	6. Change db_connection.js config according to system.
	7. npm start (Start server)


<h3>Have fun!</h3>

If you have any questions, feel free to leave a comment and I will try to help if I can!
