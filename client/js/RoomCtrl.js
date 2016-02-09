angular.module("ChatApp").controller("RoomCtrl", 
["$scope", "$http", "$routeParams", "$location", "socket", "$rootScope", 

	
	function($scope, $http, $routeParams, $location, socket, $rootScope) {

		$scope.roomId = $routeParams.roomId;
		$scope.nickId = $routeParams.nickId;
		$scope.nicks = [];
		$scope.submitMessage = '';
		$scope.messages = [];


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
					}
				});


				$scope.sendMSG = function() {
					if($scope.submitMessage === '') {
						//skip empty text
					}
					else {
						socket.emit('sendmsg', { roomName: $scope.roomId, msg: $scope.submitMessage });
					}
					

					$scope.submitMessage = '';
					var scrollToBottom = $('#content');
						scrollToBottom.animate({ scrollTop: scrollToBottom.prop('scrollHeight') }, 1000);
				};
			


	socket.on('updatechat', function (roomId, msgHistory) {
		if(roomId === $scope.roomId) {
			$scope.messages = msgHistory;


			console.log(msgHistory.timestamp);

			
		}
	});

	//socket.on('partroom', function (room)

	$scope.partRoom = function() {

		socket.emit('partroom', $scope.roomId);

			$location.path('/rooms/' + $scope.nickId);

	};



	
}]);