
// 历史记录滚动条
$('#history-content').perfectScrollbar();

// 历史记录点击事件
$("#history-list li").on("click",function(){
    $(this).siblings().removeClass("active")
        .end().addClass("active")
        .removeClass("next-active")
        .prevAll().removeClass("next-active")
        .end().nextAll().addClass("next-active");
});

//开关，发布设置，禁止选中文字
$(".on-off")[0].onselectstart=function(){
    return false;
}

//上传文本域
$(".plupload textarea").on("focus",function(){
    var val=$(this).val();
    if(val=="项目描述..."){
        $(this).val("");
    }
}).on("blur",function(){
    var val=$(this).val();
    if(val==""){
        $(this).val("项目描述...");
    }
}).on("keyup",function(){
    var val=$(this).val();
    var length=val.length;
    var text=$(this).next("p").find("span").text();
    if(length==text){
        this.onpropertychange=function(){
            val.substr(0,text);
        };
    }
    $(this).next("p").find("i").text(val.length);
});