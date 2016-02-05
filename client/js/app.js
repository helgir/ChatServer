angular.module('ChatApp', ["ng", "ngRoute"])
.config(function($routeProvider){
	$routeProvider.when("/home/login", {
		templateUrl: "/views/home.html",
		controller: "HomeCtrl"
	}).when("/rooms/:nickId",{
		templateUrl: "/views/rooms.html",		//Þarf að breyta nafni...
		controller: "RoomsCtrl",
	}).when("/rooms/:nickId/:lobbyId",{
		templateUrl: "/views/lobby.html",		//<<-----
		controller: "LobbyCtrl"
	}).otherwise({ redirectTo: "home/login"});

});


angular.module("ChatApp").controller("RoomsCtrl", 
["$scope", "$http", "$routeParams",

	
	function($scope, $http, $routeParams){

		var socket = io.connect("http://localhost:8080");

		$scope.nickId = $routeParams.nickId;
		socket.emit("rooms");
		$scope.rooms = [];

		socket.on("roomlist", function(data) {
			$scope.$apply(function() {
			$scope.rooms = data;
		});

	});
}]);



angular.module("ChatApp").controller("LobbyCtrl", 
["$scope", "$http", "$routeParams",

	
	function($scope, $http, $routeParams){

		var socket = io.connect("http://localhost:8080");
		$scope.lobbyId = $routeParams.lobbyId;
		$scope.nickId = $routeParams.nickId;
		socket.emit("rooms");
		$scope.rooms = [];

		socket.on("roomlist", function(data) {
			$scope.$apply(function() {
			$scope.rooms = data;
		});

	});
}]);

