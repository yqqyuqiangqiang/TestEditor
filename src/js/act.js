//var elementTemplte = require("./html/elementlist.art");

var $ = require('jquery');
var editor =new Editor();
var viewport = new Viewport(editor);
var person = require("./init").act;
var toolList = require("./editTopMenu").toolList;
var elementEffect = require("./elmEffect").elmEffect;
var addMoObject = require("./add_MoObjects").addMoObject;
var leftMenu = require("./leftMenu").leftMenu;
var UI = require("./progress").UI;
require("./history");


// 初始化
person().init();

//左侧滚动条
$('#domscrool').perfectScrollbar({});
$('#domscrool').perfectScrollbar('update');
$('#propertyscroll').perfectScrollbar({});
$('#propertyscroll').perfectScrollbar('update');

//顶部工具栏
toolList(".tool-list",{});

//左侧分类列表
leftMenu(".edit-left-menu",{});
//资源菜单列表
elementEffect.resourceMenu();

//layui初始化

var elem=elementEffect.menuEffect({
	toggleClass:".leavel-2",
	yanjingActive:function(dom){
		var object = editor.scene.getObjectByName(dom.data("name"));
		object.visible = true;
		alert("显示");
	},
	yanjingDelActive:function(dom){
		var object = editor.scene.getObjectByName(dom.data("name"));
		object.visible = false;
		alert("隐藏");
	},
	delCallBack:function(dom){
		var object = editor.scene.getObjectByName(dom.data("name"));
		editor.scene.remove(object);

		$('#domscrool').perfectScrollbar('update');
	},
	elmToggle:function(){
		$('#domscrool').perfectScrollbar('update');
	},
	selectList:function(dom){
		var object = editor.scene.getObjectByName(dom.data("name"));
		if(object)
		{
			editor.selected = object;
			editor.signals.objectSelected.dispatch( object );
		}
		console.log(dom.data("name"));
	}
});
editor.element=elem;

//顶部菜单事件
$(".edit-tool li a").click(function(e){
	e.preventDefault();
});

var users = {"list":[
	{type:"huanjingqiu",name:"hj_01",visible:true},
	{type:"xiangji",name:"sxj_01",visible:true},
	/*{type:"moxing",name:"sxj_01",visible:true,children:""},
	{type:"moxing",name:"sxj_01",visible:true,children:""},
	{type: 'moxing', name: 'moxing_01',visible:true,children:[{type:"moxing",name:"mx_01",visible:true}, {type:"moxing",name:"mx_02",visible:true}]},
	{type:"dengguang",name:"dg_01",visible:true}*/
]};


var property ={"property":{type:"moxing",position:{x:1,y:1,z:1},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1}}};

/*var users1 = {"list":[
	{type:"huanjingqiu",name:"hj_01",visible:true},
	{type:"xiangji",name:"sxj_01",visible:true},
	{type:"moxing",name:"sxj_01",visible:true,children:""},
	{type: 'moxing', name: 'moxing_01',visible:true,children:[{type:"moxing",name:"mx_01",visible:true}, {type:"moxing",name:"mx_02",visible:true}]},
	{type:"dengguang",name:"dg_01",visible:true}
]};*/
//var tem=require('./elementlist.html')
//var html=tem(users);
var html =template("elementlist", users);
$("#element-list").append(html);

//var prohtml =template("elementProperty", property);
//$("#model-property").html(prohtml);

$('#domscrool').perfectScrollbar('update');
$(".fangxing").click(function(){
	var objname = addMoObject.add_jiheti(editor,"fangxing");
	add_xingZhuang(objname,"moxing");

});

$(".yuanxing").click(function(){
	var objname = addMoObject.add_jiheti(editor,"yuanxing");
	add_xingZhuang(objname,"moxing")
});
$(".qiuti").click(function(){
	var objname = addMoObject.add_jiheti(editor,"qiuti");
	add_xingZhuang(objname,"moxing")
});
$(".lifangti").click(function(){
	var objname = addMoObject.add_jiheti(editor,"lifangti");
	add_xingZhuang(objname,"moxing")
});

