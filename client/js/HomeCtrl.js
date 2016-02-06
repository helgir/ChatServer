angular.module("ChatApp").controller("HomeCtrl",
["$scope", "$http", "$location", "socket", "$rootScope",
	function($scope, $http, $location, socket, $rootScope){

		
		$scope.nickId = '';
		$scope.loggedIn = false;
		$scope.placeHolder = 'Enter Nickname';
		$scope.errorMessage = '';
		

		
			$scope.login = function(){

				
				socket.emit("adduser", $scope.nickId, function(available){
				
			   if (available){
			    	$scope.loggedIn = true;
			    	$location.path('/rooms/' + $scope.nickId);
			    	
			    }
			    else {
			    	$scope.loggedIn = false;
			    	$scope.errorMessage = 'This nickname is unavailable';
			    }
			    
			    
		});
			};

}]);