angular.module("ChatApp").controller("RoomsCtrl", 
["$scope", "$http", "$routeParams", "$location", "socket", "$rootScope",

	function($scope, $http, $routeParams, $location, socket, $rootScope){

		$scope.nickId = $routeParams.nickId;

		$scope.roomId = '';
		$scope.rooms = [];
	
		$scope.newRoom = function() {
		
			socket.emit('joinroom', { room:$scope.roomId }, function (success, reason) {

				if (success) {
					
					$location.path('/rooms/' + $scope.nickId + '/' + $scope.roomId);
				} 
			});
		};
		
		socket.on("roomlist", function(data) {
			var roomnames = Object.keys(data);
			$scope.rooms = roomnames;
		});
		socket.emit("rooms");


}]);
	
		