$(".pointLight").click(function(){
	var objname = addMoObject.add_light(editor,"pointLight");
	add_xingZhuang(objname,"light");

});
$(".spotLight").click(function(){
	var objname = addMoObject.add_light(editor,"spotLight");
	add_xingZhuang(objname,"light")
});
$(".dirLight").click(function(){
	var objname = addMoObject.add_light(editor,"dirLight");
	add_xingZhuang(objname,"light")
});
$(".ambLight").click(function(){
	var objname = addMoObject.add_light(editor,"ambLight");
	add_xingZhuang(objname,"light")
});
//
//// 滑动条功能
//$(".act-progress-bar-icon").progressAct({
//	func:function(obj){
//		//editor.moveModel(obj);
//	}
//});


var px=UI.input("#px",{
	changeValue:function(dom){
		update();
	}
});

var py=UI.input("#py",{
	changeValue:function(dom){
		
		update();
	}
});
var pz=UI.input("#pz",{
	changeValue:function(dom){
		update();
	}
});
var rx=UI.progressAct("#rx",{
	changeValue:function(dom){
		update();

	}
});
var ry=UI.progressAct("#ry",{
	changeValue:function(dom){
		console.log("111");
		update();
	}
});
var rz=UI.progressAct("#rz",{
	changeValue:function(dom){
		console.log("111");
		update();
	}
});
var sx=UI.progressAct("#sx",{
	changeValue:function(dom){
		update();

	}
});
var sy=UI.progressAct("#sy",{
	changeValue:function(dom){
		
		update();
	}
});
var sz=UI.progressAct("#sz",{
	changeValue:function(dom){
		
		update();
	}
});

var materialColor ; 
var cameraPropetry = UI.toggleDom("#shexiangji");
var cameraWu = UI.toggleDom("#wu");


//UI.toggleDom([string]) 切换显示隐藏dom元素
//console.log(UI.toggleDom(".on-off"));
function update() {
	var object = editor.selected;
	if(object)
	{
		var newPosition = 	new THREE.Vector3( 
			parseFloat(px.getValue()),
			parseFloat(py.getValue()),
			parseFloat(pz.getValue())
			);
		
		if ( object.position.distanceTo( newPosition ) >= 0.01 ) {
			//editor.setHistory("setPosition",object,object.position.clone());
			object.position.copy(newPosition);
			object.updateMatrixWorld( true );
			editor.signals.objectChanged.dispatch(object);
			
		}
		var newRotation = new THREE.Euler( 
			parseFloat(rx.getValue()) * THREE.Math.DEG2RAD, 
			parseFloat(ry.getValue()) * THREE.Math.DEG2RAD, 
			parseFloat(rz.getValue()) * THREE.Math.DEG2RAD );
			
		if(object.rotation.toVector3().distanceTo( newRotation.toVector3() ) >= 0.01)
		{
			//editor.setHistory("setRotation",object,object.rotation.clone());
			object.rotation.copy(newRotation );
			object.updateMatrixWorld( true );
			editor.signals.objectChanged.dispatch( object );
		}
		var newScale = new THREE.Vector3( 
			parseFloat(sx.getValue()), 
			parseFloat(sy.getValue()), 
			parseFloat(sz.getValue()) );
		if ( object.scale.distanceTo( newScale ) >= 0.01 ) {
			//editor.setHistory("setScale",object,object.scale.clone());
			object.scale.copy(newScale);
			object.updateMatrixWorld( true );
			editor.signals.objectChanged.dispatch(object);
		}
	}
}
	
	
	editor.signals.refreshSidebarObject3D.add( function ( object ) {

		if ( object !== editor.selected ) return;

		editor.update_element( object );

	} );

editor.update_element = function ()
{
	
	//console.log(666);
	/*if( editor.selected)
	{
		px.value = parseFloat( editor.selected.position.x).toFixed(2);	
	}*/
	var object = editor.selected; 
	cameraPropetry.style.display = "none";
	cameraWu.style.display = "none";
	px.setValue(parseFloat( object.position.x).toFixed(2));
	py.setValue(parseFloat( object.position.y).toFixed(2));
	pz.setValue(parseFloat( object.position.z).toFixed(2));
	
	rx.setValue(parseFloat( object.rotation.x/THREE.Math.DEG2RAD).toFixed(2));
	ry.setValue(parseFloat( object.rotation.y/THREE.Math.DEG2RAD).toFixed(2));
	rz.setValue(parseFloat( object.rotation.z/THREE.Math.DEG2RAD).toFixed(2));
	
	sx.setValue(parseFloat( object.scale.x).toFixed(2));
	sy.setValue(parseFloat( object.scale.y).toFixed(2));
	sz.setValue(parseFloat( object.scale.z).toFixed(2));
	
	
	if ( object instanceof THREE.PerspectiveCamera )
	{
		cameraPropetry.style.display = "block";
		cameraWu.style.display = "block";
	}
	
}

