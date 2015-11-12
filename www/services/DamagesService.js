angular.module('starter.services')

.factory('DamagesService', function($http,$cordovaSQLite) {
  return {
	  
	  /**
	   * Realiza la lectura del archivo json que contiene la base de conocimiento de los retos
	   * propuestos.
	   * Este archivo se puede leer local, pero en un futuro puede leerse desde un servidor 
	   * remoto sin alterar la funcionalidad de la aplicación
	   * */
	  getJSONDamages: function(){
	 		return $http.get("data/damages.json").then(function(response){
	 	    	return response.data;
	 	      });
		 },
	
	  
	  initInsertDamages:function(damage){
		 var name = damage.name;
		 var tips = JSON.stringify(damage.tips);
		 var description = damage.description;
		 var img = damage.img;
		 var query = "INSERT INTO damages (name,description,img,tips) VALUES (?,?,?,?)"; 
	       return $cordovaSQLite.execute(db, query, [name,description,img,tips]).then(function(res) {
	            return res;
	        }, function (err) {
	            console.error(err);
	        });
		 },
		 
		 getDamageById:function(damageIds){
				var query = "SELECT name,description,img,tips FROM damages WHERE id in("+damageIds+")";
				var damages = [];
					return $cordovaSQLite.execute(db, query, []).then(function(res) {
			        if(res.rows.length > 0) {
			        	for(var i=0; i<res.rows.length; i++){
			    	        damages.push(res.rows.item(i));
			    	    } 
			        	 return damages;
			        } else {
			            return 0;
			        }
			    }, function (err) {
			        console.error(err);
			    });
			}
  }
});