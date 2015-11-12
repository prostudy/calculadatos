/**
 * Description:Este controlador contiene la logica para la pantalla de todos los retos.
 * Author:Getsir
 * Email:development@getsir.mx 
 * */
angular.module('starter.controllers')

.controller('ChallengesCtrl', function($scope,$state,InaiService, ChallengesService,$cordovaSQLite,$localstorage,$ionicPopup,$ionicModal,Constants,ParamView,$ionicScrollDelegate) {
	$scope.myTitle = '<img src="img/logo_retos.png">';
	
	$scope.$on('$ionicView.unloaded', function(){
		InaiService.setChallengeMode(false);
	});
	
	/*Se obtiene el nickname y el siguiente reto disponible*/
	var init = function(){
    	$scope.userRegister = null; //Objeto que guarda los datos del usuario 
    	$scope.challenge = null; //Objeto que guarda los datos de un reto.
    	$scope.options = null;  //Objeto que guarda las posibles respuestas de un reto
		$scope.processing = true; //Variable que se utiliza para deshabilitar las posibles respuestas
		$scope.userOption = null; //Objeto que contiene la respuesta seleccionada por el usuario
    	$scope.messageUser = ""; //Mensaje que se muestra al usuario en pantalla cuando responde un reto
		$scope.btnRestart = false; //Variable que se utiliza para ocultar/mostrar la opcion de reintentar reto
    	$scope.btNextChallenge = false; //Variable que se utiliza para ocultar/mostrar  la opcion de siguiente reto
    	$scope.attempts = 1; //Contabiliza el numero de intentos
    	$scope.completeAllQuestion = false; //Variable que se utiliza para indicar que todas las preguntas 
    	$scope.correctResponse = "";
    	$scope.correctResponseCard = "";
    	
    	//Varaibles para controlar el campo de nick
    	$scope.user = {nick:''};
    	
    	//1.-Se recupera nickname del usuario
		ChallengesService.getUserRegister().then(function(userRegister){
				$scope.userRegister = userRegister;
				if($scope.userRegister){
					$scope.userRegisterHide = true;
				}
		});
		
		/*2.-Se obtienen los retos ya contestados*/
		ChallengesService.getChallengesUsersIds().then(function(ids){
			if(ids){
				//2.1.-Se obtiene el siguiente reto no contestado, se descartan los retos ya contestados.
				ChallengesService.getNextChallengeNotIn(ids.join()).then(function(challengeResponse){
					if(challengeResponse == 0){
						ChallengesService.getJSONLevels().then(function(levels){
							$scope.completeAllQuestion = true;
							$scope.level = levels[levels.length-1];
							$scope.showModalChangeLevel(levels[levels.length-1]);
						});
					}else{
						ParamView.setObject (challengeResponse);
						$scope.challenge = challengeResponse;
						$scope.options = JSON.parse($scope.challenge.options);
					}
				});
			}else{
				//2.2.-Si no se tiene ningun reto contestado, se obtiene el primero.
				ChallengesService.getChallengeById(1).then(function(challengeResponse){
					$scope.challenge = challengeResponse;
					$scope.options = JSON.parse($scope.challenge.options);
				});
			}	
			$scope.processing = false; //Se habilitan las posibles respuestas
		});
	};

	/**
	 * PASO CERO
	 * IMPORTANTE: SIEMPRE SE VERIFICA LA EXISTENCIA DE LA CLAVE 'KEY_TABLE_CHALLENGES_LOADED' 
	 * La primera vez que se usa la aplicación se copiará el contenido original del json challenges.json
	 * a la tabla CHALLENGES
	 * De esta manera, el contenido original se puede restaurar.
	 * Para ello se verifica si la clave 'KEY_TABLE_CHALLENGES_LOADED' en el localstorage del dispositivo ya se tiene registrada
	 * */
	if(!$localstorage.get(Constants.KEY_TABLE_CHALLENGES_LOADED)){
		ChallengesService.getJSONChallenges().then(function(response){
			//Para cada reto recuperado desde la base de conocimiento original,
			//Se inserta en la tabla challenges de sqlite del dispositivo
			for(i=0; i<response.length; i++){
				ChallengesService.initInsertChallenge(response[i]).then(function(res){
				       //console.log("insertChallenge -> " + res);
					});
			}
			//Cuando se termina de insertar el contenido se crea la clave KEY_TABLE_CHALLENGES_LOADED en localstorage
			$localstorage.set(Constants.KEY_TABLE_CHALLENGES_LOADED, true);
			init();
		  });
	}else{
		//En caso de que los retos ya hayan sido copiados al dispositivo, se inicializa la pantalla de retos
		init();
	}
	
	
	/****
	 * 
	 * Acciones de usuario en la plantalla de retos
	 * 
	 * ****/
	
    /*Acción que se ejecuta al selecionar alguna posbile respuesta del reto*/
    $scope.optionSelected = function(userOption){
    	$scope.processing = true; //Se bloquean los controles
    	$scope.userOption = userOption; 
    	if($scope.userOption.id == $scope.challenge.answer){
    		$scope.userOptionCorrect(); //Se realiza el proceso de respuesta correcta
    	}else{
    		$scope.userOptionIncorrect(); //Se realiza el proceso de respuesta incorrecta		
    	}
    	
    };
    
    /*Proceso que se ejecuta cuando la respuesta es correcta
     * Se registra el reto contestado en la tabla challenges_users.
     * Se verifica el nivel que tiene el usuario en los retos
     * */
    $scope.userOptionCorrect = function (){
    	 ChallengesService.insertChallengeUser(
    			 $scope.challenge.id
				,$scope.userRegister.rowid
				,$scope.challenge.value
				,$scope.userOption.id
				,$scope.attempts).then(function(res){
				$scope.processing = true; 
				$scope.correctResponseCard = "correctaCard";
				$scope.correctResponse = "correcta";
				//Se recupera el score y se verifica el nivel 
				ChallengesService.getScoreBy($scope.userRegister.rowid).then(function(userScore){
					$scope.userScore = userScore
					$scope.statusLevel(userScore);
					$scope.messageUser = Constants.STR_CORRECT_CHALLENGE;
					//$scope.btnRestart = false; 
			    	$scope.btNextChallenge = true;
			    	//$scope.attempts = 1; 
				});
				
		});
    };
    
    /**
     * Verifica el nivel en que se encuentra el usuario
     * Se realiza la lectura del json levels.json en donde estan los nivels definidos.
     * */
    $scope.statusLevel = function(userScore){
    	ChallengesService.getJSONLevels().then(function(levels){
			for(i=0; i<levels.length; i++){ 
				var currentLevel = $localstorage.getObject(Constants.OBJECT_LEVEL);
				if( (userScore >= levels[i].scoreMin && userScore <= levels[i].scoreMax) ){
					if(currentLevel.id != levels[i].id){
						$localstorage.setObject(Constants.OBJECT_LEVEL, levels[i]);
					 	$scope.showModalChangeLevel(levels[i]);
					 break;
					}
				} 
			}
		});
    };
    
    
    /*Proceso cuando la respuesta es incorrecta*/
    $scope.userOptionIncorrect = function(){
		if($scope.restarChallengesActivated()){
			$scope.btnRestart = true;
			$scope.messageUser = Constants.STR_FAIL_CHALLENGE;
		}else{
			$scope.btnRestart = false;
			//$scope.messageUser = "La respuesta correcta es:"+$scope.challenge.answer;
			$scope.correctResponseCard = "incorrectaCard";
			$scope.correctResponse = "correcta";
			$scope.btNextChallenge = true;
			ChallengesService.insertChallengeUser($scope.challenge.id,$scope.userRegister.rowid,0,$scope.userOption.id,$scope.attempts);
		}
    };
    
    /*Verifica si se tiene activada la opción de reintentar*/
    $scope.restarChallengesActivated = function(){
    	return $localstorage.getObject(Constants.KEY_RESTART_CHALLENGES) == true ? true : false;
    };
    
    /*Reiniciar el reto para volver a contestarse*/
    $scope.restartChallenge = function(){
    	$scope.btnRestart = false;
    	$scope.processing = false;
    	$scope.messageUser = "";
    	$scope.attempts++;
    };
    
    /*Muestra un nuevo reto*/
    $scope.nextChallenge = function(){
    	init();
    	$ionicScrollDelegate.scrollTop();
    };
    
    /*Muestra la calculadora en modo reto*/
    $scope.showCalculator = function(){
  		$state.go('standard', {challengeMode: true});
    };
  
    /*Acción que se ejecuta para registrar el nickname del usuario en la tabla users*/
	$scope.registerNickName = function(nickname) {   
		if( nickname == undefined || nickname.length == 0 || nickname.length > 20 ){
			$scope.errorNick = Constants.STR_ERROR_NICKNAME;
		}else{
			ChallengesService.insertUser(nickname).then(function(res){
				ChallengesService.getUserRegister().then(function(userRegister){
					$scope.userRegister = userRegister;
				});
	    	});
		}
    };
    
 
    
    //Modal para mostrar el cambio de nivel 
   $ionicModal.fromTemplateUrl('templates/changeLevel.html', {
     scope: $scope
   }).then(function(modal) {
     $scope.modalChangeLevel = modal;
   });

   $scope.close = function() {
     $scope.modalChangeLevel.hide();
   };

   $scope.showModalChangeLevel = function(level) {
	 $scope.currentLevel = level;
     $scope.modalChangeLevel.show();
   };
  
 
   /**
    * Valida la longitud del campo del nickname
    * */
   $scope.$watch("user.nick", function(newValue, oldValue){
       if (newValue && newValue.length > Constants.MAXLENGTH_NICK){
           $scope.user.nick = oldValue;
       }
   });
});