angular.module("ChatApp").controller("RoomsCtrl", 
["$scope", "$http", "$routeParams", "$location", "socket", "$rootScope",

	function($scope, $http, $routeParams, $location, socket, $rootScope){

		$scope.nickId = $routeParams.nickId;

		
		$scope.rooms = [];
		$scope.lobbyId = '';
		console.log("123131");
		$scope.newRoom = function() {
		
			socket.emit('joinroom', { room:$scope.lobbyId }, function (success, reason) {

				if (success) {
					
					$location.path('/rooms/' + $scope.nickId + '/' + $scope.lobbyId);
				} 
			});
		};
		socket.emit("rooms");


		socket.on("roomlist", function(data) {
			$scope.rooms = data;
		});

}]);
	
		
