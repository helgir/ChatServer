angular.module("ChatApp").controller("RoomCtrl", ["$scope", "$http", "$routeParams", "$location", "socket", "$rootScope",


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


            if ($scope.roomId === roomId) {

                $scope.nicks = nicksId;
            }
        });


        $scope.sendMSG = function() {
            if ($scope.submitMessage === '') {
                //skip empty text
            } else {
                socket.emit('sendmsg', {
                    roomName: $scope.roomId,
                    msg: $scope.submitMessage
                });
            }


            $scope.submitMessage = '';
            var scrollToBottom = $('#content');
            scrollToBottom.animate({
                scrollTop: scrollToBottom.prop('scrollHeight')
            }, 1000);
        };

        $scope.sendPmMSG = function() {

            if ($scope.pmSubmitMessage === '') {
                //skip empty text
            } else {}

        };

        $scope.partRoom = function() {

            socket.emit('partroom', $scope.roomId);

            $location.path('/rooms/' + $scope.nickId);

        };

        socket.on('updatechat', function(roomId, msgHistory) {
            if (roomId === $scope.roomId) {
                $scope.messages = msgHistory;

            }
        });

        socket.on('updatetopic', function(roomId, topic) {
            if (roomId === $scope.roomId) {
                $scope.topic = topic;

            }

        });

        $scope.showPmBox = function(nick) {

            if ($scope.nickSelected != nick) {
                $scope.nickSelected = nick;
                $scope.userSelected = true;
            } else {

                $scope.userSelected = false;
                $scope.nickSelected = '';
            }

        };

    }
]);
