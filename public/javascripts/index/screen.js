import * as dataprocess from '../common/dataprocess';
import * as ajaxcommand from '../common/ajaxcommand';
import { cBarCurrentConfirmed, cDoughnutStatistics, cTendencyTrendFewDays, bubbleMap } from '../modules/charts';
import { CountUp } from 'countup.js';

$(function() {
    let mapState = true;
    let particleClass = ''; // 当前粒子色彩样式名称
    let nowTrendMsg = null;

    /**
     * 地区疫情动态滚动效果
     * 
     * @method myScroll
     * 
     * @param {Object} 配置信息
     */
    $.fn.myScroll = function(options) {
        let defaults = {
            speed: 50,
            rowHeight: 23.5 // 错误的行高会影响效果
        };
        let opts = $.extend({}, defaults, options);
        let intId = [];
        // 动效配置
        function marquee(obj, step) {
            obj.find(".scrollOption").animate({
                marginTop: '-=1'
            }, 0, function() {
                let s = Math.abs(parseInt($(this).css("margin-top")));
                if (s >= step) {
                    $(this).find("li").slice(0, 1).appendTo($(this));
                    $(this).css("margin-top", 0);
                }
            });
        }
        // 流程配置
        this.each(function(i) {
            let sh = opts["rowHeight"];
            let speed = opts["speed"];
            let _this = $(this);
            intId[i] = setInterval(function() {
                if (_this.find(".scrollOption").height() <= _this.height()) {
                    clearInterval(intId[i]);
                } else {
                    marquee(_this, sh);
                }
            }, speed);
            _this.hover(function() {
                clearInterval(intId[i]);
            }, function() {
                intId[i] = setInterval(function() {
                    if (_this.find(".scrollOption").height() <= _this.height()) {
                        clearInterval(intId[i]);
                    } else {
                        marquee(_this, sh);
                    }
                }, speed);
            });
        });
    }

    /**
     * 添加实时时间
     * 
     * @method realTime
     */
    let realTime = function() {
        let date = new Date();
        let year = date.getFullYear();
        let mon = date.getMonth() + 1;
        let da = date.getDate();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        let d = document.getElementById('Date');
        let time1 = year + '&ensp;年&ensp;' + (mon < 10 ? '0' : '') + mon + '&ensp;月&ensp;' + (da < 10 ? '0' : '') + da + '&ensp;日&ensp;';
        let time2 = (h < 10 ? '0' : '') + h + ' : ' + (m < 10 ? '0' : '') + m + ' : ' + (s < 10 ? '0' : '') + s;
        $(".time1").empty().append(time1);
        $(".time2").empty().append(time2);
    }
    realTime();
    setInterval(realTime, 1000);

    /**
     * 移除加载动画
     * 
     * @method removeLoading
     * 
     * @param {String} objId dom ID
     */
    function removeLoading(objId) {
        $('#' + objId).fadeOut(() => {
            $('#' + objId).remove();
        });
    }

    /**
     * 添加国家疫情状态数据到滚屏中
     * 
     * @method addCouStaMsg
     * 
     * @param {Array} data 
     */
    function addCouStaMsg(data) {
        $(".scrollOption").empty();
        for (const item in data) {
            $(".scrollOption").append(`
            <li>` +
                "<div class='countryItem' date-id='" + data[item]['id'] + "'><a href='javascript:void(0);' onclick='countryItemClickAction()'>" + data[item]['provinceName'] + "</a></div>" +
                `<div><span>` + data[item]['currentConfirmedCount'] + `</span></div>
                <div><span>` + data[item]['curedCount'] + `</span></div>
                <div><span>` + data[item]['deadCount'] + `</span></div>
            </li>`
            );
        }
        removeLoading('loadAnCouSta');
    }

    /**
     * 单击国家时候的触法事件
     * 
     * @method countryItemClickAction
     */
    window.countryItemClickAction = function() {
        $('.countryItem').click((e) => {
            let fieldID = $(e.currentTarget).attr('date-id'); // 获取当前触法对象的id值
            $('.countryItem').unbind('click');

            // 数据过滤
            let filterData = [];
            for (const item in nowTrendMsg) {
                if (nowTrendMsg[item]['id'] === parseInt(fieldID)) {
                    filterData.push(nowTrendMsg[item]);
                    break;
                }
            }



        });
    }

    /**
     * 添加最新疫情资讯
     * 
     * @method addNews
     * 
     * @param {Array} data 
     */
    function addNews(data) {
        let temporaryData = JSON.parse(JSON.stringify(data));
        $('.nowNews').empty();
        for (const item in temporaryData) {
            let newsTemplate = `
                <a href="` + temporaryData[item]['sourceUrl'] + `" target="_blank">
                    <div class="newsSty">
                        <div id="abcdef" class="newsTitle">` + temporaryData[item]['pubDate'] + `&emsp;&emsp;` + temporaryData[item]['infoSource'] + `</div>
                        <div class="newsContent">` + temporaryData[item]['summary'] + `</div>
                    </div>
                <a>
            `;
            $('.nowNews').append(newsTemplate);
        }
    }

    /**
     * 设置疫情统计信息显示数据
     * 
     * @method setStatisticsNumber
     * 
     * @param {Array} sourceData 数据，需提前排除无用数据，默认首条记录
     */
    function setStatisticsNumber(sourceData) {
        $('.staItemNum').empty();
        let n1 = new CountUp('confirmedCountNumber', sourceData[0]['confirmedCount'], { duration: 2 });
        n1.start();
        let n2 = new CountUp('currentConfirmedCountNumber', sourceData[0]['currentConfirmedCount'], { duration: 2.5 });
        n2.start();
        let n3 = new CountUp('curedCountNumber', sourceData[0]['curedCount'], { duration: 3 });
        n3.start();
        let n4 = new CountUp('deadCountNumber', sourceData[0]['deadCount'], { duration: 3.5 });
        n4.start();
        let n5 = new CountUp('confirmedIncrCountNumber', sourceData[0]['confirmedIncr'], { duration: 4 });
        n5.start();
        let n6 = new CountUp('confirmedCountNumberRe', sourceData[0]['confirmedCount'], { duration: 2 });
        n6.start();
        let n7 = new CountUp('currentConfirmedCountNumberRe', sourceData[0]['currentConfirmedCount'], { duration: 2.5 });
        n7.start();
        let n8 = new CountUp('curedCountNumberRe', sourceData[0]['curedCount'], { duration: 3 });
        n8.start();
        let n9 = new CountUp('deadCountNumberRe', sourceData[0]['deadCount'], { duration: 3.5 });
        n9.start();
        let n10 = new CountUp('confirmedIncrCountNumberRe', sourceData[0]['confirmedIncr'], { duration: 4 });
        n10.start();
    }

    /**
     * 板块触发效果
     * 
     * @method sectionHoverAction
     */
    function sectionHoverAction() {
        $('.hoverAction').hover(function() {
            $(this).addClass('prominent hoveractive');
            $(".hoverAction:not(.hoveractive)").addClass('vague');
        }, function() {
            $(this).removeClass('prominent hoveractive');
            $(".hoverAction:not(.hoveractive)").removeClass('vague');
        });
    }

    /**
     * 统计版块内部滑入滑出触法效果
     * 
     * @method staboxHoverAction
     */
    function staboxHoverAction() {
        $('.staItem').hover(function() {
            $(".staItem").addClass('staItemHover');
            $(this).removeClass('staItemHover');
        }, function() {
            $('.staItem').removeClass('staItemHover');
        });
    }


    let staBoxItem = 'currentConfirmedCount';
    /**
     * 统计板块内部点击触法效果
     * 
     * @method staboxClickAction
     */
    function staboxClickAction() {
        $('.staItem').click(function(e) {
            let fieldName = $(this).data('item');
            mapRefreshAction(fieldName);
        });
    }

    /**
     * 地图刷新事件
     * 
     * @method mapRefreshAction
     * 
     * @param {String} fieldName 更新类别名称
     */
    function mapRefreshAction(fieldName) {
        let option = {
            tooltipTitle: 'provinceName',
            showField: fieldName,
        };

        switch (fieldName) {
            case 'confirmedCount':
                {
                    staBoxItem = 'confirmedCount';
                    option.bubbleFillColor = '#FFC904';
                    cgParticleColor('particleColor-A');
                    break;
                }
            case 'currentConfirmedCount':
                {
                    staBoxItem = 'currentConfirmedCount';
                    option.bubbleFillColor = '#F92F2C';
                    cgParticleColor('particleColor-B');
                    break;
                }
            case 'curedCount':
                {
                    staBoxItem = 'curedCount';
                    option.bubbleFillColor = '#57CEA1';
                    cgParticleColor('particleColor-C');
                    break;
                }
            case 'deadCount':
                {
                    staBoxItem = 'deadCount';
                    option.bubbleFillColor = '#9FBDF5';
                    cgParticleColor('particleColor-D');
                    break;
                }
            default:
                {
                    staBoxItem = 'currentConfirmedCount';
                    option.bubbleFillColor = '#F92F2C';
                    cgParticleColor('particleColor-A');
                }
        }

        if (fieldName) {
            updateMap(nowTrendMsg, option);
        }
    }


    let mapIsMax = 0;

    /**
     * 滑条点击放大地图触发效果
     * 
     * @method maxMapAciton
     */
    function maxMapAciton() {
        $('#maxMapAciton').on('mousedown', function() {
            if (mapIsMax === 0) {
                mapIsMax = 1;
                $('#maxMapBtn').removeClass('maxMapBtnToLeft').addClass('maxMapBtnToRight');
                $('#mbox1').removeClass('mbox1ToRight').addClass('mbox1ToLeft');
                $('#mbox3').removeClass('mbox3ToLeft').addClass('mbox3ToRight');
                $('#mbox2').removeClass('mbox2Min').addClass('mbox2Max');
                mapRefreshAction(staBoxItem);
                $('#map').removeClass('mapMin').addClass('mapMax');
                setTimeout(function() {
                    $('#hiddenStaNumberBox').show().removeClass('hiddenHiddenStaNumberBox').addClass('showHiddenStaNumberBox');
                }, 500);
            }
        })
    }

    /**
     * 滑条点击缩小地图触发效果
     * 
     * @method minMapAciton
     */
    function minMapAciton() {
        $('#minMapAciton').on('mousedown', function() {
            if (mapIsMax === 1) {
                mapIsMax = 0;
                $('#maxMapBtn').removeClass('maxMapBtnToRight').addClass('maxMapBtnToLeft');
                $('#mbox1').removeClass('mbox1ToLeft').addClass('mbox1ToRight');
                $('#mbox3').removeClass('mbox3ToRight').addClass('mbox3ToLeft');
                $('#mbox2').removeClass('mbox2Max').addClass('mbox2Min');
                $('#map').removeClass('mapMax').addClass('mapMin');
                $('#hiddenStaNumberBox').hide().removeClass('showHiddenStaNumberBox').addClass('hiddenHiddenStaNumberBox');
                mapRefreshAction(staBoxItem);
            }
        })
    }

    /**
     * 生成粒子效果
     * 
     * @method addParticle
     */
    function addParticle() {
        for (let index = 1; index < 100; index++) {
            $('.particleBox').append(`
        <div class="circle-container">
        <div class="circle"></div>
        </div>`);
        }

        cgParticleColor('particleColor-B');
    }

    /**
     * 改变粒子色彩
     * 
     * @method cgParticleColor
     * 
     * @param {String} className 
     */
    function cgParticleColor(className) {
        $('.circle').removeClass(particleClass);
        particleClass = className;
        $('.circle').addClass(particleClass);
    }

    /**
     * 地图重载
     * 
     * @method updateMap
     * 
     * @param {Array} data 疫情数据
     * @param {Object} option 图表配置信息
     */
    function updateMap(data, option) {
        if (mapState) {
            mapState = false;
            $('#map').fadeOut(() => {
                $('#map').empty();
                $('#map').show();
                if (mapIsMax) {
                    option['fieldMax'] = 80;
                } else {
                    option['fieldMax'] = 50;
                }
                bubbleMap(ajaxcommand.mapmakerMsg, data, 'map', option);
                mapState = true;
            });
        }
    }

    /**
     * 初始化近30天国家及地区疫情动态配置
     * 
     * @method trend30Initialize
     */
    async function trend30Initialize() {
        let msg = null;
        // 获取近30日国家疫情动态
        await ajaxcommand.getNcov30day();

    }

    /**
     * 初始化近30天每天各洲疫情统计数据
     * 
     * @method continents30Initialize
     */
    async function continents30Initialize() {
        let msg = null;
        // 获取近30日每天各洲疫情统计数据
        await ajaxcommand.getConsta30day();

        msg = dataprocess.weekCondition(ajaxcommand.consta30dayMsg);
        cBarCurrentConfirmed(msg, 'stackedBarChart');
        removeLoading('loadAnStackedBar');
    }

    /**
     * 初始化地图配置
     * 
     * @method mapInitialize
     */
    async function mapInitialize() {
        let msg = null;
        // 获取世界地图绘制数据
        await ajaxcommand.getWorldJson();

        // 初始化国家及地区疫情数据
        await trend30Initialize();
        // 获取最新国家及地区疫情数据时间戳
        let reqTime = await ajaxcommand.getMaxtimeoftrend();

        nowTrendMsg = dataprocess.timestampFiltrate(ajaxcommand.ncov30dayMsg, reqTime[0]['reqTime'], 'same'); // 过滤数据只保留最新数据
        updateMap(nowTrendMsg, {
            tooltipTitle: 'provinceName',
            showField: 'currentConfirmedCount',
            bubbleFillColor: '#F92F2C'
        });
        removeLoading('loadAnScreenMap');

        nowTrendMsg = dataprocess.descData(nowTrendMsg, 'currentConfirmedCount');
        addCouStaMsg(nowTrendMsg);
        $('.scrollBox').myScroll();
    }

    /**
     * 初始化世界疫情统计配置
     * 
     * @method statisticsInitialize
     */
    async function statisticsInitialize() {
        let msg = null;
        // 获取近30日全球疫情统计数据
        await ajaxcommand.getSta30day();

        msg = dataprocess.weekCondition(ajaxcommand.sta30dayMsg);
        cTendencyTrendFewDays(msg, "tendencyChart");
        removeLoading('loadAnTendency');

        msg = dataprocess.descData(ajaxcommand.sta30dayMsg, 'reqTime');
        msg[0]['confirmedIncr'] = msg[0]['confirmedCount'] - msg[1]['confirmedCount'];
        msg = msg[0];
        removeLoading('loadAnStaNumber');
        setStatisticsNumber([msg]);

        msg = dataprocess.percentGeneration([msg]);
        cDoughnutStatistics(msg, 'doughnutChart');
        removeLoading('loadAnDoughnut');
    }

    /**
     * 初始化最新疫情资讯
     * 
     * @method newsInitialize
     */
    async function newsInitialize() {
        let msg = null;
        msg = await ajaxcommand.getNewsnewest();
        addNews(msg);
        removeLoading('loadAnNowNews');
    }

    // 效果
    sectionHoverAction();
    staboxHoverAction();
    staboxClickAction();
    maxMapAciton();
    minMapAciton();
    addParticle();

    // 数据初始化操作
    mapInitialize();
    statisticsInitialize();
    newsInitialize();
    ajaxcommand.getEnname();
    continents30Initialize();



});




window.onload = function() {
    /*
     * 背景音乐
     */
    let music = document.getElementById("bgMusic");
    music.volume = 0.1; // 音量控制
    $("#musicEvent").on("click", function() {
        if (music.paused) {
            music.play();
        } else {
            music.pause();
        }
        return false;
    });



};