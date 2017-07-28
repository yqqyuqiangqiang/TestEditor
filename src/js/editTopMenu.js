var toolList=function(dom,options){
    if(!(this instanceof toolList)) return new toolList(dom,options);
    this.options = this.extend({
        toolMenuClass:".tool_menu",
        toolListClass:"ul li.tool-list"
    },options);
    // 判断传进来的是DOM还是字符串
    if((typeof dom)==="string"){
        this.dom = document.querySelector(dom);
    }else{
        this.dom = dom;
    }

    this.sonlist = document.querySelectorAll(this.options.toolListClass);
    this.init();
};
toolList.prototype={
    init:function(){
        this.event();
    },
    extend:function(obj,obj2){
        for(var k in obj2){
            obj[k] = obj2[k];
        }
        return obj;
    },
    setStyle:function(dom,objStyle){
        for(var k in objStyle){
            dom.style[k] = objStyle[k];
        }
    },
    event:function(){
        var _this=this;

        [].forEach.call(this.sonlist, function(div) {
            div.addEventListener("mouseenter",function(){
                $(this).find(_this.options.toolMenuClass).removeClass("hide");
                var sonlistnum=$(this).find(_this.options.toolMenuClass).find("li").length;
                var sonlistwith=$(this).find(_this.options.toolMenuClass).find("li").width();
                var sonmenuwidth=sonlistnum*(sonlistwith)+"px";
                $(this).find(_this.options.toolMenuClass).css({"width":sonmenuwidth});
                var fwidth=$(this).width();
                var width=$(this).find(_this.options.toolMenuClass).width();
                var widthpos="-"+(width/2-fwidth/2)+"px";
                $(this).find(_this.options.toolMenuClass).css({"left":widthpos});

            });
            div.addEventListener("mouseleave",function(){
                $(this).find(_this.options.toolMenuClass).addClass("hide");
            });
        });
        //console.log(this);
    }
};


exports.toolList = toolList;