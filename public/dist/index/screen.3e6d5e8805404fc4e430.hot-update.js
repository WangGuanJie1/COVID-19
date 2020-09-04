webpackHotUpdate("index/screen",{

/***/ "./public/javascripts/index/screen.js":
/*!********************************************!*\
  !*** ./public/javascripts/index/screen.js ***!
  \********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var _common_dataprocess__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/dataprocess */ \"./public/javascripts/common/dataprocess.js\");\n/* harmony import */ var _common_ajaxcommand__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/ajaxcommand */ \"./public/javascripts/common/ajaxcommand.js\");\n/* harmony import */ var _modules_charts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/charts */ \"./public/javascripts/modules/charts.js\");\n/* harmony import */ var countup_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! countup.js */ \"./node_modules/countup.js/dist/countUp.min.js\");\n\r\n\r\n\r\n\r\n\r\n$(function() {\r\n    let mapState = true;\r\n    let particleClass = ''; // 当前粒子色彩样式名称\r\n    let nowTrendMsg = null;\r\n\r\n    /**\r\n     * 地区疫情动态滚动效果\r\n     * \r\n     * @method myScroll\r\n     * \r\n     * @param {Object} 配置信息\r\n     */\r\n    $.fn.myScroll = function(options) {\r\n        let defaults = {\r\n            speed: 50,\r\n            rowHeight: 21 // 错误的行高会影响效果\r\n        };\r\n        let opts = $.extend({}, defaults, options);\r\n        let intId = [];\r\n        // 动效配置\r\n        function marquee(obj, step) {\r\n            obj.find(\".scrollOption\").animate({\r\n                marginTop: '-=1'\r\n            }, 0, function() {\r\n                let s = Math.abs(parseInt($(this).css(\"margin-top\")));\r\n                if (s >= step) {\r\n                    $(this).find(\"li\").slice(0, 1).appendTo($(this));\r\n                    $(this).css(\"margin-top\", 0);\r\n                }\r\n            });\r\n        }\r\n        // 流程配置\r\n        this.each(function(i) {\r\n            let sh = opts[\"rowHeight\"];\r\n            let speed = opts[\"speed\"];\r\n            let _this = $(this);\r\n            intId[i] = setInterval(function() {\r\n                if (_this.find(\".scrollOption\").height() <= _this.height()) {\r\n                    clearInterval(intId[i]);\r\n                } else {\r\n                    marquee(_this, sh);\r\n                }\r\n            }, speed);\r\n            _this.hover(function() {\r\n                clearInterval(intId[i]);\r\n            }, function() {\r\n                intId[i] = setInterval(function() {\r\n                    if (_this.find(\".scrollOption\").height() <= _this.height()) {\r\n                        clearInterval(intId[i]);\r\n                    } else {\r\n                        marquee(_this, sh);\r\n                    }\r\n                }, speed);\r\n            });\r\n        });\r\n    }\r\n\r\n    /**\r\n     * 添加实时时间\r\n     * \r\n     * @method realTime\r\n     */\r\n    let realTime = function() {\r\n        let date = new Date();\r\n        let year = date.getFullYear();\r\n        let mon = date.getMonth() + 1;\r\n        let da = date.getDate();\r\n        let h = date.getHours();\r\n        let m = date.getMinutes();\r\n        let s = date.getSeconds();\r\n        let d = document.getElementById('Date');\r\n        let time1 = year + '&ensp;年&ensp;' + (mon < 10 ? '0' : '') + mon + '&ensp;月&ensp;' + (da < 10 ? '0' : '') + da + '&ensp;日&ensp;';\r\n        let time2 = (h < 10 ? '0' : '') + h + ' : ' + (m < 10 ? '0' : '') + m + ' : ' + (s < 10 ? '0' : '') + s;\r\n        $(\".time1\").empty().append(time1);\r\n        $(\".time2\").empty().append(time2);\r\n    }\r\n    realTime();\r\n    setInterval(realTime, 1000);\r\n\r\n    /**\r\n     * 移除加载动画\r\n     * \r\n     * @method removeLoading\r\n     */\r\n    function removeLoading() {\r\n        $('#loadAn').fadeOut(() => {\r\n            $('#loadAn').remove();\r\n        });\r\n    }\r\n\r\n    /**\r\n     * 添加国家疫情状态数据到滚屏中\r\n     * \r\n     * @method addCouStaMsg\r\n     * \r\n     * @param {Array} data \r\n     */\r\n    function addCouStaMsg(data) {\r\n        $(\".scrollOption\").empty();\r\n        for (const item in data) {\r\n            $(\".scrollOption\").append(`\r\n            <li>` +\r\n                \"<div class='countryItem' date-id='\" + data[item]['id'] + \"'><a href='javascript:void(0);' onclick='countryItemClickAction()'>\" + data[item]['provinceName'] + \"</a></div>\" +\r\n                `<div><span>` + data[item]['currentConfirmedCount'] + `</span></div>\r\n                <div><span>` + data[item]['curedCount'] + `</span></div>\r\n                <div><span>` + data[item]['deadCount'] + `</span></div>\r\n            </li>`\r\n            );\r\n        }\r\n        removeLoading();\r\n    }\r\n\r\n    /**\r\n     * 单击国家时候的触法事件\r\n     * \r\n     * @method countryItemClickAction\r\n     */\r\n    window.countryItemClickAction = function() {\r\n        $('.countryItem').click((e) => {\r\n            let fieldID = $(e.currentTarget).attr('date-id'); // 获取当前触法对象的id值\r\n            $('.countryItem').unbind('click');\r\n\r\n            // 数据过滤\r\n            let filterData = [];\r\n            for (const item in nowTrendMsg) {\r\n                if (nowTrendMsg[item]['id'] === parseInt(fieldID)) {\r\n                    filterData.push(nowTrendMsg[item]);\r\n                    break;\r\n                }\r\n            }\r\n\r\n\r\n\r\n        });\r\n    }\r\n\r\n    /**\r\n     * 添加最新疫情资讯\r\n     * \r\n     * @method addNews\r\n     * \r\n     * @param {Array} data \r\n     */\r\n    function addNews(data) {\r\n        let temporaryData = JSON.parse(JSON.stringify(data));\r\n        $('.nowNews').empty();\r\n        for (const item in temporaryData) {\r\n            let newsTemplate = `\r\n                <a href=\"` + temporaryData[item]['sourceUrl'] + `\" target=\"_blank\">\r\n                    <div class=\"newsSty\">\r\n                        <div id=\"abcdef\" class=\"newsTitle\">` + temporaryData[item]['pubDate'] + `&emsp;&emsp;` + temporaryData[item]['infoSource'] + `</div>\r\n                        <div class=\"newsContent\">` + temporaryData[item]['summary'] + `</div>\r\n                    </div>\r\n                <a>\r\n            `;\r\n            $('.nowNews').append(newsTemplate);\r\n        }\r\n    }\r\n\r\n    /**\r\n     * 设置疫情统计信息显示数据\r\n     * \r\n     * @method setStatisticsNumber\r\n     * \r\n     * @param {Array} sourceData 数据，需提前排除无用数据，默认首条记录\r\n     */\r\n    function setStatisticsNumber(sourceData) {\r\n        $('.staItemNum').empty();\r\n        let n1 = new countup_js__WEBPACK_IMPORTED_MODULE_3__[\"CountUp\"]('confirmedCountNumber', sourceData[0]['confirmedCount'], { duration: 2 });\r\n        n1.start();\r\n        let n2 = new countup_js__WEBPACK_IMPORTED_MODULE_3__[\"CountUp\"]('currentConfirmedCountNumber', sourceData[0]['currentConfirmedCount'], { duration: 2.5 });\r\n        n2.start();\r\n        let n3 = new countup_js__WEBPACK_IMPORTED_MODULE_3__[\"CountUp\"]('curedCountNumber', sourceData[0]['curedCount'], { duration: 3 });\r\n        n3.start();\r\n        let n4 = new countup_js__WEBPACK_IMPORTED_MODULE_3__[\"CountUp\"]('deadCountNumber', sourceData[0]['deadCount'], { duration: 3.5 });\r\n        n4.start();\r\n        let n5 = new countup_js__WEBPACK_IMPORTED_MODULE_3__[\"CountUp\"]('confirmedIncrCountNumber', sourceData[0]['confirmedIncr'], { duration: 4 });\r\n        n5.start();\r\n    }\r\n\r\n    /**\r\n     * 板块触发效果\r\n     * \r\n     * @method sectionHoverAction\r\n     */\r\n    function sectionHoverAction() {\r\n        $('.hoverAction').hover(function() {\r\n            $(this).addClass('prominent hoveractive');\r\n            $(\".hoverAction:not(.hoveractive)\").addClass('vague');\r\n        }, function() {\r\n            $(this).removeClass('prominent hoveractive');\r\n            $(\".hoverAction:not(.hoveractive)\").removeClass('vague');\r\n        });\r\n    }\r\n\r\n    /**\r\n     * 统计版块内部滑入滑出触法效果\r\n     * \r\n     * @method staboxHoverAction\r\n     */\r\n    function staboxHoverAction() {\r\n        $('.staItem').hover(function() {\r\n            $(\".staItem\").addClass('staItemHover');\r\n            $(this).removeClass('staItemHover');\r\n        }, function() {\r\n            $('.staItem').removeClass('staItemHover');\r\n        });\r\n    }\r\n\r\n\r\n    let staBoxItem = 'currentConfirmedCount';\r\n    /**\r\n     * 统计板块内部点击触法效果\r\n     * \r\n     * @method staboxClickAction\r\n     */\r\n    function staboxClickAction() {\r\n        $('.staItem').click(function(e) {\r\n            let fieldName = $(this).data('item');\r\n            mapRefreshAction(fieldName);\r\n        });\r\n    }\r\n\r\n    /**\r\n     * 地图刷新事件\r\n     * \r\n     * @method mapRefreshAction\r\n     * \r\n     * @param {String} fieldName 更新类别名称\r\n     */\r\n    function mapRefreshAction(fieldName) {\r\n        let option = {\r\n            tooltipTitle: 'provinceName',\r\n            showField: fieldName,\r\n        };\r\n\r\n        switch (fieldName) {\r\n            case 'confirmedCount':\r\n                {\r\n                    staBoxItem = 'confirmedCount';\r\n                    option.bubbleFillColor = '#FFC904';\r\n                    cgParticleColor('particleColor-A');\r\n                    break;\r\n                }\r\n            case 'currentConfirmedCount':\r\n                {\r\n                    staBoxItem = 'currentConfirmedCount';\r\n                    option.bubbleFillColor = '#F92F2C';\r\n                    cgParticleColor('particleColor-B');\r\n                    break;\r\n                }\r\n            case 'curedCount':\r\n                {\r\n                    staBoxItem = 'curedCount';\r\n                    option.bubbleFillColor = '#57CEA1';\r\n                    cgParticleColor('particleColor-C');\r\n                    break;\r\n                }\r\n            case 'deadCount':\r\n                {\r\n                    staBoxItem = 'deadCount';\r\n                    option.bubbleFillColor = '#9FBDF5';\r\n                    cgParticleColor('particleColor-D');\r\n                    break;\r\n                }\r\n            default:\r\n                {\r\n                    staBoxItem = 'currentConfirmedCount';\r\n                    option.bubbleFillColor = '#F92F2C';\r\n                    cgParticleColor('particleColor-A');\r\n                }\r\n        }\r\n\r\n        if (fieldName) {\r\n            updateMap(nowTrendMsg, option);\r\n        }\r\n    }\r\n\r\n\r\n    let mapIsMax = 0;\r\n\r\n    /**\r\n     * 放大地图滑条点击触发效果\r\n     * \r\n     * @method maxMapAciton\r\n     */\r\n    function maxMapAciton() {\r\n        $('#maxMapAciton').on('click', function() {\r\n            if (mapIsMax === 0) {\r\n                mapIsMax = 1;\r\n                $('#maxMapBtn').removeClass('maxMapBtnToLeft').addClass('maxMapBtnToRight');\r\n                $('#mbox1').removeClass('mbox1ToRight').addClass('mbox1ToLeft');\r\n                $('#mbox2').removeClass('mbox2Min').addClass('mbox2Max');\r\n                $('#mbox3').removeClass('mbox3ToLeft').addClass('mbox3ToRight');\r\n            } else {\r\n                mapIsMax = 0;\r\n                $('#maxMapBtn').removeClass('maxMapBtnToRight').addClass('maxMapBtnToLeft');\r\n                $('#mbox1').removeClass('mbox1ToLeft').addClass('mbox1ToRight');\r\n                $('#mbox2').removeClass('mbox2Max').addClass('mbox2Min');\r\n                $('#mbox3').removeClass('mbox3ToRight').addClass('mbox3ToLeft');\r\n            }\r\n        })\r\n    }\r\n\r\n    /**\r\n     * 生成粒子效果\r\n     * \r\n     * @method addParticle\r\n     */\r\n    function addParticle() {\r\n        for (let index = 1; index < 100; index++) {\r\n            $('.particleBox').append(`\r\n        <div class=\"circle-container\">\r\n        <div class=\"circle\"></div>\r\n        </div>`);\r\n        }\r\n\r\n        cgParticleColor('particleColor-B');\r\n    }\r\n\r\n    /**\r\n     * 改变粒子色彩\r\n     * \r\n     * @method cgParticleColor\r\n     * \r\n     * @param {String} className \r\n     */\r\n    function cgParticleColor(className) {\r\n        $('.circle').removeClass(particleClass);\r\n        particleClass = className;\r\n        $('.circle').addClass(particleClass);\r\n    }\r\n\r\n    /**\r\n     * 地图重载\r\n     * \r\n     * @method updateMap\r\n     * \r\n     * @param {Array} data 疫情数据\r\n     * @param {Object} option 图表配置信息\r\n     */\r\n    function updateMap(data, option) {\r\n        if (mapState) {\r\n            mapState = false;\r\n            $('#map').fadeOut(() => {\r\n                $('#map').empty();\r\n                $('#map').show();\r\n                Object(_modules_charts__WEBPACK_IMPORTED_MODULE_2__[\"bubbleMap\"])(_common_ajaxcommand__WEBPACK_IMPORTED_MODULE_1__[\"mapmakerMsg\"], data, 'map', option);\r\n                mapState = true;\r\n            });\r\n        }\r\n    }\r\n\r\n    /**\r\n     * 初始化近30天国家及地区疫情动态配置\r\n     * \r\n     * @method trend30Initialize\r\n     */\r\n    async function trend30Initialize() {\r\n        let msg = null;\r\n        // 获取近30日国家疫情动态\r\n        await _common_ajaxcommand__WEBPACK_IMPORTED_MODULE_1__[\"getNcov30day\"]();\r\n\r\n    }\r\n\r\n    /**\r\n     * 初始化近30天每天各洲疫情统计数据\r\n     * \r\n     * @method continents30Initialize\r\n     */\r\n    async function continents30Initialize() {\r\n        let msg = null;\r\n        // 获取近30日每天各洲疫情统计数据\r\n        await _common_ajaxcommand__WEBPACK_IMPORTED_MODULE_1__[\"getConsta30day\"]();\r\n\r\n        msg = _common_dataprocess__WEBPACK_IMPORTED_MODULE_0__[\"weekCondition\"](_common_ajaxcommand__WEBPACK_IMPORTED_MODULE_1__[\"consta30dayMsg\"]);\r\n        Object(_modules_charts__WEBPACK_IMPORTED_MODULE_2__[\"cBarCurrentConfirmed\"])(msg, 'stackedBarChart');\r\n\r\n    }\r\n\r\n    /**\r\n     * 初始化地图配置\r\n     * \r\n     * @method mapInitialize\r\n     */\r\n    async function mapInitialize() {\r\n        let msg = null;\r\n        // 获取世界地图绘制数据\r\n        await _common_ajaxcommand__WEBPACK_IMPORTED_MODULE_1__[\"getWorldJson\"]();\r\n\r\n        // 初始化国家及地区疫情数据\r\n        await trend30Initialize();\r\n        // 获取最新国家及地区疫情数据时间戳\r\n        let reqTime = await _common_ajaxcommand__WEBPACK_IMPORTED_MODULE_1__[\"getMaxtimeoftrend\"]();\r\n\r\n        nowTrendMsg = _common_dataprocess__WEBPACK_IMPORTED_MODULE_0__[\"timestampFiltrate\"](_common_ajaxcommand__WEBPACK_IMPORTED_MODULE_1__[\"ncov30dayMsg\"], reqTime[0]['reqTime'], 'same'); // 过滤数据只保留最新数据\r\n        updateMap(nowTrendMsg, {\r\n            tooltipTitle: 'provinceName',\r\n            showField: 'currentConfirmedCount',\r\n            bubbleFillColor: '#F92F2C'\r\n        });\r\n\r\n        nowTrendMsg = _common_dataprocess__WEBPACK_IMPORTED_MODULE_0__[\"descData\"](nowTrendMsg, 'currentConfirmedCount');\r\n        addCouStaMsg(nowTrendMsg);\r\n        $('.scrollBox').myScroll();\r\n    }\r\n\r\n    /**\r\n     * 初始化世界疫情统计配置\r\n     * \r\n     * @method statisticsInitialize\r\n     */\r\n    async function statisticsInitialize() {\r\n        let msg = null;\r\n        // 获取近30日全球疫情统计数据\r\n        await _common_ajaxcommand__WEBPACK_IMPORTED_MODULE_1__[\"getSta30day\"]();\r\n\r\n        msg = _common_dataprocess__WEBPACK_IMPORTED_MODULE_0__[\"weekCondition\"](_common_ajaxcommand__WEBPACK_IMPORTED_MODULE_1__[\"sta30dayMsg\"]);\r\n        Object(_modules_charts__WEBPACK_IMPORTED_MODULE_2__[\"cTendencyTrendFewDays\"])(msg, \"tendencyChart\");\r\n\r\n        msg = _common_dataprocess__WEBPACK_IMPORTED_MODULE_0__[\"descData\"](_common_ajaxcommand__WEBPACK_IMPORTED_MODULE_1__[\"sta30dayMsg\"], 'reqTime');\r\n        msg[0]['confirmedIncr'] = msg[0]['confirmedCount'] - msg[1]['confirmedCount'];\r\n        msg = msg[0];\r\n        setStatisticsNumber([msg]);\r\n\r\n        msg = _common_dataprocess__WEBPACK_IMPORTED_MODULE_0__[\"percentGeneration\"]([msg]);\r\n        Object(_modules_charts__WEBPACK_IMPORTED_MODULE_2__[\"cDoughnutStatistics\"])(msg, 'doughnutChart');\r\n\r\n    }\r\n\r\n    /**\r\n     * 初始化最新疫情资讯\r\n     * \r\n     * @method newsInitialize\r\n     */\r\n    async function newsInitialize() {\r\n        let msg = null;\r\n        msg = await _common_ajaxcommand__WEBPACK_IMPORTED_MODULE_1__[\"getNewsnewest\"]();\r\n        addNews(msg);\r\n\r\n    }\r\n\r\n    // 效果\r\n    sectionHoverAction();\r\n    staboxHoverAction();\r\n    staboxClickAction();\r\n    maxMapAciton();\r\n    addParticle();\r\n\r\n    // 数据初始化操作\r\n    mapInitialize();\r\n    statisticsInitialize();\r\n    newsInitialize();\r\n    _common_ajaxcommand__WEBPACK_IMPORTED_MODULE_1__[\"getEnname\"]();\r\n    continents30Initialize();\r\n\r\n\r\n\r\n});\r\n\r\n\r\n\r\n\r\nwindow.onload = function() {\r\n    /*\r\n     * 背景音乐\r\n     */\r\n    let music = document.getElementById(\"bgMusic\");\r\n    music.volume = 0.1; // 音量控制\r\n    $(\"#musicEvent\").on(\"click\", function() {\r\n        if (music.paused) {\r\n            music.play();\r\n        } else {\r\n            music.pause();\r\n        }\r\n        return false;\r\n    });\r\n\r\n\r\n\r\n};\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\")))\n\n//# sourceURL=webpack:///./public/javascripts/index/screen.js?");

/***/ })

})