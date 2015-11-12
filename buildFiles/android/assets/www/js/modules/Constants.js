var Constants = angular.module("Constants",[]);
Constants.factory("Constants",function(){
	obj = {
			//LOCALSTORAGE KEYS
			KEY_TABLE_CHALLENGES_LOADED: 'KEY_TABLE_CHALLENGES_LOADED',
			OBJECT_LEVEL : 'OBJECT_LEVEL',
			KEY_RESTART_CHALLENGES : 'KEY_RESTART_CHALLENGES',
			KEY_SHOW_HELP_SCREENS : 'KEY_SHOW_HELP_SCREENS',
			KEY_SHARE_SOCIAL : 'KEY_SHARE_SOCIAL',
			KEY_SHARE_WITH_INAI : 'KEY_SHARE_WITH_INAI',
			KEY_TABLE_DAMAGES_LOADED : 'KEY_TABLE_DAMAGES_LOADED', 
			
			//Valores formula
			UM : 150,
			EP : 5,
			
			MAXLENGTH_NICK : 10,
			
			
			//MENSAJES PARA EL USUARIO
			STR_CORRECT_CHALLENGE: "Tu respuesta ha sido correcta",
			STR_FAIL_CHALLENGE: "Tu respuesta no es correcta",
			STR_ERROR_NICKNAME : "Ingresa tu alias.",
	};
	return obj;
});