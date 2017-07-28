var $ = require('jquery');
require('./vendor/layer.js');
// 滑动条插件
require("./progress.js");

// 公用插件
var plugins=require("./plugins.js").plugin;


var Person=(function(a){

	function Person(select){
		this.toggleTab(".act-tab-mianban a","[data-toggle='tab']");
		this.toggleTab(".history-act-tab a","[data-toggle1='tab']");
		this.togglePick();
		this.toggleAct();
		this.toggleMaterial();
		this.togglePanel();
	};

	Person.prototype={
		init:function(){
			
		},

		//功能面板：导航栏切换
		toggleTab:plugins.toggleTab,


		//功能面板：颜色选择器,选中状态
		togglePick:plugins.togglePick,


		//功能面板：切换功能区显示隐藏
		toggleAct:plugins.toggleAct,

		//功能面板：材质库切换显示隐藏
		toggleMaterial:plugins.toggleMaterial,

		//功能面板：发布切换
		togglePanel:plugins.togglePanel,


		
	}

	function hello(select){
	    return new Person(select);
	}
	return hello;

})(window);

exports.act = Person;