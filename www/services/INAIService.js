angular.module('starter.services', [])

.factory('InaiService', function($http,Constants) {
	var classification = [];
	var challengeClassification = [];
	var ready = false;
	var challengeMode = false;
	var dataSelected = []; //Datos seleccionados que se mostraran en la ultima parte del calculo
	var damageIdsSelected = [];
	var EP = 5; //Se considera de manera inicial EP 5


  return {
	getUserData:function(mode){
		challengeMode = mode;
		return challengeMode ? challengeClassification : classification;
	},
	
	setEP:function(valueEP){
		EP = valueEP;
	},
	
	decrementEP:function(){
		return --EP;
	},
	
	increaseEP:function(){
		return ++EP;
	},

	
	/**
	 * Datos seleccionados que se mostraran en la ultima parte del calculo
	 */
	getDataSelected:function(){
		return dataSelected;
	},
	
	getDamageIdsSelected:function(){
		return damageIdsSelected;
	},
	
	/**
	 * Verifica si un dato personal ya ha sido seleccionado para mostrar en la pantalla de resultado
	 * */
	checkAndAddDataSelected(personalData) {
		  var found = dataSelected.some(function (el) {
		    return el.name === personalData.name;
		  });
		  if (!found) { dataSelected.push(personalData); }
	},
	
	removedDataSelected(personalData) {
		// Find and remove item from an array
		var i = dataSelected.indexOf(personalData.name);
		if(i != -1) {
			dataSelected.splice(i, 1);
		}
	},
	
	arrNoDupe(a) {
	    var temp = {};
	    for (var i = 0; i < a.length; i++)
	        temp[a[i]] = true;
	    var r = [];
	    for (var k in temp)
	        r.push(k);
	    return r;
	},
	
	/*checkAndAddDamages(damageIds){
		if(damageIdsSelected.length > 0){
			angular.forEach(damageIds, function(value,index){
		        angular.forEach(damageIdsSelected, function(object,index1){
		            if(value==object){
		            	
		            }else{
		            	damageIdsSelected.push(object);
		            }
		        })
		    })
		}else{
			damageIdsSelected = damageIds;
		}
	    
	},*/
	
	
	setChallengeMode:function(mode){
		challengeMode = mode;
	},
	
	getChallengeMode:function(){
		return challengeMode ;
	},
	
	isReady:function(){
		return ready;
	},
	
	getValueTotal:function(ctrlId,item){
		dataSelected = [];
		damageIdsSelected = [];
		//var EP = 5; 
		//var UM = 150;
		var totalStandardObject = this.getValueStandard(ctrlId);
		var totalSensibleObject = this.getValueSensitive(ctrlId);
		var totalCriticalObject = this.getValueCritical(ctrlId);
		
		var totalPersonalData = totalStandardObject.totalEstandar + totalSensibleObject.totalSensible  + totalCriticalObject.totalCriticos;
		//var totalEstimation = totalPersonalData * EP * Constants.UM;
		var totalEstimation = totalPersonalData;

		//Se redondean los totales
		totalEstimation = parseFloat(Math.round(totalEstimation * 100) / 100).toFixed(2);
		totalStandardObject.totalEstandar = parseFloat(Math.round(totalStandardObject.totalEstandar * 100) / 100).toFixed(2);
		totalSensibleObject.totalSensible = parseFloat(Math.round(totalSensibleObject.totalSensible * 100) / 100).toFixed(2);
		totalCriticalObject.totalCriticos = parseFloat(Math.round(totalCriticalObject.totalCriticos * 100) / 100).toFixed(2);
		
		if(item)
			this.removedDataSelected(item);
		if(damageIdsSelected.length >0 ){
			damageIdsSelected = this.arrNoDupe(damageIdsSelected);
		}
		return {"totalEstimation":totalEstimation, "totalStandardObject":totalStandardObject, "totalSensibleObject":totalSensibleObject, "totalCriticalObject":totalCriticalObject};
	},
	  
    getAllInaiClassification: function(mode){
      return $http.get("data/inaiCategories.json").then(function(response){
    	  dataSelected = [];
    	  challengeMode = mode;
        if(challengeMode){
        	challengeClassification = response.data;
            ready = true;

        	return challengeClassification;
        }else{
        	classification = response.data;
            ready = true;

        	return classification;
        }
        
      });
    },
    
    getPersonalDataStandard: function(ctrlId){
    	var levelA = challengeMode ? challengeClassification.levelStandard.levelA : classification.levelStandard.levelA;
    	var levelB = challengeMode ? challengeClassification.levelStandard.levelB : classification.levelStandard.levelB;
    	var levelC = challengeMode ? challengeClassification.levelStandard.levelC : classification.levelStandard.levelC;
    	
    	var  personalData = [];
    	for(i=0; i< levelA.categories.length; i++){
    		for(j=0; j< levelA.categories[i].personalData.length; j++){
    			personalData.push(levelA.categories[i].personalData[j]);
    		}
    	}
    	
    	for(i=0; i< levelB.categories.length; i++){
    		for(j=0; j< levelB.categories[i].personalData.length; j++){
    			personalData.push(levelB.categories[i].personalData[j]);
    		}
    	}
    	
    	for(i=0; i< levelC.categories.length; i++){
    		for(j=0; j< levelC.categories[i].personalData.length; j++){
    			personalData.push(levelC.categories[i].personalData[j]);
    		}
    	}
    	return personalData;
    },
    
    getPersonalDataSensitive: function(ctrlId){
    	var levelA = challengeMode ? challengeClassification.levelMedium.levelA : classification.levelMedium.levelA;
    	var levelB = challengeMode ? challengeClassification.levelMedium.levelB : classification.levelMedium.levelB;
    	var levelC = challengeMode ? challengeClassification.levelMedium.levelC : classification.levelMedium.levelC;
    	
    	var  personalData = [];
    	for(i=0; i< levelA.categories.length; i++){
    		for(j=0; j< levelA.categories[i].personalData.length; j++){
    			personalData.push(levelA.categories[i].personalData[j]);
    		}
    	}
    	
    	for(i=0; i< levelB.categories.length; i++){
    		for(j=0; j< levelB.categories[i].personalData.length; j++){
    			personalData.push(levelB.categories[i].personalData[j]);
    		}
    	}
    	
    	for(i=0; i< levelC.categories.length; i++){
    		for(j=0; j< levelC.categories[i].personalData.length; j++){
    			personalData.push(levelC.categories[i].personalData[j]);
    		}
    	}
    	//console.log(personalData);
    	return personalData;
    },
    
    getPersonalDataCritical: function(ctrlId){
    	var levelA = challengeMode ? challengeClassification.levelCritical.levelA : classification.levelCritical.levelA;
    	var levelB = challengeMode ? challengeClassification.levelCritical.levelB : classification.levelCritical.levelB;
    	var levelC = challengeMode ? challengeClassification.levelCritical.levelC : classification.levelCritical.levelC;
    	
    	var  personalData = [];
    	for(i=0; i< levelA.categories.length; i++){
    		for(j=0; j< levelA.categories[i].personalData.length; j++){
    			personalData.push(levelA.categories[i].personalData[j]);
    		}
    	}
    	
    	for(i=0; i< levelB.categories.length; i++){
    		for(j=0; j< levelB.categories[i].personalData.length; j++){
    			personalData.push(levelB.categories[i].personalData[j]);
    		}
    	}
    	
    	for(i=0; i< levelC.categories.length; i++){
    		for(j=0; j< levelC.categories[i].personalData.length; j++){
    			personalData.push(levelC.categories[i].personalData[j]);
    		}
    	}
    	//console.log(personalData);
    	return personalData;
    },
    
    
    
    /*Algoritmo datos estandar*/
    getValueStandard: function(ctrlId){
    	var levelA = challengeMode ? challengeClassification.levelStandard.levelA : classification.levelStandard.levelA;
    	var levelB = challengeMode ? challengeClassification.levelStandard.levelB : classification.levelStandard.levelB;
    	var levelC = challengeMode ? challengeClassification.levelStandard.levelC : classification.levelStandard.levelC;
    	
    	var E = classification.levelStandard.value;//Constante de Nivel Estandar
    	
    	//Ae, Be, Ce Valor de la ponderación basado en la categoría que corresponda del Nivel Estándar (0.2, 0.5, 0.8)
    	var Ae = levelA.value;
    	var Be = levelB.value;
    	var Ce = levelC.value;
    	
    	var sumatoria_x1 = 0; var sumatoria_x2 = 0; var sumatoria_x3 = 0;
    	var  x1 = 0; var  x2 = 0; var  x3 = 0;
    	
    	//console.log("===El usuario selecciono del nivel Estandar en el nivel A:===");
    	for(i=0; i< levelA.categories.length; i++){
    		for(j=0; j< levelA.categories[i].personalData.length; j++){
    			if(levelA.categories[i].personalData[j].check == true){
    				x1++;	
    				this.checkAndAddDataSelected(levelA.categories[i].personalData[j]);
    				damageIdsSelected = damageIdsSelected.concat(levelA.categories[i].damages);
    			}
    		}
    	}
    	sumatoria_x1 =  (x1*(x1+1)) / 2
    	var totalEstandarLevelA =  x1 > 0 ? ( ( sumatoria_x1 * Ae )  ) / x1 : 0;
    	//console.log("La sumatoria x1 es:"+sumatoria_x1);
    	//console.log("total Estandar level A:"+totalEstandarLevelA);
    	
    	
    	//console.log("===El usuario selecciono del nivel Estandar en el nivel B:===");
    	for(i=0; i< levelB.categories.length; i++){
    		for(j=0; j< levelB.categories[i].personalData.length; j++){
    			if(levelB.categories[i].personalData[j].check == true){
    				x2++;	
    				this.checkAndAddDataSelected(levelB.categories[i].personalData[j]);
    				damageIdsSelected = damageIdsSelected.concat(levelB.categories[i].damages);
    			}
    		}
    	}
    	sumatoria_x2 =  (x2*(x2+1)) / 2
    	var totalEstandarLevelB =  x2 > 0 ? ( ( sumatoria_x2 * Be )  ) / x2 : 0;
    	//console.log("La sumatoria x2 es:"+sumatoria_x2);
    	//console.log("total Estandar level B:"+totalEstandarLevelB);
    	
    	
    	//console.log("===El usuario selecciono del nivel Estandar en el nivel C:===");
    	for(i=0; i< levelC.categories.length; i++){
    		for(j=0; j< levelC.categories[i].personalData.length; j++){
    			if(levelC.categories[i].personalData[j].check == true){
    				x3++;
    				this.checkAndAddDataSelected(levelC.categories[i].personalData[j]);
    				damageIdsSelected = damageIdsSelected.concat(levelC.categories[i].damages);
    			}
    		}
    	}
    	sumatoria_x3 =  (x3*(x3+1)) / 2
    	var totalEstandarLevelC =  x3 > 0 ? ( ( sumatoria_x3 * Ce )  ) / x3 : 0;
    	//console.log("La sumatoria x3 es:"+sumatoria_x3);
    	//console.log("total Estandar level C:"+totalEstandarLevelC);
    	
    	//Total Datos Estandar
    	var numDataEstandar = x1+x2+x3;
    	var totalEstandar = ( totalEstandarLevelA + totalEstandarLevelB + totalEstandarLevelC ) * E * EP * Constants.UM;
    	return {"totalEstandar":totalEstandar, "numDataEstandar":numDataEstandar};
    },
    
    
    
    
    getValueSensitive: function(ctrlId){
    	var levelA = challengeMode ?  challengeClassification.levelMedium.levelA : classification.levelMedium.levelA;
    	var levelB = challengeMode ?  challengeClassification.levelMedium.levelB : classification.levelMedium.levelB;
    	var levelC = challengeMode ?  challengeClassification.levelMedium.levelC : classification.levelMedium.levelC;
    	
    	var M = classification.levelMedium.value;//Constante de Nivel Sensible
    	
    	//Am, Bm,Cm Valor de la ponderación basado en la categoría que corresponda del Nivel Medio (0.2, 0.5, 0.8)
    	var Am = levelA.value;
    	var Bm = levelB.value;
    	var Cm = levelC.value;
    	
    	var sumatoria_y1 = 0; var sumatoria_y2 = 0; var sumatoria_y3 = 0;
    	var  y1 = 0; var  y2 = 0; var  y3 = 0;
    	
    	//console.log("===El usuario selecciono del nivel Sensible en el nivel A:===");
    	for(i=0; i< levelA.categories.length; i++){
    		for(j=0; j< levelA.categories[i].personalData.length; j++){
    			if(levelA.categories[i].personalData[j].check == true){
    				y1++;	
    				this.checkAndAddDataSelected(levelA.categories[i].personalData[j]);
    				damageIdsSelected = damageIdsSelected.concat(levelA.categories[i].damages);
    			}
    		}
    	}
    	sumatoria_y1 =  (y1*(y1+1)) / 2
    	var totalSensibleLevelA =  y1 > 0 ? ( ( sumatoria_y1 * Am )  ) / y1 : 0;
    	//console.log("La sumatoria y1 es:"+sumatoria_y1);
    	//console.log("total Sensible level A:"+totalSensibleLevelA);
    	
    	
    	//console.log("===El usuario selecciono del nivel Sensible en el nivel B:===");
    	for(i=0; i< levelB.categories.length; i++){
    		for(j=0; j< levelB.categories[i].personalData.length; j++){
    			if(levelB.categories[i].personalData[j].check == true){
    				y2++;	
    				this.checkAndAddDataSelected(levelB.categories[i].personalData[j]);
    				damageIdsSelected = damageIdsSelected.concat(levelB.categories[i].damages);
    			}
    		}
    	}
    	sumatoria_y2 =  (y2*(y2+1)) / 2
    	var totalSensibleLevelB =  y2 > 0 ? ( ( sumatoria_y2 * Bm )  ) / y2 : 0;
    	//console.log("La sumatoria y2 es:"+sumatoria_y2);
    	//console.log("total Sensible level B:"+totalSensibleLevelB);
    	
    	
    	//console.log("===El usuario selecciono del nivel Sensible en el nivel C:===");
    	for(i=0; i< levelC.categories.length; i++){
    		for(j=0; j< levelC.categories[i].personalData.length; j++){
    			if(levelC.categories[i].personalData[j].check == true){
    				y3++;	
    				this.checkAndAddDataSelected(levelC.categories[i].personalData[j]);
    				damageIdsSelected = damageIdsSelected.concat(levelC.categories[i].damages);
    			}
    		}
    	}
    	sumatoria_y3 =  (y3*(y3+1)) / 2
    	var totalSensibleLevelC =  y3 > 0 ? ( ( sumatoria_y3 * Cm )  ) / y3 : 0;
    	//console.log("La sumatoria y3 es:"+sumatoria_y3);
    	//console.log("total Sensible level C:"+totalSensibleLevelC);
    	
    	//Total Datos Sensible
    	var numDataSensible = y1+y2+y3;
    	var totalSensible = ( totalSensibleLevelA + totalSensibleLevelB + totalSensibleLevelC ) * M * EP * Constants.UM;
    	//return totalSensible;
    	return {"totalSensible":totalSensible, "numDataSensible":numDataSensible};
    },
    
    
    
    
    
    getValueCritical: function(ctrlId){
    	var levelA = challengeMode ? challengeClassification.levelCritical.levelA : classification.levelCritical.levelA;
    	var levelB = challengeMode ? challengeClassification.levelCritical.levelB : classification.levelCritical.levelB;
    	var levelC = challengeMode ? challengeClassification.levelCritical.levelC : classification.levelCritical.levelC;
    	
    	var S = classification.levelCritical.value;//Constante de Nivel Criticos
    	
    	//Ac, Bc,Cc Valor de la ponderación basado en la categoría que corresponda del Nivel Sensible (0.2, 0.5, 0.9)
    	var Ac = levelA.value;
    	var Bc = levelB.value;
    	var Cc = levelC.value;
    	
    	var sumatoria_z1 = 0; var sumatoria_z2 = 0; var sumatoria_z3 = 0;
    	var  z1 = 0; var  z2 = 0; var  z3 = 0;
    	
    	//console.log("===El usuario selecciono del nivel Critico en el nivel A:===");
    	for(i=0; i< levelA.categories.length; i++){
    		for(j=0; j< levelA.categories[i].personalData.length; j++){
    			if(levelA.categories[i].personalData[j].check == true){
    				z1++;	
    				this.checkAndAddDataSelected(levelA.categories[i].personalData[j]);
    				damageIdsSelected = damageIdsSelected.concat(levelA.categories[i].damages);
    			}
    		}
    	}
    	sumatoria_z1 =  (z1*(z1+1)) / 2
    	var totalCriticoslevelA =  z1 > 0 ? ( ( sumatoria_z1 * Ac )  ) / z1 : 0;
    	//console.log("La sumatoria z1 es:"+sumatoria_z1);
    	//console.log("total Criticos level A:"+totalCriticoslevelA);
    	
    	
    	//console.log("===El usuario selecciono del nivel Critico en el nivel B:===");
    	for(i=0; i< levelB.categories.length; i++){
    		for(j=0; j< levelB.categories[i].personalData.length; j++){
    			if(levelB.categories[i].personalData[j].check == true){
    				z2++;	
    				this.checkAndAddDataSelected(levelB.categories[i].personalData[j]);
    				damageIdsSelected = damageIdsSelected.concat(levelB.categories[i].damages);
    			}
    		}
    	}
    	sumatoria_z2 =  (z2*(z2+1)) / 2
    	var totalCriticoslevelB =  z2 > 0 ? ( ( sumatoria_z2 * Bc )  ) / z2 : 0;
    	//console.log("La sumatoria z1 es:"+sumatoria_z2);
    	//console.log("total Criticos level B:"+totalCriticoslevelB);
    	
    	
    	//console.log("===El usuario selecciono del nivel Critico en el nivel C:===");
    	for(i=0; i< levelC.categories.length; i++){
    		for(j=0; j< levelC.categories[i].personalData.length; j++){
    			if(levelC.categories[i].personalData[j].check == true){
    				z3++;	
    				this.checkAndAddDataSelected(levelC.categories[i].personalData[j]);
    				damageIdsSelected = damageIdsSelected.concat(levelC.categories[i].damages);
    			}
    		}
    	}
    	sumatoria_z3 =  (z3*(z3+1)) / 2
    	var totalCriticoslevelC =  z3 > 0 ? ( ( sumatoria_z3 * Cc )  ) / z3 : 0;
    	//console.log("La sumatoria z1 es:"+sumatoria_z3);
    	//console.log("total Criticos level C:"+totalCriticoslevelC);
    	
    	//Total Datos Criticos
    	var numDataCriticos = z1+z2+z3;
    	var totalCriticos = ( totalCriticoslevelA + totalCriticoslevelB + totalCriticoslevelC ) * S * EP * Constants.UM;
    	return {"totalCriticos":totalCriticos, "numDataCriticos":numDataCriticos};
    },

  }
});