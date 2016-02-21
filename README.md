# Angular-Chat
Web based chat application with angular.

## What is needed 
* node.js & python version 2.7

## Installation
* Run setup script in the rootfolder. 
* Setup script installs all dependencies & dev dependencies for the Chatserver.

## Running the application
* Run these scripts start-server & start-client in the rootfolder.
* Then use your browser and go to this url http://localhost:8000/ to use the chat application.

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
look up variables in an undefined variable and crashing the server. (This change should not have changed
any functionality except in cases were the server would have crashed).
