angular.module("ChatApp").controller("RoomCtrl", 
["$scope", "$http", "$routeParams", "$location", "socket", "$rootScope", 

	
	function($scope, $http, $routeParams, $location, socket, $rootScope) {

		$scope.roomId = $routeParams.roomId;
		$scope.nickId = $routeParams.nickId;
		$scope.nicks = [];
		$scope.submitMessage = '';
		$scope.messages = [];
		$scope.topic = '';
		$scope.userSelected = false;
		$scope.nickSelected = '';
		$scope.pmMessages = [];
		$scope.pmSubmitMessage = '';

        socket.emit('joinroom', {
            room: $scope.roomId
        }, function(success, isop, reason) {

            if (success) {
				$scope.isop = isop;
            } else {
				console.log(reason);
			}
			
        });

        socket.on('updateusers', function(roomId, nicksId, ops) {


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

				$scope.sendPmMSG = function () {

					if($scope.pmSubmitMessage === '') {
						//skip empty text
					}
					else {
					}
					

					

				};
			


        });

        $scope.partRoom = function() {

		$scope.showPmBox = function (nick) {

			if($scope.nickSelected != nick) {
				$scope.nickSelected = nick;
				$scope.userSelected = true;
			}

			else {

				$scope.userSelected = false;
				$scope.nickSelected = '';
			}

		
		};

	};

       	