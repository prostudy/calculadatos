angular.module('starter.controllers')

.controller('ConoceMasCtrl', function($scope,ConoceMasService) { 
	ConoceMasService.getJSONConoceMas().then(function(response){
	    $scope.concepts = response;
	  }); 
});