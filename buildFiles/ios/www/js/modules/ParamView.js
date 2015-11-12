var ParamView = angular.module("ParamView",[]);
ParamView.factory('ParamView',function(){
	return {
			setObject : function(object){
				this.object = object;
			},
			getObject : function(){
				return this.object;
			}
	};
});