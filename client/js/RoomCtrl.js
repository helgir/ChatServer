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
						if(evt === true) {
							sendJoinRoomRequest($scope.roomId, value);
						} else {
							$rootScope.$apply(function() {
								$location.path('/rooms/' + $scope.nickId);
							});
						}
                    });
				//Resetting alertify defaults
				alertify.set({
                    labels: {
                        ok: "Ok",
                        cancel: "Cancel"
                    }
				});
            } else {
                sendJoinRoomRequest($scope.roomId, undefined);
            }
        }

        $scope.$on('$destroy', function(event) {
            socket.getSocket().removeAllListeners();
        });

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
		
		$scope.opUser = function(user) {
			if(user !== undefined) {
				socket.emit('op', {
					room: $scope.roomId,
					user: user
				}, function(success) {
					if(success) {
						var message = $scope.nickId + 'has opped ' + user;
						socket.emit('sendmsg', {
							roomName: $scope.roomId,
							msg: message
						});
					} else {
						alertify.error("Could not op " + user);
					}
				});
			}
		};
		
		$scope.deopUser = function(user) {
			if(user !== undefined) {
				socket.emit('deop', {
					room: $scope.roomId,
					user: user
				}, function(success) {
					if(success) {
						var message = $scope.nickId + 'has deopped ' + user;
						socket.emit('sendmsg', {
							roomName: $scope.roomId,
							msg: message
						});
					} else {
						alertify.error("Could not deop " + user);
					}
				});
			}
		};
		
		$scope.kickUser = function(user) {
			if(user !== undefined) {
				socket.emit('kick', {
					room: $scope.roomId,
					user: user
				}, function(success) {
					if(success) {
						var message = $scope.nickId + 'has kicked ' + user;
						socket.emit('sendmsg', {
							roomName: $scope.roomId,
							msg: message
						});
					} else {
						alertify.error("Could not kick " + user);
					}
				});
			}
		};
		
		$scope.banUser = function(user) {
			if(user !== undefined) {
				socket.emit('ban', {
					room: $scope.roomId,
					user: user
				}, function(success) {
					if(success) {
						var message = $scope.nickId + 'has banned ' + user;
						socket.emit('sendmsg', {
							roomName: $scope.roomId,
							msg: message
						});
					} else {
						alertify.error("Could not ban " + user);
					}
				});
			}
		};

        socket.on('kicked', function(roomId, nickId, user) {
            if ($scope.roomId === roomId && $scope.nickId === nickId) {
                $location.path('/rooms/' + $scope.nickId);
                alertify.error('You have been kicked from ' + roomId);
            }
        });

        socket.on('banned', function(roomId, nickId, user) {
            if ($scope.roomId === roomId && $scope.nickId === nickId) {
                $location.path('/rooms/' + $scope.nickId);
                alertify.error('You have been banned from ' + roomId, 0);
            }
        });

        socket.on('opped', function(roomId, nickId, user) {
            if ($scope.roomId === roomId && $scope.nickId === nickId) {
                alertify.success('You are now op');
            }
        });

        socket.on('deopped', function(roomId, nickId, user) {
            if ($scope.roomId === roomId && $scope.nickId === nickId) {
                alertify.error('You have been deopped');
            }
        });

        $scope.changeTopic = function() {
			alertify.prompt("Topic: ",
                function(evt, value) {
				 	if(evt === true) {
						if(value === undefined || value === '') {
							alertify.error("Topic can not be empty");
							
						}
				 		socket.emit('settopic', {
							room: $scope.roomId,
							topic: value
						}, function(success) {
							if(success) {
								alertify.success('Topic has been changed');
							} else {
								alertify.error('Could not change topic');
							}
						});
				 	} else {
				 		
				 	}
                }); 
        };

        $scope.changePassword = function() {
            alertify.prompt("Password: ",
                function(evt, value) {
				 	if(evt === true) {
						if(value === undefined || value === '') {
							alertify.error("Can not change password to empty, use the remove password instead");
							return;
						}
				 		socket.emit('setpassword', {
							room: $scope.roomId,
							password: value
						}, function(success) {
							if(success) {
								alertify.success('Password has been changed');
							} else {
								alertify.error('Could not change password');
							}
						});
				 	} else {
				 		
				 	}
                }); 
        };

        $scope.removePassword = function() {
            socket.emit('removepassword', {
                room: $scope.roomId
            }, function(success) {
                if (success) {
                    alertify.success('Password removed');
                } else {
					alertify.success('Could not remove the password');
				}
            });
        };

        function currentTime() {
            moment.locale("is");
            var date = moment().format('LTS');
            return date;
        }
    }
]);
