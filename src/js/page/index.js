require("../../less/layer.css");
require("../../less/perfect-scrollbar.css");
require("../act");
require("../../less/style.less");
var laypage=require('../vendor/laypage');
laypage({
    cont: document.getElementById('page'), //容器。值支持id名、原生dom对象，jquery对象,
    pages: 10, //总页数
    skin: 'blue',
});
