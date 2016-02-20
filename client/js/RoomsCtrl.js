angular.module("ChatApp").controller("RoomsCtrl", ["$scope", "$http", "$routeParams", "$location", "socket", "$rootScope",

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
            } else {
                socket.emit('joinroom', {
                    room: $scope.roomId
                }, function(success, reason) {
                    if (success) {
                        $location.path('/rooms/' + $scope.nickId + '/' + $scope.roomId);
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
