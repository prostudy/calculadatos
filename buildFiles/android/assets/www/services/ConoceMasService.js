angular.module('starter.services')

.factory('ConoceMasService', function($http) {
  return {
	  
	  /**
	   * Realiza la lectura del archivo json que contiene la base de conocimiento de conceptos propuestos
	   * Este archivo se puede leer local, pero en un futuro puede leerse desde un servidor 
	   * remoto sin alterar la funcionalidad de la aplicación
	   * */
	  getJSONConoceMas: function(){
	 		return $http.get("data/conoceMas.json").then(function(response){
	 	    	return response.data;

	 	      });
	 }
  }
});