var GlobalFunctions = angular.module("GlobalFunctions",[]);

GlobalFunctions.service("GlobalFunctions",["$q","$http",
                                           "$ionicPopup","$state", "$stateParams","$window",
function($q,$http,$ionicPopup,$state, $stateParams,$window){
	return {
		reloadApp : function(){
		$state.go('app.standard', {}, {reload: true});
		$window.location.reload(true)
	}
	
	}
}]);