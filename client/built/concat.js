angular.module("ChatApp").controller("HomeCtrl", ["$scope", "$http", "$location", "socket", "$rootScope",
    function($scope, $http, $location, socket, $rootScope) {


        $scope.nickId = '';
        $scope.loggedIn = false;
        $scope.errorMessage = '';
        $scope.login_error = false;


        $scope.login = function() {
            if ($scope.nickId === '') {
                $scope.loggedIn = false;
                $scope.login_error = true;
                $scope.errorMessage = 'Please enter nickname';
                return;
            }

            socket.emit("adduser", $scope.nickId, function(available) {
                if (available) {
                    $scope.loggedIn = true;
                    $location.path('/rooms/' + $scope.nickId);
                } else {
                    $scope.loggedIn = false;
                    $scope.login_error = true;
                    $scope.errorMessage = 'This nickname is unavailable';
                }
            });
        };
    }
]);
;angular.module("ChatApp").controller("RoomCtrl", ["$scope", "$http", "$routeParams", "$location", "socket", "$rootScope",


    function($scope, $http, $routeParams, $location, socket, $rootScope) {

        $scope.roomId = $routeParams.roomId;
        $scope.nickId = $routeParams.nickId;
        $scope.nicks = [];
        $scope.submitMessage = '';
        $scope.messages = [];
        $scope.topic = '';
        $scope.userSelected = false;
        $scope.nickSelected = '';
        $scope.pmMessages = {};
        $scope.pmUnreadFrom = [];
        $scope.pmSubmitMessage = '';
        $scope.isop = false;
        $scope.nickSelect = '';
        $scope.topicToChange = '';
        $scope.pwToChange = '';
        $scope.glued = true;

        joinRoom();

        function joinRoom() {
            if ($routeParams.locked == 'true') {
                alertify.set({
                    labels: {
                        ok: "Join",
                        cancel: "Cancel"
                    }
                });
                alertify.prompt("Password: ",
                    function(evt, value) {
                        sendJoinRoomRequest($scope.roomId, value);
                    });
            } else {
                sendJoinRoomRequest($scope.roomId, undefined);
            }
        }

        function sendJoinRoomRequest(roomId, password) {
            socket.emit('joinroom', {
                room: roomId,
                pass: password
            }, function(success, reason) {
                if (!success) {
                    if (reason === 'banned') {
                        $location.path('/rooms/' + $scope.nickId);
                        alertify.alert("You are banned from this room");
                    } else if (reason === "wrong password") {
                        $location.path('/rooms/' + $scope.nickId);
                        alertify.alert("Wrong password!");
                    }
                }
            });
        }

        socket.on('updateusers', function(roomId, nicksId, ops) {

            if ($scope.roomId === roomId) {
                $scope.isop = (ops[$scope.nickId] !== undefined);
                $scope.nicks = nicksId;
                for (var nick in $scope.nicks) {
                    $scope.pmUnreadFrom[nick] = false;
                }
            }
        });


        $scope.sendMSG = function() {

            if ($scope.submitMessage === '') {
                //skip empty text
            } else {
                socket.emit('sendmsg', {
                    roomName: $scope.roomId,
                    msg: $scope.submitMessage
                });
            }

            $scope.submitMessage = '';

        };

        $scope.sendPmMSG = function() {
            if ($scope.pmSubmitMessage === '') {
                // Do nothing.
            } else {
                console.log($scope.pmSubmitMessage);
                socket.emit('privatemsg', {
                    nick: $scope.nickSelected,
                    message: $scope.pmSubmitMessage
                }, function(success) {
                    if (success) {
                        if ($scope.pmMessages[$scope.nickSelected] === undefined) {
                            $scope.pmMessages[$scope.nickSelected] = [];
                        }
                        $scope.pmMessages[$scope.nickSelected].push({
                            sender: $scope.nickId,
                            message: $scope.pmSubmitMessage,
                            timestamp: currentTime()
                        });
                        $scope.pmSubmitMessage = '';
                    } else {
                        if ($scope.pmMessages[$scope.nickSelected] === undefined) {
                            $scope.pmMessages[$scope.nickSelected] = [];
                        }
                        $scope.pmMessages[$scope.nickSelected].push({
                            sender: "server",
                            message: "Failed to send message"
                        });
                    }
                });
            }
        };

        socket.on('recv_privatemsg', function(username, message) {
            if ($scope.pmMessages[username] === undefined) {
                $scope.pmMessages[username] = [];
            }
            $scope.pmMessages[username].push({
                sender: username,
                message: message,
                timestamp: currentTime()
            });
            if ($scope.nickSelected !== username) {
                $scope.pmUnreadFrom[username] = true;
            }
            if ($scope.userSelected === false) {
                $scope.showPmBox(username);
            }
        });

        $scope.partRoom = function() {

            var message = 'has left the room';

            socket.emit('sendmsg', {
                roomName: $scope.roomId,
                msg: message
            });
            socket.emit('partroom', $scope.roomId);

            $location.path('/rooms/' + $scope.nickId);


        };

        socket.on('updatechat', function(roomId, msgHistory) {
            if (roomId === $scope.roomId) {
                $scope.messages = [];
                for (var i = 0; i < msgHistory.length; i++) {
                    var msgd = new Date(msgHistory[i].timestamp);
                    $scope.messages.push({
                        nick: msgHistory[i].nick,
                        message: msgHistory[i].message,
                        timestamp: parseTimeStampToString(msgd)
                    });
                    console.log(JSON.stringify($scope.messages[i]));
                }
            }
        });

        //A beautiful function that parses the server date format to our date format as we did not want to change the server implementation
        function parseTimeStampToString(date) {
            var datestring;
            var hours = (date.getUTCHours() > 9) ? date.getUTCHours() : ("0" + date.getUTCHours());
            var minutes = (date.getUTCMinutes() > 9) ? date.getUTCMinutes() : ("0" + date.getUTCMinutes());
            var seconds = (date.getUTCSeconds() > 9) ? date.getUTCSeconds() : ("0" + date.getUTCSeconds());
            datestring = hours + ":" + minutes + ":" + seconds;
            return datestring;
        }

        socket.on('updatetopic', function(roomId, topic) {
            if (roomId === $scope.roomId) {
                $scope.topic = topic;
            }
        });



        $scope.showPmBox = function(nick) {
            if ($scope.nickId === nick) {
                return;
            }
            if ($scope.nickSelected != nick) {
                $scope.nickSelected = nick;
                $scope.userSelected = true;
                $scope.pmUnreadFrom[nick] = false;
            } else {
                $scope.userSelected = false;
                $scope.nickSelected = '';
                $scope.pmUnreadFrom[nick] = false;
            }
        };

        $scope.selectOrders = function(value, nick) {
            if (value === 'kick') {
                var message = 'has kicked ' + nick;

                socket.emit('sendmsg', {
                    roomName: $scope.roomId,
                    msg: message
                });
            }
            socket.emit(value, {
                room: $scope.roomId,
                user: nick
            }, function(success) {});

        };

        socket.on('kicked', function(roomId, nickId, user) {
            if ($scope.roomId === roomId && $scope.nickId === nickId) {
                $location.path('/rooms/' + $scope.nickId);
                $scope.roomId = '';
                alertify.error('You have been kicked from ' + roomId);
            }
            if ($scope.nickId === user) {


            }
        });

        socket.on('banned', function(roomId, nickId, user) {
            if ($scope.roomId === roomId && $scope.nickId === nickId) {
                $location.path('/rooms/' + $scope.nickId);
                //$scope.roomId = '';
                alertify.error('You have been banned from ' + roomId, 0);
            }
            if ($scope.nickId === user) {
                var message = 'has banned ' + nickId;

                socket.emit('sendmsg', {
                    roomName: $scope.roomId,
                    msg: message
                });
            }


        });

        socket.on('opped', function(roomId, nickId, user) {
            if ($scope.roomId === roomId && $scope.nickId === nickId) {
                alertify.success('You are now op');
            }
            if ($scope.nickId === user) {
                var message = 'has opped ' + nickId;
                socket.emit('sendmsg', {
                    roomName: $scope.roomId,
                    msg: message
                });
            }
        });

        socket.on('deopped', function(roomId, nickId, user) {
            if ($scope.roomId === roomId && $scope.nickId === nickId) {
                alertify.error('You have been deopped');

            }
            if ($scope.nickId === user) {
                var message = 'has deopped ' + nickId;
                socket.emit('sendmsg', {
                    roomName: $scope.roomId,
                    msg: message
                });
            }


        });

        $scope.changeTopic = function() {

            if ($scope.topicToChange === '') {

            } else {
                socket.emit('settopic', {
                    room: $scope.roomId,
                    topic: $scope.topicToChange
                });
                $scope.topicToChange = '';
            }

        };

        $scope.changePassword = function() {


            if ($scope.pwToChange === '') {

            } else {
                socket.emit('setpassword', {
                    room: $scope.roomId,
                    password: $scope.pwToChange
                });
                alertify.success('Password changed to: ' + $scope.pwToChange);
                $scope.pwToChange = '';

            }


        };

        $scope.removePassword = function() {

            socket.emit('removepassword', {
                room: $scope.roomId
            }, function(success) {
                if (success) {
                    alertify.success('Password removed');

                }
            });
        };

        function currentTime() {
            moment.locale("is");
            var date = moment().format('LTS');
            return date;
        };



        $scope.orders = [{
            value: 'op',
            label: 'Give Op'
        }, {
            value: 'deop',
            label: 'De Op'
        }, {
            value: 'kick',
            label: 'Kick'
        }, {
            value: 'ban',
            label: 'Ban'
        }];
    }
]);
;angular.module("ChatApp").controller("RoomsCtrl", ["$scope", "$http", "$routeParams", "$location", "socket", "$rootScope",

    function($scope, $http, $routeParams, $location, socket, $rootScope) {

        $scope.nickId = $routeParams.nickId;

        $scope.roomId = '';
        $scope.rooms = [];
        $scope.errorMessage = '';
        $scope.create_error = false;

        $scope.newRoom = function() {
            if ($scope.roomId === '') {
                $scope.errorMessage = "Please enter room name";
                $scope.create_error = true;
            } else if ($scope.rooms[$scope.roomId] !== undefined) {
                $scope.errorMessage = "The room name " + $scope.roomId + " is already taken";
                $scope.create_error = true;
            } else {
                socket.emit('createroom', {
                    room: $scope.roomId
                }, function(success, reason) {
                    if (success) {
                        $location.path('/rooms/' + $scope.nickId + '/' + $scope.roomId).search({
                            locked: false
                        });
                    }
                });
            }
        };

        socket.on("roomlist", function(data) {
            $scope.rooms = data;
            $scope.roomlist = [];
            $.each($scope.rooms, function(key, value) {
                $scope.roomlist.push({
                    name: key,
                    locked: value.locked,
                    size: Object.keys(value.users).length
                });
            });
        });

        socket.emit('rooms');

    }
]);
;angular.module('ChatApp', ["ng", "ngRoute", 'luegg.directives']);
;angular.module("ChatApp").config(function($routeProvider) {
    $routeProvider.when("/home/login", {
        templateUrl: "/views/home.html",
        controller: "HomeCtrl"
    }).when("/rooms/:nickId", {
        templateUrl: "/views/rooms.html",
        controller: "RoomsCtrl",
    }).when("/rooms/:nickId/:roomId", {
        templateUrl: "/views/room.html",
        controller: "RoomCtrl"
    }).otherwise({
        redirectTo: "home/login"
    });

});
;// Factory to wrap around the socket functions
// Borrowed from Brian Ford
// http://briantford.com/blog/angular-socket-io.html
angular.module("ChatApp").factory('socket', ['$rootScope',
    function($rootScope) {
        var socket = io.connect('http://localhost:8080');
        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            },
            getSocket: function() {
                return socket;
            }
        };
    }
]);