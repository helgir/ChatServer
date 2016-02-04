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
		console.log(data);
	});
	$scope.nick = "";
		$scope.login = function(){
			socket.emit("adduser", $scope.nick, function(available){
		    if (available){

		    	socket.emit("rooms");
		    }
	});
		};

}]);

