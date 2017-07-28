var elmEffect={};
elmEffect.menuEffect=function(options){
    if(!(this instanceof elmEffect.menuEffect)) return new elmEffect.menuEffect(options);
    this.options = this.extend({
        toggleClass:".leavel-2",
        yanjingActive:"",
        yanjingDelActive:"",
        delCallBack:"",
        elmToggle:"",
        selectList:""

    },options);
    this.init();
};
elmEffect.menuEffect.prototype={
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
        $(".edit-element").on("click",".has-son",function(e){
            e.stopPropagation();
            var elmToggle=$(this).parentsUntil(".list-block").parent().parent().find(_this.options.toggleClass);
            if(elmToggle.hasClass("toggleActive")){
                $(elmToggle).stop(true).slideUp(300,function(){
                    _this.options.elmToggle();
                });
                elmToggle.removeClass("toggleActive");
                $(this).parent().find(".jianhao").removeClass("jianhao").addClass("jiahao");
            }else{
                $(elmToggle).stop(true).slideDown(300,function(){
                    _this.options.elmToggle();
                });
                elmToggle.addClass("toggleActive");
                $(this).parent().find(".jiahao").removeClass("jiahao").addClass("jianhao");

            }
            //_this.options.elmToggle();
        });
        $(".edit-element").on("click",".yanjing",function(e){
            e.stopPropagation();
            if($(this).hasClass("active")){
                $(this).removeClass("active");
                _this.options.yanjingDelActive($(this).parentsUntil(".list-block").parent());
            }else{
                $(this).addClass("active");
                _this.options.yanjingActive($(this).parentsUntil(".list-block").parent());
            }
        });
        $(".edit-element").on("click",".delete",function(e){
            e.stopPropagation();
            var dom=$(this).parentsUntil(".list-block").parent();
            _this.options.delCallBack(dom);
            $(this).parentsUntil(".list-block").parent().remove();
        });

        $(".edit-element").on("click",".list-block",function(e){
            e.stopPropagation();
            if($(this).hasClass("active")){
                $(".list-block").removeClass("active");
            }else{
                $(".list-block").removeClass("active");
                $(this).addClass("active");
                _this.options.selectList($(this));
            }
        });
    },
    addElement:function(name){
        $(".list-block").removeClass("active");
        $(".list-block[data-name='"+name+"']").addClass("active");

    }
};
elmEffect.resourceMenu=function(options){
    if(!(this instanceof elmEffect.resourceMenu)) return new elmEffect.resourceMenu(options);
    this.options = this.extend({
        targetdiv:".tab-sources-t.hasson"
    },options);
    this.init();
};
elmEffect.resourceMenu.prototype={
    init:function(){
        this.event();
        this.setColor($(".eidt-color"));
    },
    extend:function(obj,obj2){
        for(var k in obj2){
            obj[k] = obj2[k];
        }
        return obj;
    },
    event:function(){
        var _this=this;
        var targetdev= $(this.options.targetdiv);
        $(".create").on("click",function(){
            $(this).siblings(".create-block").addClass("active");
            //layer.open({
            //    type: 1,
            //    content: '传入任意的文本或html' //这里content是一个普通的String
            //});
        });
        $(".create-block .del-button").on("click",function(){
            $(this).parent().removeClass("active");
            $(this).siblings("input").val("");
        });
        $(".create-block .eidt-button").on("click",function(){
            var inputval=$(this).siblings("input").val();
            var color=$(this).parent().find(".eidt-color").data("color");
            if(inputval!==""){
                var html='<li class=""> ' +
                    '<i class="icon iconfont icon-wenjianjia" style="color:'+ color +'"></i>' +
                    '<div class="eidt-color hide" data-color="'+ color +'" style="background:'+ color +'"></div> ' +
                    '<input value="'+ inputval +'" disabled="disabled"> ' +
                    '<div class="eidt-buttonactive"><i class="icon iconfont icon-duihao"></i></i></div>'+
                    '<div class="eidt-button"><i class="icon iconfont icon-editor"></i></div> ' +
                    '<div class="del-button"><i class="icon iconfont icon-shanchu"></i></div> ' +
                    '</li>';
                var targetHtml=$(html);
                _this.setColor(targetHtml.find(".eidt-color"));
                targetdev.find("ul").prepend(targetHtml);
                $(this).siblings("input").val("");
                $(this).parent().removeClass("active");
            }else{
                alert("值不能为空");
            }
        });

        $(".sources-manage").click(function(){
                $(".sources-manage-over").show();
                $(".sources-manage-btn").show();
                $(this).hide();

                    _this.manage=true;
                    targetdev.off("mouseenter","ul li",_this.showedit).on("mouseenter","ul li",_this.showedit);
                    targetdev.off("mouseleave","ul li",_this.hieedit).on("mouseleave","ul li",_this.hieedit);


        });
        $(".sources-manage-over").click(function(){
            _this.manage=false;
            targetdev.off("mouseenter","ul li",_this.showedit);
            targetdev.off("mouseleave","ul li",_this.hieedit);
            $(this).hide();
            $(".sources-manage-btn").hide();
            $(".sources-manage").show();



        });

        targetdev.on("click","ul .eidt-button",function(e){
            e.stopPropagation();
            targetdev.off("mouseleave", "ul li",_this.hieedit);
            targetdev.off("mouseenter", "ul li",_this.showedit);
            $(this).siblings(".eidt-buttonactive").show().end().hide();
            $(this).siblings("input").attr("disabled",false).focusout();
        });
        targetdev.on("click","ul .eidt-buttonactive",function(e){
            e.stopPropagation();
            $(this).siblings(".eidt-button").show().end().hide();
            $(this).siblings("input").attr("disabled",true).focusout();
            targetdev.on("mouseleave", "ul li",_this.hieedit);
            targetdev.on("mouseenter", "ul li",_this.showedit);
            alert("编辑成功");
            $(this).parent().trigger("mouseleave");


        });
        targetdev.on("click","ul .del-button",function(){
            if(_this.manage){
                targetdev.on("mouseenter", "ul li",_this.showedit);
                targetdev.on("mouseleave", "ul li",_this.hieedit);
            }else{
                targetdev.off("mouseenter", "ul li",_this.showedit);
                targetdev.off("mouseleave", "ul li",_this.hieedit);
            }
            $(this).parent().remove();
        });
        $(".tab-type").click(function(){
            var _this=this;
            //console.log(this);
            if($(this).hasClass("active")){
                //console.log($(this).find("i"));
                $(this).find("i").addClass("icon-gongyongsanjiaoxingzuobian").removeClass("icon-gongyongsanjiaoxingzuobian1");
                $(this).siblings(".type-block").stop(true).slideUp(300,function(){
                    $(_this).removeClass("active");
                    $(_this).css("border-bottom-width","0px");

                });
            }else{
                $(this).find("i").addClass("icon-gongyongsanjiaoxingzuobian1").removeClass("icon-gongyongsanjiaoxingzuobian");
                $(_this).css("border-bottom-width","1px");
                $(this).siblings(".type-block").stop(true).slideDown(300,function(){
                    $(_this).addClass("active");

                });
            }

        });
        $(".tab-type").click();


    },
    oldcolor:"",
    manage:false,
    //editactive:function(){
    //    $(this).hide().siblings(".eidt-button").show();
    //    $(this).siblings("input").attr("disabled",false).focusout();
    //    console.log("111");
    //},
    //editclick:function(){
    //    targetdev.off("mouseleave", "ul li",_this.hieedit);
    //    targetdev.off("mouseenter", "ul li",_this.showedit);
    //    $(this).hide().siblings(".eidt-buttonactive").show();
    //    $(this).siblings("input").attr("disabled",true).focusout();
    //    //if($(this).hasClass("active")){
    //    //    $(this).removeClass("active").find("i").removeClass("icon-duihao").addClass("icon-editor");;
    //    //    $(this).siblings("input").attr("disabled",true).focusout();
    //    //}else{
    //    //    $(this).siblings("input").attr("disabled",false).focus();
    //    //    $(this).addClass("active").find("i").removeClass("icon-editor").addClass("icon-duihao");
    //    //}
    //},
    showedit:function(){
        $(this).addClass("active").find("input").addClass("edit");
        $(this).find(".eidt-color,.eidt-button,.eidt-buttonactive,.del-button").show();
    },
    hieedit:function(){
        $(this).removeClass("active").find("input").removeClass("edit");
        $(this).find(".eidt-color,.eidt-button,.eidt-buttonactive,.del-button").hide();
        $(this).find("input").attr("disabled",true);
        //console.log($(this));
        //$(this).find(".eidt-button").removeClass("active").find("i").removeClass("icon-duihao").addClass("icon-editor");;
        //$(this).find(".eidt-button").siblings("input").attr("disabled",true).focusout();
    },
    setColor:function(JqObj){
        var oldcolor= "";
        var _this=this;
        var targetdev= $(this.options.targetdiv);
        JqObj.colorPicker({
            customBG: '#999',
            margin: '-18px -2px 0 15px',
            doRender: 'div div',
            buildCallback: function($elm,$target) {
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

                //console.log($elm);

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

            renderCallback: function($elm) {


                var colors = this.color.colors.RND,
                    modes = {
                        r: colors.rgb.r, g: colors.rgb.g, b: colors.rgb.b,
                        h: colors.hsv.h, s: colors.hsv.s, v: colors.hsv.v,
                        HEX: this.color.colors.HEX
                    };
                $elm.parent().find(".icon-wenjianjia").css("color","#"+modes.HEX);
                $('input', '.cp-panel').each(function() {
                    this.value = modes[this.className.substr(3)];
                });


            },
            positionCallback:function($elm){
                //console.log(this);
                _this.oldcolor= $elm.parent().find(".eidt-color").data("color");
                $(document.body).off('.tcp');
                targetdev.off("mouseleave", "ul li",_this.hieedit);
                targetdev.off("mouseenter", "ul li",_this.showedit);
                var colorInstance = this.color;
                var colorPicker = this;
                var ui=this.$UI;
                ui.find(".color-button").remove();
                ui.append( '<div class="color-button"><div class="color-cancel">取消</div><div  class="color-ok">确定</div></div>');
                ui.find(".color-ok").click(function(e){
                    e.stopPropagation();
                    $elm.parent().find(".eidt-color").data("color","#"+colorPicker.color.colors.HEX);
                    _this.oldcolor= "#"+colorPicker.color.colors.HEX;

                    if(_this.manage){
                        targetdev.on("mouseenter", "ul li",_this.showedit);
                        targetdev.on("mouseleave", "ul li",_this.hieedit);
                    }else{
                        targetdev.off("mouseenter", "ul li",_this.showedit);
                        targetdev.off("mouseleave", "ul li",_this.hieedit);
                    }
                    //targetdev.on("mouseenter", "ul li",_this.showedit);
                    //targetdev.on("mouseleave", "ul li",_this.hieedit);
                    $elm.parent().trigger("mouseleave");
                    $(ui).hide().off('.tcp');
                });
                ui.find(".color-cancel").click(function(e){
                    e.stopPropagation();
                    $elm.parent().find(".eidt-color").data("color",_this.oldcolor);
                    $(ui).hide().off('.tcp');
                    colorInstance.setColor(_this.oldcolor);
                    colorPicker.render();
                    //$elm.parent().find(".eidt-color").css("background",_this.oldcolor);
                    //$elm.parent().find(".icon-wenjianjia").css("color",_this.oldcolor);
                    if(_this.manage){
                        targetdev.on("mouseenter", "ul li",_this.showedit);
                        targetdev.on("mouseleave", "ul li",_this.hieedit);
                    }else{
                        targetdev.off("mouseenter", "ul li",_this.showedit);
                        targetdev.off("mouseleave", "ul li",_this.hieedit);
                    }
                    //targetdev.on("mouseenter", "ul li",_this.showedit);
                    //targetdev.on("mouseleave", "ul li",_this.hieedit);

                    $elm.parent().trigger("mouseleave");
                });



                //$elm.parent().siblings("li").removeClass("active-color");
                //$elm.parent().addClass("active-color");
                //$elm.parent().siblings("li").trigger("mouseleave");
                //targetdev.off("mouseleave", "ul li",_this.hieedit);
                //targetdev.on("mouseleave", "ul li:not('.active-color')",_this.hieedit);
                //console.log($elm.parent());
            },hideCallback:function($elm){
                //targetdev.on("mouseenter", "ul li",_this.showedit);
                //targetdev.on("mouseleave", "ul li",_this.hieedit);
                //$elm.parent().removeClass("active-color");
                //$elm.parent().parent().find("li").trigger("mouseleave");
                //targetdev.on("mouseleave","ul li",_this.hieedit);
            }
        });
    }


};

exports.elmEffect= elmEffect;