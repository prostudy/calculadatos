/**
 * Description:Controlador  responsable de identificar las respuestas del usuario en la pantalla de principios.  
 * Se comunica con el servicio InaiService para aumentar o disminuir el valor de la variable EP de la formula principal
 * Author:Getsir
 * Email:development@getsir.mx 
 * */
angular.module('starter.controllers')

.controller('PrincipiosCtrl', function($scope, $state, $stateParams,InaiService,Constants) { 
	//Variables para controlar la respuestas del usuario
	$scope.question1 = { checked: false };
	$scope.question2 = { checked: false };
	$scope.question3 = { checked: false };
	$scope.question4 = { checked: false };
	InaiService.setEP(Constants.EP);

	
	/**
	 * Se obtiene el total de la estimación
	 */
	$scope.myTitle = '<img src="img/logo_principios.png">';
	/**Actualizar el totalEstimate cada que se regrese a la pantalla*/
	$scope.$on('$ionicView.beforeEnter', function(){
		if(InaiService.isReady()){
		    $scope.totalEstimate = InaiService.getValueTotal().totalEstimation;
		}
	  });
	
	
	/**
	 * Accion que se ejecuta al seleccionar alguna respuesta de los principios de usuario
	 */
	$scope.questionChange = function(question) {
		if(question.checked){
			InaiService.decrementEP();
		}else{
			InaiService.increaseEP();
		}
		$scope.totalEstimate = InaiService.getValueTotal().totalEstimation;   
	};
	
	
	/**
	 * Accion que muestra la pantalla de resultados
	 */
	  $scope.goToSummary = function(){
	  	$state.go('summary');
	  }
});