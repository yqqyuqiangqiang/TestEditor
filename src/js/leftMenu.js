var leftMenu=function(dom,options){
    if(!(this instanceof leftMenu)) return new leftMenu(dom,options);
    this.options = this.extend({
        tipsBlock:".rock-block"
    },options);
    // 判断传进来的是DOM还是字符串
    if((typeof dom)==="string"){
        this.dom = document.querySelector(dom);
    }else{
        this.dom = dom;
    }

    this.init();
};
leftMenu.prototype={
    init:function(){
        this.event();
    },
    extend:function(obj,obj2){
        for(var k in obj2){
            obj[k] = obj2[k];
        }
        return obj;
    },
    event:function(){
        var _this=this;
        $(this.dom).on("mouseenter","ul li a",function(){
            $(this).parent().find(_this.options.tipsBlock).show();
        }).on("mouseleave","ul li a",function(){
            $(this).parent().find(_this.options.tipsBlock).hide();
        }).on("click","ul li a",function(){ //点击左边菜单栏切换
            $(this).parent().siblings().removeClass("active")
                .end().addClass("active");
            var target=$(this).attr("data-target");

            $('[data-leftmenu="toggle"]').hide();
            $(target).show();
        });
    }
};
exports.leftMenu = leftMenu;