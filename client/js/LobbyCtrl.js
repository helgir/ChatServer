angular.module("ChatApp").controller("LobbyCtrl", 
["$scope", "$http", "$routeParams", "socket", "$rootScope",

	
	function($scope, $http, $routeParams, socket, $rootScope){

		$scope.lobbyId = $routeParams.lobbyId;
		$scope.nickId = $routeParams.nickId;
	
	
}]);