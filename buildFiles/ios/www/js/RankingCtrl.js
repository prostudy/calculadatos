/**
 * Description:Este controlador contiene la logica para la pantalla de Perfil de usario
 * Obtiene la informacion del localstorage en la propiedad OBJECT_LEVEL
 * Obtiene el usuario de la aplicación de la tabla users
 * Author:Getsir
 * Email:development@getsir.mx 
 * */
angular.module('starter.controllers')

.controller('RankingCtrl', function($scope, $state, $stateParams,ChallengesService,$localstorage,Constants) { 
	
	/**
	 * Se recuperar los datos de la tabla challenges_users.
	 * Se obtienen los retos resueltos y el score total
	 * */
	$scope.init = function(){
		if(!$localstorage.getObject(Constants.OBJECT_LEVEL)){//Se verifica si ya se ha resuelto por lo menos un reto
			$scope.initLevelUser();
		}else{
			$scope.getUserInfo();
		}
	};
	
	
	/**
	 *Se asigna al usuario el primer nivel
	 * */
	$scope.initLevelUser = function(){
		ChallengesService.getJSONLevels().then(function(levels){
    		$localstorage.setObject(Constants.OBJECT_LEVEL, levels[0]);
    		$scope.getUserInfo();
		});
	};
	
	
	/**
	 * Obtiene la información del usuario
	 */
	$scope.getUserInfo = function(){
		//1.-Se obtiene los retos resueltos
		ChallengesService.getChallengesUsers().then(function(challengesUser){
			$scope.challengesUser = challengesUser;
			//$scope.userId = $scope.challengesUser[0].id_user;
			
			//2.-Se obtiene el usuario de la aplicación (por el momento no tiene soporte a multiples usuarios)
			ChallengesService.getUserRegister().then(function(user){
				$scope.user = user;
				
				//3.-Se obtiene el score del usuario
				ChallengesService.getScoreBy($scope.user.rowid).then(function(userScore){
					$scope.userScore = userScore;
					
					//4.-Se recupera el nivel actual del usuario
					$scope.currentLevel = $localstorage.getObject(Constants.OBJECT_LEVEL);
					
				});
			});
		});
	};
	
	/**
	 * Se invoca al metodo que inicializa la pantalla
	 * */
	$scope.$on('$ionicView.beforeEnter', function(){
		$scope.init();
	});	
});