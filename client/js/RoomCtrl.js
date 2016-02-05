angular.module("ChatApp").controller("RoomCtrl", 
["$scope", "$http", "$routeParams", "socket", "$rootScope",

	
	function($scope, $http, $routeParams, socket, $rootScope){

		$scope.roomId = $routeParams.roomId;
		$scope.nickId = $routeParams.nickId;

	
}]);