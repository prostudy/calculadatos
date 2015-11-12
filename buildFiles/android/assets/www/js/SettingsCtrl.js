/**
 * Description:Este controlador contiene la logica para la pantalla de configuracion.
 * Elimina todos los datos almacenados en las tablas SQlite
 * Elimna todas las propiedades guardadas en local storage.
 * Y muestra textos fijos de como la politica de privacidad y las ventanas de ayuda
 * Author:Getsir
 * Email:development@getsir.mx 
 * */
angular.module('starter.controllers')

.controller('SettingsCtrl', function($scope,$localstorage,$cordovaSQLite,$ionicHistory,$state,Constants,$ionicLoading) {
	
	if( !$localstorage.getObject(Constants.KEY_SHARE_SOCIAL) ){
		$scope.shareSocial = { checked: false };
		$localstorage.setObject(Constants.KEY_SHARE_SOCIAL, $scope.shareSocial.checked);
	}else{
		$scope.shareSocial = { checked: ($localstorage.getObject(Constants.KEY_SHARE_SOCIAL) == true) };
	}
	
	if( !$localstorage.getObject(Constants.KEY_SHARE_WITH_INAI) ){
		$scope.shareScoreWithINAI = { checked: false };
		$localstorage.setObject(Constants.KEY_SHARE_WITH_INAI, $scope.shareScoreWithINAI.checked);
	}else{
		$scope.shareScoreWithINAI = { checked: ($localstorage.getObject(Constants.KEY_SHARE_WITH_INAI) == true) };
	}
	
	if( !$localstorage.getObject(Constants.KEY_RESTART_CHALLENGES) ){
		$scope.restarChallenges = { checked: false };
		$localstorage.setObject(Constants.KEY_RESTART_CHALLENGES, $scope.restarChallenges.checked);
	}else{
		$scope.restarChallenges = { checked: ($localstorage.getObject(Constants.KEY_RESTART_CHALLENGES) == true) };
	}
	
	
	$scope.shareSocialChange = function() {
		   $localstorage.setObject(Constants.KEY_SHARE_SOCIAL, $scope.shareSocial.checked);
	};
	
	$scope.shareScoreWithINAIChange = function() {
		$localstorage.setObject(Constants.KEY_SHARE_WITH_INAI, $scope.shareScoreWithINAI.checked);
	};
	
	$scope.restarChallengesChange = function() {
		$localstorage.setObject(Constants.KEY_RESTART_CHALLENGES, $scope.restarChallenges.checked);
	};

	$scope.restoreAllData = function(){	
		//Restaurar localstorage
		$localstorage.setObject(Constants.KEY_SHARE_SOCIAL, false);
		$localstorage.setObject(Constants.KEY_SHARE_WITH_INAI, false);
		$localstorage.setObject(Constants.KEY_RESTART_CHALLENGES, false);
		$localstorage.setObject(Constants.KEY_TABLE_CHALLENGES_LOADED, false);
		$localstorage.removeItem(Constants.KEY_TABLE_CHALLENGES_LOADED);
		$localstorage.removeItem(Constants.KEY_TABLE_DAMAGES_LOADED);
		$localstorage.removeItem(Constants.KEY_SHOW_HELP_SCREENS);
		$localstorage.removeItem(Constants.OBJECT_LEVEL);
		
		$scope.shareSocial = { checked: ($localstorage.getObject(Constants.KEY_SHARE_SOCIAL) == true) };
		$scope.shareScoreWithINAI = { checked: ($localstorage.getObject(Constants.KEY_SHARE_WITH_INAI) == true) };
		$scope.restarChallenges = { checked: ($localstorage.getObject(Constants.KEY_RESTART_CHALLENGES) == true) };
		
		
		//Restaurar Base sqlite
		 var query = "DELETE FROM challenges"; 
	     $cordovaSQLite.execute(db, query);
	     
	     var query = "DELETE FROM challenges_users";
	     $cordovaSQLite.execute(db, query);
	     
	     var query = "DELETE FROM users"; 
	     $cordovaSQLite.execute(db, query);
	     
	     var query = "DELETE FROM damages"; 
	     $cordovaSQLite.execute(db, query);
	     
	     $ionicHistory.clearCache();
	     //$ionicHistory.clearHistory(); 
	     //$state.go('standard');	       
	     $ionicLoading.show({ template: 'Se han restaurado los valores.', noBackdrop: true, duration: 1000 });
	}

});