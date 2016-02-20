angular.module("ChatApp").controller("RoomCtrl", ["$scope", "$http", "$routeParams", "$location", "socket", "$rootScope",


    function($scope, $http, $routeParams, $location, socket, $rootScope) {

        $scope.roomId = $routeParams.roomId;
        $scope.nickId = $routeParams.nickId;
        $scope.nicks = [];
        $scope.submitMessage = '';
        $scope.messages = [];
        $scope.topic = '';
        $scope.userSelected = false;
        $scope.nickSelected = '';
        $scope.pmMessages = [];
        $scope.pmSubmitMessage = '';
        $scope.isop = false;
        $scope.nickSelect = '';
        $scope.topicToChange = '';
        $scope.pwToChange = '';
        $scope.glued = true;

        joinRoom();
		
		function joinRoom() {
			if($routeParams.locked == 'true') {
				alertify.set({
					labels: {
						ok: "Join",
						cancel: "Cancel"
					}
				});
				alertify.prompt("Password: ",
					function(evt, value){
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
            if($scope.pmSubmitMessage  === '') {
                // Do nothing.
            }
            else {
                console.log($scope.pmSubmitMessage);
                socket.emit('privatemsg', { nick: $scope.nickSelected, message: $scope.pmSubmitMessage }, function (success) {});
                 var pm = {
                        sender : $scope.nickId,
                        message : $scope.pmSubmitMessage,
                        receiver : $scope.nickSelected
                };
                $scope.pmMessages.push(pm);
                $scope.pmSubmitMessage = '';
                  
            }

        };

        socket.on('recv_privatemsg', function(username, message) {
            
                var pm = {
                        sender : username,
                        message : message,
                        receiver : $scope.nickId
                };
                $scope.pmMessages.push(pm);

         });

        $scope.partRoom = function() {

            socket.emit('partroom', $scope.roomId);

            $location.path('/rooms/' + $scope.nickId);

        };

        socket.on('updatechat', function(roomId, msgHistory) {
            if (roomId === $scope.roomId) {
                $scope.messages = msgHistory;
            }
        });

        socket.on('updatetopic', function(roomId, topic) {
            if (roomId === $scope.roomId) {
                $scope.topic = topic;
            }
        });



        $scope.showPmBox = function(nick) {

            if ($scope.nickSelected != nick) {
                $scope.nickSelected = nick;
                $scope.userSelected = true;
            } else {

                $scope.userSelected = false;
                $scope.nickSelected = '';
            }

        };

        $scope.selectOrders = function(value, nick) {
            socket.emit(value, {
                room: $scope.roomId,
                user: nick
            }, function(success) {});

        };

        socket.on('kicked', function(roomId, nickId, user) {
            if ($scope.roomId === roomId && $scope.nickId === nickId) {
                $location.path('/rooms/' + $scope.nickId);
                //$scope.roomId = '';
                alertify.error('You have been kicked from ' + roomId);
            }
            if ($scope.nickId === user) {
                var message = 'has kicked ' + nickId;

                socket.emit('sendmsg', {
                    roomName: $scope.roomId,
                    msg: message
                });

            }
        });

        socket.on('banned', function(roomId, nickId, user) {
            if ($scope.roomId === roomId && $scope.nickId === nickId) {
                $location.path('/rooms/' + $scope.nickId);
                $scope.roomId = '';
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

        moment.locale("is");
        var date = moment().format('LTS');
        $scope.changedTime = date;

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
