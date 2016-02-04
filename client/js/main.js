angular.module("ChatApp", ["ng", "ngRoute"])
.config(function($routeProvider){
	$routeProvider.when("/index", {
		templateUrl: "/views/home.html",
		controller: "HomeCtrl"
	}).when("/rooms/:roomId",{
		templateUrl: "/views/room.html",
		controller: "RoomCtrl"
	}).otherwise({ redirectTo: "/index"});

});

angular.module("ChatApp").controller("HomeCtrl",
["$scope", "$http",
function($scope, $http){

	var socket = io.connect("http://localhost:8080");



	socket.on("roomlist", function(data) {
		$scope.$apply(function() {
		$scope.rooms = data;
		console.log(data);
		});
	});

	$scope.nick = "";
	$scope.loggedIn = false;
	$scope.rooms = [];

		$scope.login = function(){
			socket.emit("adduser", $scope.nick, function(available){
		    if (available){
		    	$scope.loggedIn = true;
		    	socket.emit("rooms");
		    }
	});
		};

}]);

angular.module("ChatApp").controller("RoomCtrl", 
["$scope", "$http",
function($scope, $http){
}]);

