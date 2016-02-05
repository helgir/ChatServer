angular.module("ChatApp").controller("HomeCtrl",
["$scope", "$http", "$location", "socket", "$rootScope",
	function($scope, $http, $location, socket, $rootScope){

		
		$scope.nickId = '';
		$scope.loggedIn = false;
		
			$scope.login = function(){
				//if(#scope.nickId === '') {
					//TODO Set error? cannot be empty
				//}
				socket.emit("adduser", $scope.nickId, function(available){
			    if (available){
			    	$scope.loggedIn = true;
			    	$location.path('/rooms/' + $scope.nickId);
			    	
			    }
			    
			    
		});
			};

}]);