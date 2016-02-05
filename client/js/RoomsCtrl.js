angular.module("ChatApp").controller("RoomsCtrl", 
["$scope", "$http", "$routeParams", "socket", "$rootScope",

	function($scope, $http, $routeParams, socket, $rootScope){

		$scope.lobbyId = $routeParams.lobbyId;
		$scope.nickId = $routeParams.nickId;
		socket.emit("rooms");
		$scope.rooms = [];

		socket.on("roomlist", function(data) {
			$scope.rooms = data;
		});

}]);
	
		
