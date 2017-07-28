UI.input=function(inputclass,options){
	if(!(this instanceof UI.input)) return new UI.input(inputclass,options);
	this.options = this.extend({
		changeValue:function(){
		}
	},options);
	this.selectId=inputclass;
	this.event();
};
UI.input.prototype={
	getValue:function(){
		return $(this.selectId).val();
	},
	setValue:function(newvalue){
		$(this.selectId).val(parseFloat(newvalue));
	},
	extend:function(obj,obj2){
		for(var k in obj2){
			obj[k] = obj2[k];
		}
		return obj;
	},
	event:function(){
		var _this=this;
		$(document).on("keyup",this.selectId,function(){
			_this.options.changeValue($(this));
		});
	}
};

exports.UI = UI;