function add_xingZhuang(name,type)
{
	
	var add_mx = {"list":[
	{type:type,name:name,visible:true,children:""},
	]};
	var add_xz =template("elementlist", add_mx);
	$("#element-list").append(add_xz);
	$('#domscrool').perfectScrollbar('update');
	elem.addElement(name);
}

// 颜色选择器
$('.color').colorPicker({
	    customBG: '#999',
		margin: '4px -2px 0',
		doRender: 'div div',
		buildCallback: function($elm) {
			var colorInstance = this.color,
				colorPicker = this;
			$elm.prepend('<div class="cp-panel">' +
				'R <input type="text" class="cp-r" /><br>' +
				'G <input type="text" class="cp-g" /><br>' +
				'B <input type="text" class="cp-b" /><hr>' +
				'H <input type="text" class="cp-h" /><br>' +
				'S <input type="text" class="cp-s" /><br>' +
				'B <input type="text" class="cp-v" /><hr>' +
				'<input type="text" class="cp-HEX" />' +
			'</div>').on('change', 'input', function(e) {
				var value = this.value,
					className = this.className,
					type = className.split('-')[1],
					color = {};

				color[type] = value;
				colorInstance.setColor(type === 'HEX' ? value : color,
					type === 'HEX' ? 'HEX' : /(?:r|g|b)/.test(type) ? 'rgb' : 'hsv');
				colorPicker.render();
				this.blur();
			});
		},

		cssAddon: // could also be in a css file instead
			'.cp-color-picker{box-sizing:border-box; width:226px; z-index:1000;}' +
			'.cp-color-picker .cp-panel {line-height: 21px; float:right;' +
				'padding:0 1px 0 8px; margin-top:-1px; overflow:visible}' +
			'.cp-xy-slider:active {cursor:none;}' +
			'.cp-panel, .cp-panel input {color:#bbb; font-family:monospace,' +
				'"Courier New",Courier,mono; font-size:12px; font-weight:bold;}' +
			'.cp-panel input {width:28px; height:12px; padding:2px 3px 1px;' +
				'text-align:right; line-height:12px; background:transparent;' +
				'border:1px solid; border-color:#222 #666 #666 #222;}' +
			'.cp-panel hr {margin:0 -2px 2px; height:1px; border:0;' +
				'background:#666; border-top:1px solid #222;}' +
			'.cp-panel .cp-HEX {width:44px; position:absolute; margin:1px -3px 0 -2px;}' +
			'.cp-alpha {width:155px;}',

		renderCallback: function($elm, toggled) {
			var colors = this.color.colors.RND,
				modes = {
					r: colors.rgb.r, g: colors.rgb.g, b: colors.rgb.b,
					h: colors.hsv.h, s: colors.hsv.s, v: colors.hsv.v,
					HEX: this.color.colors.HEX
				};

			$('input', '.cp-panel').each(function() {
				this.value = modes[this.className.substr(3)];
			});
		}
});


// 功能面板滚动条
$('.act1').perfectScrollbar();


// 材质名称
$(".act-material .material-input-name").on("change",function(){
	var name=$(this).val();
	console.log(name);
});

// 材质图片点击事件
$(".act-material .material-global-img").on("click",function(){

});
// 属性区图片点击
$(".act-diffuse .diffuse-fun-l-mb").on("click",function(){

});

// 属性区图片取消按钮
$(".act-diffuse .diffuse-fun-l-cancel").on("click",function(){

});

// 属性区图片放大按钮
$(".act-diffuse .diffuse-fun-l-enlarge").on("click",function(){

});

// 法线，凹凸按钮切换
$(".act-normal .act-normal-btn button").on("click",function(){
	$(this).addClass("active").siblings().removeClass("active");
});


// 法线勾选状态
$(".act-normal-select i").on("click",function(){
	$(this).toggleClass("selected");
	$(this).parent().siblings().find("i").removeClass("selected");

});

