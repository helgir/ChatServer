angular.module("ChatApp").controller("RoomsCtrl", ["$scope", "$http", "$routeParams", "$location", "socket", "$rootScope",

    function($scope, $http, $routeParams, $location, socket, $rootScope) {

        $scope.nickId = $routeParams.nickId;

        $scope.roomId = '';
        $scope.rooms = [];
        $scope.errorMessage = '';
        $scope.create_error = false;

        $scope.$on('$destroy', function(event) {
            socket.getSocket().removeAllListeners();
        });

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
		
		//Lets the user know if he is unbanned from a room
		socket.on('servermessage', function(evt, room, user, target) {
            switch(evt) {
			case "unban":
				if (target !== $scope.nickId) {
					alertify.success("You have been unbanned from " + room + " by " + user);
				}
				break;
			default:
				break;
			} 
        });

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
