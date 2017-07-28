require("../../less/layer.css");
require("../../less/perfect-scrollbar.css");
require("../act");
var laypage=require('../vendor/laypage');



require("../../less/resource.less");

laypage({
    cont: document.getElementById('page'), //容器。值支持id名、原生dom对象，jquery对象,
    pages: 100, //总页数

    groups: 7 //连续显示分页数
});