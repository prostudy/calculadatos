/**
 * Description:Este controlador maneja el menu principal de la aplicacion.
 * Basicamente solo se implementa la accion de volver a la calculadora, poniendo el modo de calculadora en normal.
 * Author:Getsir
 * Email:development@getsir.mx 
 * */
angular.module('starter.controllers')

.controller('MenuCtrl', function($scope,$state,$stateParams,$ionicHistory,$ionicSideMenuDelegate) {
	console.log("MenuCtrl");
	
	$scope.toggleLeftSideMenu= function(){
		 $ionicSideMenuDelegate.toggleRight();
	};

	$scope.openCalculator = function(){
		//console.log($state.current);
		 $ionicSideMenuDelegate.toggleRight();
		if(!($state.current.name === "standard")){
			$ionicHistory.clearCache();
			$ionicHistory.clearHistory();
			$ionicHistory.nextViewOptions({
				disableAnimate: true,
				disableBack: true
			});
			$state.go('standard',{challengeMode:false});
		}
	}
});