
/**
*	说明:功能面板：进度条滑动功能插件封装
*	obj：对象，必须有max，min属性。
*	传回调函数时，回调函数必须有有个参数，这个参数是文本框的值，
*	回调函数内部可以根据其他需要，传入其他参数，通过arguments定义。
*/
var UI={};

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
UI.progressAct=function(inputclass,options){
	if(!(this instanceof UI.progressAct)) return new UI.progressAct(inputclass,options);
	this.options = $.extend({
		changeValue:function(){

		}
	},options);
	this.selectId=inputclass;
	this.$jq=$(inputclass);
	this.$document=$(document);
	this.eventMouseMove();
	this.eventClick();
	this.inputChange();
	//获取滑动条点击图标宽度
	this.bar_iconW=this.$jq.prev().find(".act-progress-bar-icon").width();

};
UI.progressAct.prototype={
	getValue:function(){
		return $(this.selectId).val();
	},
	setValue:function(newvalue){
		$(this.selectId).val(parseFloat(newvalue));
		this.init($(this.selectId));
	},
	eventMouseMove:function(){
		var this_=this;
		// 添加鼠标按下事件
		this.$document.on("mousedown","."+$(this.selectId).parent().find(".act-progress-bar-icon").prop("className"),function(e){

			var now_btn = $(this);
			var max = Number(now_btn.parent().next("input").attr("data-max"));
			var min = Number(now_btn.parent().next("input").attr("data-min"));
			var prev_bar = now_btn.prev();
			//记录鼠标按下的坐标
			var pagex = e.pageX;
			// 记录鼠标按下时,在滑动条整体上的坐标
			//var progress_boxX=this_.$jq.prev().width();
			//var downx = pagex - progress_boxX;
			// 记录鼠标按下，鼠标在按钮上的坐标位置
			var progress_barx = now_btn.offset().left;
			var downBtnx = pagex - progress_barx;
			//获取滑动条整体在页面的水平位置
			var progress_boxX = now_btn.parent().offset().left;
			//获取滑动条整体宽度
			var progress_boxW = now_btn.parent().width();
			var w = progress_boxW - this_.bar_iconW;
			// 获取文本框
			var input = now_btn.parent().next("input");
			this_.$document.on("mousemove",function(e){
				// 记录鼠标移动的坐标
				var movex=e.pageX;
				// 记录鼠标移动,在滑动条整体上的坐标
				var distancex=movex-progress_boxX;
				var rate=(distancex-downBtnx)/w;
				var sum=max-min;
				var val;
				window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();
				if(rate<=0) rate=0;
				if(rate>=1) rate=1;
				val=(min+rate*sum).toFixed(2);
				if(distancex-downBtnx<=0){
					now_btn.css({
						left:0+"px"
					});
					input.val(val);
					console.log(val)
					this_.options.changeValue($(this_.selectId));
					return;
				}
				if(distancex-downBtnx>=w){
					now_btn.css({
						left:progress_boxW-this_.bar_iconW+"px"
					});
					prev_bar.width(progress_boxW-this_.bar_iconW);
					input.val(val);
					this_.options.changeValue($(this_.selectId));
					return;
				}
				now_btn.css({
					left:distancex-downBtnx+"px"
				});
				prev_bar.width(distancex-downBtnx);
				input.val(val);
				this_.options.changeValue($(this_.selectId));
			});
		});
		this_.$document.on("mouseup",function(){
			this_.$document.off("mousemove");
		});
	},

	eventClick:function(){
		var this_=this;
		// 点击事件
		this.$document.on("click","."+$(this.selectId).prev().prop("className"),function(e){
			// 获取文本框
			var input=$(this).next("input");
			var max=Number(input.attr("data-max"));
			var min=Number(input.attr("data-min"));
			var pagex=e.pageX;
			var offsetx=$(this).offset().left;
			var x=pagex-offsetx;

			//获取滑动条整体宽度
			var progress_boxW=$(this).width();
			var w=progress_boxW-this_.bar_iconW;
			if(x>=w) x=w;
			var rate=(Math.abs(x))/w;
			var val=min+(max-min)*rate;
			var name=$(this).next("input").attr("data-name");
			val=val.toFixed(2);
			$(this).find(".act-progress-bar-icon").css({
				left:x+"px"
			});
			$(this).find(".act-progress-bar").width(x);
			input.val(val);
			this_.options.changeValue($(this_.selectId));
		});
	},
	// 封装文本框改变事件
	inputChange:function(){
		var this_=this;
		// 绑定事件
		this.$document.on("keyup",this.selectId,function(){
			this_.init($(this));
			this_.options.changeValue($(this_.selectId));
		});
	},
	// 封装文本框与滑动条改变方法
	init:function(a){
		var this_=a;
		var max=Number(this_.attr("data-max"));
		var min=Number(this_.attr("data-min"));
		var val=this_.val();
		if(val<=min) val=min;
		if(val>=max) val=max;
		var rate=(val-min)/(max-min);
		var prevBox=this_.prev();
		var bar=prevBox.find(".act-progress-bar");
		var barIcon=prevBox.find(".act-progress-bar-icon");
		var prevBoxW=prevBox.width();
		var w=prevBoxW-this.bar_iconW;
		var name=this_.attr("data-name");
		var left=w*rate;
		barIcon.css({
			left:left+"px"
		});
		bar.width(left);
	}
};

//显示隐藏切换方法
UI.toggleDom=function(toggleClass){
	if(!(this instanceof UI.toggleDom)) return new UI.toggleDom(toggleClass);
	this.toggleClass=toggleClass;
	return $(toggleClass)[0];
};


//历史记录，开关状态
UI.switchAct=function(switched,options){
	if(!(this instanceof UI.switchAct)) return new UI.switchAct(switched,options);
	this.switchStr=switched||".on-off";
	this.options= $.extend({
		func:function(n){
			console.log(n);
		}
	},options);
	this.switched();
};
UI.switchAct.prototype={
	constructor:UI.switchAct,
	switched:function(){
		var this_=this;
		//开关，发布设置
		$(this_.switchStr).off("click");
		$(this_.switchStr).on("click",function(){
			$(this).toggleClass("on");
			var n;
			if($(this).hasClass("on")){
				n=1;
			}else{
				n=0;
			}
			this_.options.func(n);
		});
	}
};

exports.UI = UI;

