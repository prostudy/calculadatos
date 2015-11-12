 // Ionic Starter App

var db = null;
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers','starter.services','ionic.utils','Constants','ngCordova','ParamView'])

.run(function($ionicPlatform,$cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    /*if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }*/
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    if (window.cordova) {
        db = $cordovaSQLite.openDB({ name: "calc10.db" }); //device
      }else{
        db = window.openDatabase("calc10.db", '1', 'my', 1024 * 1024 * 100); // browser
      }
    
    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS challenges (" +
    		"id integer, " +
    		"text text, " +
    		"options text, " +
    		"answer text, " +
    		"value integer , " +
    		"type text, " +
    		"level text, " +
    		"createdon text, " +
    		"updatedon text, " +
    		"version text, " +
    		"PRIMARY KEY (id))");
    
    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS users (" +
    		"nick text, " +
    		"createdon text, " +
    		"updatedon text, " +
    		"PRIMARY KEY (nick))");
    
    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS challenges_users (" +
    		"id_challenge integer, " +
    		"id_user integer, " +
    		"score real, " +
    		"response text, " +
    		"attempts integer, " +
    		"createdon text, " +
    		"updatedon text, " +
    		"PRIMARY KEY (id_challenge,id_user))");
    
    
    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS damages (" +
    		"id integer, " +
    		"name text, " +
    		"description text, " +
    		"img text, " +
    		"tips text, " +
    		"PRIMARY KEY (id))");
    
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $stateProvider
  
  /*Controllador y template para la pantalla de la calculadora*/
    .state('standard', {
      url: '/standard/:challengeMode',
          templateUrl: 'templates/standardList.html',
          controller: 'StandardDataCtrl'
    })
    
    
    /*Controllador y template para la pantalla de principios*/
    .state('principios', {
      url: '/principios',
          templateUrl: 'templates/principios.html',
          controller: 'PrincipiosCtrl'
    })

     /*Controllador y template para la pantalla de resultados*/
    .state('summary', {
      url: '/summary',
          templateUrl: 'templates/summary.html',
          controller: 'SummaryCtrl'
    })

   /*Controllador y template para la pantalla de retos*/
    .state('retos', {
    url: '/retos',
        templateUrl: 'templates/challenges.html',
        controller: 'ChallengesCtrl'
    })
  
  /*Controllador y template para la pantalla de conoce mas*/
  .state('conocemas', {
	    url: '/conocemas',
        templateUrl: 'templates/conoceMas.html',
        controller: 'ConoceMasCtrl'
	  })
  
  
  /*Controllador y template para la pantalla de perfil*/
  .state('ranking', {
	   url: '/ranking',
        templateUrl: 'templates/ranking.html',
        controller: 'RankingCtrl'
	     
	  })
    
	  /*template para la pantalla de Acerca de*/
	  .state('about', {
	    url: '/about',
	        templateUrl: 'templates/about.html',	   
	        controller: 'SettingsCtrl'  
	  })
	  
	  .state('privacypolicy', {
	    url: '/privacypolicy',
	        templateUrl: 'templates/privacypolicy.html'    
	  })
	  
	  .state('help', {
	    url: '/help',
	        templateUrl: 'templates/help.html'    
	  })
	  
	   .state('estimation', {
	    url: '/estimation',
	        templateUrl: 'templates/estimation.html'    
	  });


 
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/standard/false');
  
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.views.swipeBackEnabled(true);
  $ionicConfigProvider.backButton.text('');
});



