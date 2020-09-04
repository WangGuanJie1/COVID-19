const $ = require('jquery');


$(function() {
    var $loadAnStr = `
    <div id="loadAn" class="loading" hidden>
        <div>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>`; // 加载动画模板

    /**
     * 添加加载动画
     */
    $.loadEventAdd = function() {
        $("#eventBox").append($loadAnStr);
    };

    /**
     * 删除加载动画
     */
    $.loadEventRemove = function() {
        $("#eventBox > #loadAn").remove();
    };

    /**
     * 显示加载动画
     */
    $.loadShowAn = function() {
        $("#loadAn").fadeIn();
    };

    /**
     * 隐藏加载动画
     */
    $.loadHiddenAn = function() {
        $("#loadAn").fadeOut();
    };

});