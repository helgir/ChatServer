# Angular-Chat
Web based chat application with angular.

## What is needed
* node.js & python version 2.7.11

Download NodeJs: https://nodejs.org/en/download/

Download Python: https://www.python.org/downloads/

Known Issues: if you are installing python 2.7.11 on windows the add Python to system path is not checked by default, you can either check it during the install or set the system path variable manually.

## Installation
Open the terminal and run the following command to install dependencies:
```
sudo ./setup
```

## Setup
Before we can run the application we must generate the minified and concatenated version of the javascript files by running the following terminal command:
```
gulp
```

## Running the application
To start the client run the following terminal command:
```
./start-client
```
And then start the server by running the following terminal command:
```
./start-server
```
You should now be able to use the application by opening http://localhost:8000/ in your prefered browser (we used chrome and firefox).

## Changes made to chatserver.js
* Ran jsbeautifier on it to improve readability
* Modified the previous implementation so that the room user list is a list of all online users
and operators, and then the ops list lists all the operators of the room so even if they go offline
they keep their operator status.
* Split joinroom into createroom and joinroom (I did this so that when a two users try to create the
same room at around the same time the one who created it later will get a message saying the name is
already taken instead of joining the room).
* Added a line in create room so that the servers updates the roomlist for the clients.
* Refactored code in the room class to not use the ternary operator because JSHint didn't like it.
* Added if statements around methods to check if variables where undefined to avoid having the server
look up variables in an undefined variable and crashing the server. (This change should not have changed any functionality except in cases were the server would have crashed).
