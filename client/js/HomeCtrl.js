angular.module("ChatApp").controller("HomeCtrl", ["$scope", "$http", "$location", "socket", "$rootScope",
    function($scope, $http, $location, socket, $rootScope) {


        $scope.nickId = '';
        $scope.loggedIn = false;
        $scope.errorMessage = '';
        $scope.login_error = false;


        $scope.login = function() {

            socket.emit("adduser", $scope.nickId, function(available) {

                if ($scope.nickId === '') {
                    $scope.loggedIn = false;
                    $scope.login_error = true;
                    $scope.errorMessage = 'Please enter nickname';


                } else if (available) {
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
