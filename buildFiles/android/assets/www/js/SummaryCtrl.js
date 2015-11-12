/**
 * Description:El controlador principal de esta pantalla invoca a un servicio para que éste realice el calculo y 
 * regrese un objeto con la información que se va mostrar en pantalla.
 * El controlador realiza la lectura de un archivo JSON el cual contiene un listado de daños que pueden afectar al titular 
 * y los inserta en una tabla SQLite.
 * Author:Getsir
 * Email:development@getsir.mx 
 * */
angular.module('starter.controllers')

.controller('SummaryCtrl', function($scope, $state, $stateParams,InaiService,DamagesService,$localstorage,Constants,$cordovaSocialSharing,$ionicModal,$ionicScrollDelegate) {
	
	/**
	 * Se obtiene los valores actualizados desde el servicio InaiService
	 * */
	$scope.getSummaryValues = function(){
		var totalObject = InaiService.getValueTotal();
	    $scope.totalEstimate = totalObject.totalEstimation;
	    $scope.dataSelected = InaiService.getDataSelected();

	    $scope.totalStandardObject = totalObject.totalStandardObject;
	    $scope.totalSensibleObject = totalObject.totalSensibleObject;
	    $scope.totalCriticalObject = totalObject.totalCriticalObject;
	    
	    $scope.damagesIdsSelected = InaiService.getDamageIdsSelected();
	    DamagesService.getDamageById($scope.damagesIdsSelected.join()).then(function(damages){
	    	$scope.damages = damages;
		});
	    
	    $scope.showBtnChallenge  = InaiService.getChallengeMode();//Muestra el boton de ir a retos
	    $scope.hasFooter = $scope.showBtnChallenge==true ? "has-footer" : "";
	  };
	  
	  
	 /**
	  * Se inicializan los elementos de pantalla 
	  * */ 
	 $scope.initData = function(){
		 if(!$localstorage.get(Constants.KEY_TABLE_DAMAGES_LOADED)){
				$scope.loadDataDamages();
			}else{
				//En caso de que los retos ya hayan sido copiados al dispositivo, se inicializa la pantalla de retos
				$scope.getSummaryValues();
			}
	 };
	 
	 /**
	  * Si es la primera vez que se utiliza al app, se lee un archivo json para cargar los riesgos a sqlite
	  * */
	 $scope.loadDataDamages = function(){
		 DamagesService.getJSONDamages().then(function(response){
				//Para cada riesgo recuperado desde la base de conocimiento original,
				//Se inserta en la tabla damages de sqlite del dispositivo
				for(i=0; i<response.length; i++){
					DamagesService.initInsertDamages(response[i]).then(function(res){
					       //console.log("insertChallenge -> " + res);
						});
				}
				//Cuando se termina de insertar el contenido se crea la clave KEY_TABLE_CHALLENGES_LOADED en localstorage
				$localstorage.set(Constants.KEY_TABLE_DAMAGES_LOADED, true);
				$scope.getSummaryValues();
			  }); 
	 };
	

	 /**Actualizar el totalEstimate cada que se regrese a la pantalla*/
	$scope.$on('$ionicView.beforeEnter', function(){
		 $scope.initData();
		 $ionicScrollDelegate.scrollTop();
	});
	
	
	/**
	  * Acción que se ejectua cuando se selecciona algun dato de la lista
	  * */
	  $scope.checkItem = function (item){
	  	item.check = !item.check;
	  	$scope.getSummaryValues();
	  };
	  
	  
	  /**
	   * Muestra la pantalla de retos
	   */
	  $scope.goToChallenges = function(){
		  $state.go('retos');
	  };
	  
	  
	  /******Compartir*****/
	  $scope.shareAnywhere = function() {
		  var numData = $scope.totalStandardObject.numDataEstandar + $scope.totalSensibleObject.numDataSensible + $scope.totalCriticalObject.numDataCriticos;
	        //$cordovaSocialSharing.share("¿Sabías que si proporcionas "+numData+" datos personales, tus datos podrian valer:"+$scope.totalEstimate, "INAI CalculaDatos", "img/logo.png", "http://www.inai.org.mx/");
	        var message = "Acabo de realizar un cálculo, el valor de "+numData+" datos personales, es de: $"+$scope.totalEstimate +". ¡Inténtalo!";
	        var subject = "INAI CalculaDatos";
	        var file = "http://calculadatos.getsir.mx/descargas/images/calculadatosShare.png";
	        var link = "http://goo.gl/XMYEoo";//"http://www.inai.org.mx/";
	        $cordovaSocialSharing.share(message, subject, file, link).then(function(result) {
		      // Success!
		    	//console.log("Se compartio correctamente.");
		    }, function(err) {
		      // An error occured. Show a message to the user
		    	console.log("Ocurrio un error al compartir.");
		    });
	    };    
	    
	    
	    //Modal para mostrar la descripcion de los riesgos
	    $ionicModal.fromTemplateUrl('templates/modalDamage.html', {
	      scope: $scope
	    }).then(function(modal) {
	    	$scope.damage = modal;
	    });

	    $scope.close = function() {
	    	$scope.damage.hide();
	    };

	    /**
	     * Accion que se ejcuta cuando se selecciona un riesgo de la pantalla de resultados
	     * */
	    $scope.showModalDamage = function(damage) {
	    	$scope.damageModel = damage;
	    	$scope.tips = JSON.parse($scope.damageModel.tips);
	    	$scope.damage.show();
	    	$ionicScrollDelegate.$getByHandle('modalContent').scrollTop(true);
	    };
});