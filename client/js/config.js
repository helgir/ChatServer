angular.module("ChatApp").config(['$routeProvider',
    function($routeProvider) {
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
    }
]);