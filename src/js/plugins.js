
var plugins=(function(){

	function Plugin(select){
		
	};

	Plugin.prototype={
		//功能面板：导航栏切换
		toggleTab:function(tabClass,dataClass){
			var $toggle_tab=$(tabClass);

			$toggle_tab.on("click",function(){
				var data=$(this).attr("data-set");
				$(this).parent().siblings().removeClass("active")
				.end().addClass("active");
				$(dataClass).hide();
				$(data).show();
			});
		},

		//功能面板：颜色选择器,选中状态
		togglePick:function(){
			var $material_color=$(".material-color span");
			var $material_color_select=$(".act .material-color i");

			// 颜色选择器
			$material_color.on("click",function(){
				
			});

			// 选中状态
			$material_color_select.on("click",function(){
				$(this).toggleClass("selected");
			});

		},

		//功能面板：切换功能区显示隐藏
		toggleAct:function(){
			// 获取切换按钮
			var $toggle=$(".diffuse-tit");
			// 添加点击切换事件
			$toggle.on("click",function(){
				$('#act').perfectScrollbar('update');
				var this_=$(this);
				var $next=this_.next();
				if($next.css("display")=="none"){
					$next.stop(true).slideDown(300);
					this_.find(".act-toggle-icon").removeClass("active");
				}else{
					$next.stop(true).slideUp(300);
					this_.find(".act-toggle-icon").addClass("active");
				}
			});
		},

		//功能面板：材质库切换显示隐藏
		toggleMaterial:function(){
			// 获取切换按钮
			var $select=$(".act .material-selected select");
			// 添加点击切换事件
			$select.on("change",function(){
				var val=$(this).val();
				console.log(val)
				$("[data-material='func']").hide();
				$("#"+val).show();
			});
		},

		//发布切换
		togglePanel:function(){
			$(".edit-head-action .issue-top").on("click",function(){
				$(this).parent().addClass("active");
					$(".history-act").animate({
						left:0
					},100);

			});
			$(".issue-con-cancel").on("click",function(){
				$(".history-act").animate({
					left:"100%"
				},200);
				$(".edit-head-action .issue-top").parent().removeClass("active");
			});
		}
	};

	return new Plugin();
})();

exports.plugin = plugins;