/**
 * Description:Este es el controlador de la pantalla de la calculadora, 
 * implementa toda la lógica y las acciones que se realizan sobre dicha pantalla. 
 * Author:Getsir
 * Email:development@getsir.mx 
 * */
angular.module('starter.controllers',[])

.controller('StandardDataCtrl', function($scope, $state, $stateParams,InaiService,ChallengesService,ParamView,$ionicModal,$localstorage,Constants,$ionicConfig,$ionicPopup) { 
	//console.log("Se ha creado un nuevo StandardDataCtrl:"+$scope.$id);
	
	/*Inicializar las variables*/
	$scope.personalDataItems = null; /*Datos para mostrar en pantalla*/
	$scope.standarActivated = "button-positive"; //Variable que se utiliza para resaltar la opcion de datos de tipo estandar
	$scope.sensibleActivated = "";
	$scope.criticalActivated = "";
	$scope.challengeMode = false;
	$scope.myTitle = '<img src="img/logo.png">';
	$scope.stepMessage = "";
	$scope.colorData = "estandar";
	
	/*Objeto que se utiliza para implementar la funcionalidad del buscador de datos personales*/
	$scope.searchParams = {searchString : ''}; 
	$scope.disabledCalc = true ; //Deshablita los botones de "Calcular" cuando no se ha seleccionado ningun dato personal.
	
	/**
	* 1.- Se inicializa la pantalla que muestra los datos personales.
	* Se obtienen los datos personales desde un servicio
	* Se asignan los datos recuperados segun si categoria: datosStandard, personalDataSensitive, personalDataCritical
	* 
	* */
	$scope.initData = function(){
	  InaiService.getAllInaiClassification($scope.challengeMode).then(function(response){
		    $scope.allInaiClassification = response;
		    $scope.datosStandard = InaiService.getPersonalDataStandard($scope.$id);
			$scope.personalDataSensitive = InaiService.getPersonalDataSensitive($scope.$id);
		    $scope.personalDataCritical = InaiService.getPersonalDataCritical($scope.$id);
		    $scope.showStandardDataList();
		    $scope.searchParams.searchString = "";
		    $scope.getValueTotalFromService();
		  });  
	}
	
	/**
	 * Se prepara la pantalla para utilizase en modo NORMAL O MODO RETO
	 * */
	$scope.setCalculatorMode = function(){
		if($stateParams.challengeMode==="true"){
		 	$scope.challenge = ParamView.getObject();
		 	$scope.challengeMode = true;
		 	InaiService.setChallengeMode( $scope.challengeMode );
		}else{
			$scope.challengeMode = false
			InaiService.setChallengeMode( $scope.challengeMode );
			InaiService.getUserData($scope.challengeMode);
		}
		if($scope.datosStandard){ 
			$scope.getValueTotalFromService();
		 }
		
	}
	
	/********
	 * 1.- Se ejecuta una sola vez, cada que se crea una instancia de este controller
	 * Es indispensable asignar el modo Normal o Reto a la calculadora
	 * AQUI COMIENZA EL PROCESO
	**/ 
	$scope.setCalculatorMode();
	$scope.initData();
	
	
	/**
	 *2.-  Verifica el total para activar y desactivar el boton de Calcular
	 *	Se  utiliza un servicio para consultar los datos que se han seleccionado y realizar el calculo del total
	 *	Si el total no es mayor a cero, se deshabilita la opcion de calcular.
	 * */
	$scope.getValueTotalFromService = function(){
		  $scope.totalEstimate =  InaiService.getValueTotal($scope.$id).totalEstimation;
		  $scope.setStatusBtnCalc($scope.totalEstimate);
	 }
	
	
	/**
	 *3.- Deshabilita o activa la opcion de calcular
	 * */
	$scope.setStatusBtnCalc = function(totalEstimate){
		parseFloat(totalEstimate) > 0 ? $scope.disabledCalc = false : $scope.disabledCalc = true;
	}
	
	
	
	$scope.$on('$ionicView.enter', function(){
		$scope.setCalculatorMode();
	});
	
	/*$scope.$on('$ionicView.unloaded', function(){
		console.log("xxxxxxxxxxxxxxx Se ha destruido el controller StandardDataCtrl:"+$scope.$id);
		});*/
	
  /*Se muestran los datos de tipo estandar*/
  $scope.showStandardDataList = function(){
	  $scope.stepMessage = "1.- Seleccionar los datos de nivel estándar";
	  $scope.personalDataItems =  $scope.datosStandard;
	  $scope.standarActivated = "button-positive";
	  $scope.sensibleActivated = "";
	  $scope.criticalActivated = "";
	  $scope.colorData = "estandar";
  }
  
  /*Se muestran los datos de tipo sensibles*/
  $scope.showSensibleDataList = function(){
	  $scope.stepMessage = "2.- Seleccionar los datos de nivel medio";
	  $scope.personalDataItems = $scope.personalDataSensitive;
	  $scope.standarActivated = "";
	  $scope.sensibleActivated = "button-positive";
	  $scope.criticalActivated = "";
	  $scope.colorData = "sensible";
  }
  
  /*Se muestran los datos de tipo criticos*/
  $scope.showCriticalDataList = function(){
	  $scope.stepMessage = "3.- Seleccionar los datos de nivel sensible";
	  $scope.personalDataItems = $scope.personalDataCritical;
	  $scope.standarActivated = "";
	  $scope.sensibleActivated = "";
	  $scope.criticalActivated = "button-positive";
	  $scope.colorData = "critical";
  }
  
  /*Accion que muestra la pantalla de las preguntas (principios)*/
  $scope.goToPrincipios = function(){
	   if(  $scope.totalEstimate > 0 ){
		   $state.go('principios');
	   }
  }

   /**
    * Acción que se ejectua cuando se selecciona algun dato de la lista
    * */
  $scope.checkItem = function (item){
	//console.log("Soy el controlador StandardDataCtrl:"+$scope.$id);
  	item.check = !item.check;
  	//$scope.totalEstimate =  InaiService.getValueTotal($scope.$id);
  	$scope.getValueTotalFromService();
  }
  
  /**
   * Detecta un click largo sobre un elemento de la pantalla y muestra una descripcion mas larga.
   */
  $scope.onHoldItem = function(item){
	  $scope.showAlert(item);
  }
  

  /**
   * Borra el contenido del campo de texto de busqueda
   * */
  $scope.resetSearch = function(){
	  $scope.searchParams.searchString = "";
  };
  
  /*Ventanas de ayuda*/
  $ionicModal.fromTemplateUrl('templates/help.html', {
	    scope: $scope
	  }).then(function(modal) {
		  if(!$localstorage.getObject(Constants.KEY_SHOW_HELP_SCREENS)){
			  $localstorage.setObject(Constants.KEY_SHOW_HELP_SCREENS, true);
			  
			  if(!$localstorage.getObject(Constants.KEY_RESTART_CHALLENGES)){
			    	$localstorage.setObject(Constants.KEY_RESTART_CHALLENGES, false);
			  }
			  $scope.modalHelp1 = modal;
			  $scope.help1();
		  } 
	  });
	  

	  $scope.closeHelp1 = function() {
	    $scope.modalHelp1.hide();
	  };

	  $scope.help1 = function() {
	    $scope.modalHelp1.show();
	  };

	  
	// Muestra la alerta con la definición del dato personal
	  $scope.showAlert = function(personalData) {
	    var alertPopup = $ionicPopup.alert({
	      title: personalData.name,
	      template: personalData.definition
	    });
	    alertPopup.then(function(res) {
	      //console.log('');
	    });
	  };
});