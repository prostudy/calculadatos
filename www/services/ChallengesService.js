/**
 * Description:Este es el servicio de la pantalla de retos.
 * Obtiene los retos del archivo data/challenges.json y los inserta en la tabla SQLite  challenges
 * Inserta el alias de un usuario en la tabla users
 * Inserta los retos resueltos por el usuario en la tabla challenges_users
 * Obtiene los diferentes niveles de los retos desde el archivo data/levels.json
 * Author:Getsir
 * Email:development@getsir.mx 
 * */

angular.module('starter.services')

.factory('ChallengesService', function($http,$localstorage,$cordovaSQLite) {
	var challenges = null;
	

  return {
	  
	  /**
	   * Realiza la lectura del archivo json que contiene la base de conocimiento de los retos
	   * propuestos.
	   * Este archivo se puede leer local, pero en un futuro puede leerse desde un servidor 
	   * remoto sin alterar la funcionalidad de la aplicación
	   * */
	  getJSONChallenges: function(){
	 		return $http.get("data/challenges.json").then(function(response){
	 	    	allchallenges = response.data;
	 	        ready = true;
	 	        return allchallenges;
	 	      });
		 },
	
	  /**
	   * Se insertan los retos recuperados desde la base de conocimiento (challenges.json)
	   * en una tabla sqlite del dispositivo
	   * */	 
	  initInsertChallenge:function(challenge){
		 var text = challenge.text;//"Selecciona todos los datos personales que correspondan a la categoría datos personales sensibles";
		 var options = JSON.stringify(challenge.options); //'[ { "id": "a", "text": "Nombre"}, { "id": "b", "text": "Huella dactilar"}, { "id": "c", "text": "Cuenta bancaria"}, { "id": "c", "text": "Estado de salud"} ]';
		 var answer = challenge.answer;//"d";
		 var value = challenge.value;//5;
		 var type = challenge.type;//"question";
		 var level = challenge.level;//"apprentice"
		 var createdon = new Date();
		 var updatedon = null;
		 var version = challenge.version;//"1.0";
		 var query = "INSERT INTO challenges (text,options,answer,value,type,level,createdon,updatedon,version) VALUES (?,?,?,?,?,?,?,?,?)"; 
	       return $cordovaSQLite.execute(db, query, [text,options,answer,value,type,level,createdon,updatedon,version]).then(function(res) {
	            return res;
	        }, function (err) {
	            console.error(err);
	        });
		 },

	 getChallenges: function(){
		 var query = "SELECT id,text,options,answer,value,type,level,createdon,updatedon,version FROM challenges";
		 var challenges = [];
			return $cordovaSQLite.execute(db, query, []).then(function(res) {
	        if(res.rows.length > 0) {
	        	for(var i=0; i<res.rows.length; i++){
	    	        challenges.push(res.rows.item(i));
	    	    } 
	            return challenges;
	        } else {
	            console.log("No results found");
	        }
	    }, function (err) {
	        console.error(err);
	    });
		    
	 },
	 
	 /**
	  * Selecciona los ids de los retos que el usuario ya ha realizado
	  * */
	 getChallengesUsersIds: function(){
		 var query = "SELECT id_challenge FROM challenges_users ORDER BY id_challenge";
		 var challenges = [];
			return $cordovaSQLite.execute(db, query, []).then(function(res) {
	        if(res.rows.length > 0) {
	        	for(var i=0; i<res.rows.length; i++){
	    	        challenges.push(res.rows.item(i).id_challenge);
	    	    } 
	            return challenges;
	        } else {
	            return 0;
	        }
	    }, function (err) {
	        console.error(err);
	    });
	 },
	 
	 getNextChallengeNotIn: function(ids){
		 var query = "SELECT id,text,options,answer,value,type,level,createdon,updatedon,version FROM challenges where id not in("+ids+") ORDER BY id LIMIT 1";
			return $cordovaSQLite.execute(db, query, []).then(function(res) {
	        if(res.rows.length > 0) {
	        	return res.rows.item(0);
	        } else {
	            return 0;
	        }
	    }, function (err) {
	        console.error(err);
	    });
	 },
	 
	 /**
	  * Obtiene un usuario local de la aplicación
	  * En un futuro se puede implementar multiples usuarios
	  * */
	 getUserRegister: function(){
		 var query = "SELECT rowid,nick FROM users limit 1";
			return $cordovaSQLite.execute(db, query, []).then(function(res) {
	        if(res.rows.length > 0) {
	        	return res.rows.item(0);
	        } else {
	        	 return false;
	        }
	    }, function (err) {
	        console.error(err);
	    });
		    
	 },
	 
	 insertUser:function(nick){
		 var query = "INSERT INTO users (nick,createdon) VALUES (?,?)";
	       return $cordovaSQLite.execute(db, query, [nick, new Date()]).then(function(res) {
	            return res;
	        }, function (err) {
	            console.error(err);
	        });
	 },  

	getChallengeById:function(challengeId){
		var query = "SELECT id,text,options,answer,value,type,level,createdon,updatedon,version FROM challenges WHERE id = ? limit 1";
		 var challenge = null;
			return $cordovaSQLite.execute(db, query, [challengeId]).then(function(res) {
	        if(res.rows.length > 0) {
	    	        return res.rows.item(0);
	        } else {
	            console.log("No results found");
	        }
	    }, function (err) {
	        console.error(err);
	    });
	},
	
	
	/**
	 * Asocia un reto con un usuario y su respuesta
	 * */
	insertChallengeUser:function(challengeId,userId,score,response,attempts){
		 var query = "INSERT INTO challenges_users (id_challenge,id_user,score,response,attempts,createdon) VALUES (?,?,?,?,?,?)"; 
	       return $cordovaSQLite.execute(db, query, [challengeId,userId,score,response,attempts,new Date()]).then(function(res) {
	            return res;
	        }, function (err) {
	            console.error(err);
	        });
	},
	
	
	/**
	  * Obtiene el score del usuario
	  * */
	 getScoreBy: function(idUser){
		 var query = "SELECT sum(score) as score FROM challenges_users where id_user = ?";
			return $cordovaSQLite.execute(db, query, [idUser]).then(function(res) {
	        if(res.rows.length > 0) {
	        	return  res.rows.item(0).score;
	        } else {
	            return 0;
	        }
	    }, function (err) {
	        console.error(err);
	    });
	 },
	 
	 
	 
	 /**
	  * Selecciona los retos resueltos por el usuario, para la pantalla de perfil de usuario
	  * */
	 getChallengesUsers: function(){
		 var query = "SELECT id_challenge, id_user,score,response,attempts FROM challenges_users ORDER BY id_challenge";
		 var challenges_users = [];
			return $cordovaSQLite.execute(db, query, []).then(function(res) {
	        if(res.rows.length > 0) {
	        	for(var i=0; i<res.rows.length; i++){
	        		challenges_users.push(res.rows.item(i));
	    	    } 
	            return challenges_users;
	        } else {
	            return 0;
	        }
	    }, function (err) {
	        console.error(err);
	    });
	 },
	 
	 
	 /**
	  * Obtiene los rangos de los niveles
	  */
	 getJSONLevels: function(){
	 		return $http.get("data/levels.json").then(function(response){
	 	    	return response.data;
	 	      });
		 }
	
  }
});