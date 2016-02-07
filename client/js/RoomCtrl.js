angular.module("ChatApp").controller("RoomCtrl", 
["$scope", "$http", "$routeParams", "socket", "$rootScope",

	
	function($scope, $http, $routeParams, socket, $rootScope){

		$scope.roomId = $routeParams.roomId;
		$scope.nickId = $routeParams.nickId;
		$scope.nicks = [];


		socket.emit('joinroom', { room: $scope.roomId }, function (success, reason) {

		if (success) {
			//TODO


			//Checks if it was succsessful
			// Could be password protected...
			
		}
	});

			

				socket.on('updateusers', function (roomId, nicksId, ops) {

					
					if($scope.roomId === roomId) {

						$scope.nicks = nicksId;
						var count = 0;
						for (var k in nicksId) {
    				if (nicksId.hasOwnProperty(k)) {
      					++count;
    					}
					}
						console.log(count);

				
						
					}
				});

			




	
}]);