// 创建
$(".act .act-material-create").on("click",function(){
});

// 复制
$(".act .act-material-copy").on("click",function(){
});

// 粘贴
$(".act .act-material-paste").on("click",function(){
});

// 保存
$(".act .act-material-save").on("click",function(){
	console.log(111111);
	layer.open({
		type: 3
		,title: false //不显示标题栏
		,closeBtn: 2
		,shade:0
		,area: '300px;'
		,shade: 0.8
		,id: 'LAY_layuipro' //设定一个id，防止重复弹出
		// ,btn: ['X']
		,moveType: 1 //拖拽模式，0或者1
		,content: "html"

	});
});


/*摄像机 */
//雾属性
$(".wu-select").on("change",function(){
	var val=$(this).val();
	$(".wu-progress>div").hide();
	$("[data-wu="+val+"]").show();
});

/*发布功能*/

//开关，发布设置
var switched=UI.switchAct();

//开关，发布设置
var switched=UI.switchAct("#switch-sm",{
	func:function(flag){
		console.log(flag)//0,1
		var $mask;
		if(!flag){
			$mask=$("<div class='VR-set-mask' style='display: none;position:absolute;left: 0;top: 0;width: 100%;height: 100%;background-color: rgba(89,89,89,0.6);'></div>");
			$(".act-setvr .act-material-color").append($mask);
			$(".act-setvr .act-material-color .VR-set-mask").fadeIn(150);
		}else{
			var mask=$(".act-setvr .act-material-color .VR-set-mask");
			mask?mask.fadeOut(200,function(){
				mask.remove();
			}):"";
		}
	}
});

// 颜色选择器
$('.comment-color').colorPicker({
	customBG: '#999',
	margin: '4px -2px 0',
	doRender: 'div div',
	buildCallback: function($elm) {
		var colorInstance = this.color,
				colorPicker = this;
		console.log(this)
		$elm.prepend('<div class="cp-panel">' +
				'R <input type="text" class="cp-r" /><br>' +
				'G <input type="text" class="cp-g" /><br>' +
				'B <input type="text" class="cp-b" /><hr>' +
				'H <input type="text" class="cp-h" /><br>' +
				'S <input type="text" class="cp-s" /><br>' +
				'B <input type="text" class="cp-v" /><hr>' +
				'<input type="text" class="cp-HEX" />' +
				'</div>').on('change', 'input', function(e) {
			var value = this.value,
					className = this.className,
					type = className.split('-')[1],
					color = {};

			color[type] = value;
			colorInstance.setColor(type === 'HEX' ? value : color,
					type === 'HEX' ? 'HEX' : /(?:r|g|b)/.test(type) ? 'rgb' : 'hsv');
			colorPicker.render();
			this.blur();
		});
	},

	cssAddon: // could also be in a css file instead
	'.cp-color-picker{box-sizing:border-box; width:226px;}' +
	'.cp-color-picker .cp-panel {line-height: 21px; float:right;' +
	'padding:0 1px 0 8px; margin-top:-1px; overflow:visible}' +
	'.cp-xy-slider:active {cursor:none;}' +
	'.cp-panel, .cp-panel input {color:#bbb; font-family:monospace,' +
	'"Courier New",Courier,mono; font-size:12px; font-weight:bold;}' +
	'.cp-panel input {width:28px; height:12px; padding:2px 3px 1px;' +
	'text-align:right; line-height:12px; background:transparent;' +
	'border:1px solid; border-color:#222 #666 #666 #222;}' +
	'.cp-panel hr {margin:0 -2px 2px; height:1px; border:0;' +
	'background:#666; border-top:1px solid #222;}' +
	'.cp-panel .cp-HEX {width:44px; position:absolute; margin:1px -3px 0 -2px;}' +
	'.cp-alpha {width:155px;}',

	renderCallback: function($elm, toggled) {
		var colors = this.color.colors.RND,
				modes = {
					r: colors.rgb.r, g: colors.rgb.g, b: colors.rgb.b,
					h: colors.hsv.h, s: colors.hsv.s, v: colors.hsv.v,
					HEX: this.color.colors.HEX
				};

		$('input', '.cp-panel').each(function() {
			this.value = modes[this.className.substr(3)];
		});
	}
});
