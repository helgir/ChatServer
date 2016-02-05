angular.module("ChatApp", ["ng", "ngRoute"])
.config(function($routeProvider){
	$routeProvider.when("/home/login", {
		templateUrl: "/views/home.html",
		controller: "HomeCtrl"
	}).when("/rooms/:nickId",{
		templateUrl: "/views/room.html",		//Þarf að breyta nafni...
		controller: "RoomsCtrl",
	}).when("/rooms/:nickId/:lobbyId",{
		templateUrl: "/views/room.html",		//<<-----
		controller: "RoomsCtrl"
	}).otherwise({ redirectTo: "home/login"});

});

angular.module("ChatApp").controller("HomeCtrl",
["$scope", "$http", "$location",
function($scope, $http, $location){

	var socket = io.connect("http://localhost:8080");

	$scope.nickId = "";
	$scope.loggedIn = false;
	$scope.rooms = [];

	socket.on("roomlist", function(data) {
		$scope.$apply(function() {
		$scope.rooms = data;
		});
	});

		$scope.login = function(){
			socket.emit("adduser", $scope.nickId, function(available){
		    if (available){
		    	$scope.loggedIn = true;
		    	$location.path('/rooms/' + $scope.nickId);
		    	socket.emit("rooms");
		    }
		    
		    
	});
		};

}]);

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


/*angular.module["ChatApp"].controller("RoomCtrl",
["$scope", "$http", "$routeParams", 

	function($scope, $http, $routeParams) {

		//TODO, 
	}]);*/
