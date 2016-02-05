angular.module("ChatApp").config(function($routeProvider){
	$routeProvider.when("/home/login", {
		templateUrl: "/views/home.html",
		controller: "HomeCtrl"
	}).when("/rooms/:nickId",{
		templateUrl: "/views/rooms.html",
		controller: "RoomsCtrl",
	}).when("/rooms/:nickId/:lobbyId",{
		templateUrl: "/views/lobby.html",
		controller: "LobbyCtrl"
	}).otherwise({ redirectTo: "home/login"});

});