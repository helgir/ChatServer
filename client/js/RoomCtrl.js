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
        $scope.isop = false;

        socket.emit('joinroom', {
            room: $scope.roomId
        }, function(success, isop, reason) {

            if (success) {
                console.log("Joined room");
            } else {
                console.log(reason);
            }

        });

        socket.on('updateusers', function(roomId, nicksId, ops) {
            $scope.isop = (ops[$scope.nickId] !== undefined);
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
