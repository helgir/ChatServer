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
            var roomnames = Object.keys(data);
            $scope.rooms = roomnames;


        });

        socket.emit('rooms');




    }
]);
