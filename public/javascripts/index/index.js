import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';
import 'pagepiling.js';
import * as ajaxcommand from '../common/ajaxcommand';
import * as dataprocess from '../common/dataprocess';

$(function() {
    /**
     * pagepiling配置信息
     */
    // $('#container').pagepiling({
    //     sectionsColor: ['rgba(241,242,235,1)', 'rgba(241,242,235,1)', 'rgba(241,242,235,1)', 'rgba(241,242,235,1)', 'rgba(241,242,235,1)', 'rgba(241,242,235,1)'],
    //     navigation: {
    //         'position': 'right',
    //         'tooltips': ['疫情趋势动画', 'Page 2', 'Page 3', 'Pgae 4', 'Pgae 5', 'Pgae 6']
    //     }
    // });

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
     * 生成疫情动态气泡地图
     * 
     * @method cTendencyTrendFewDays
     * 
     * @param {Object} worldData 地图绘制数据
     * @param {Array} opData 疫情数据，需提前排除无用数据
     * @param {Array} fiducialVal 需要引用的数据字段名称
     * @param {String} containerName 容器名称
     */
    function worldMap(worldData, opData, fiducialVal, containerName) {
        let temporaryData = JSON.parse(JSON.stringify(opData));
        const ds = new DataSet();

        // 图表配置
        const chart = new Chart({
            container: containerName,
            autoFit: true,
        });
        chart.scale({
            longitude: {
                sync: true,
            },
            latitude: {
                sync: true,
            },
        });
        chart.axis(false);
        chart.legend(false);
        chart.tooltip({
            showTitle: true,
            showMarkers: false,
            title: 'provinceName'
        });

        // 地图配置
        const worldGeo = ds.createView().source(worldData, {
            type: 'GeoJSON',
        });
        const mapView = chart.createView();
        mapView.data(worldGeo.rows);
        mapView
            .polygon()
            .position('longitude*latitude')
            .style({
                fill: 'rgba(255,255,255)',
                lineWidth: 1,
                stroke: 'rgba(0,0,0,.3)',
                shadowColor: 'rgba(0,0,0,.06)',
                shadowOffsetX: 5,
                shadowOffsetY: 20,
            })
            .tooltip(false)
            .animate({
                appear: {
                    animation: 'grow-in-xy',
                    duration: 300
                }
            });

        // 疫情数据处理
        const disData = ds.createView().source(temporaryData);
        disData
            .transform({
                type: 'pick',
                fields: ['date', 'provinceName', 'enName', 'confirmedCount', 'currentConfirmedCount', 'curedCount', 'deadCount']
            })
            .transform({
                type: 'geo.centroid',
                geoDataView: worldGeo,
                field: 'enName',
                as: ['longitude', 'latitude'],
            })
            .transform({
                type: 'partition',
                groupBy: ['date']
            });
        const dates = Object.keys(disData.rows);
        let count = 0;

        // 疫情数据配置
        const pointView = chart.createView();
        pointView
            .point()
            .position('longitude*latitude')
            .color('#F92F2C')
            .shape("circle")
            .size('currentConfirmedCount', [5, 70])
            .tooltip("confirmedCount*currentConfirmedCount*curedCount*deadCount")
            .style({
                fillOpacity: .3,
                stroke: '#FF5A00'
            }).animate({
                appear: {
                    animation: 'zoom-in',
                    delay: 600,
                    duration: 300
                }
            });

        pointView.scale({
            confirmedCount: {
                alias: '累计确诊'
            },
            currentConfirmedCount: {
                alias: '现存确诊'
            },
            curedCount: {
                alias: '累计治愈'
            },
            deadCount: {
                alias: '累计死亡'
            }
        });
        pointView.annotation().text({
            position: ['12%', '80%'],
            content: '现有确诊',
            style: {
                fontSize: 50,
                fill: '#C32B29',
                textAlign: 'center',
                fillOpacity: 0.4
            },
        });
        let dateUp = function() {
                const date = dates[count];
                pointView.annotation().clear(true);
                pointView.annotation().text({
                    position: ['12%', '80%'],
                    content: disData.rows[date][0]['date'],
                    style: {
                        fontSize: 70,
                        fill: '#999',
                        textAlign: 'center',
                        fillOpacity: 0.3
                    },
                });
                pointView.changeData(disData.rows[date]);
            }
            // dateUp();
        let interval = setInterval(() => {
            if (mapAnStatus === 1) {
                if (count === dates.length) {
                    clearInterval(interval);

                    mapAnStatus = 0;
                    $('.reMapAn').show();
                    $('.pauseMapAn').hide();
                    $('.playMapAn').hide();
                } else {
                    dateUp();
                    count++;
                    // console.log(count);
                }
            }

        }, 2);
        pointView.interaction('element-active');
        chart.render();
    }

    async function ceshi() {
        let msg = null;
        // 获取世界地图绘制数据
        ajaxcommand.getWorldJson();

        await ajaxcommand.getNcov150day();
        let reqTime = await ajaxcommand.getMaxtimeoftrend();

        // msg = dataprocess.timestampFiltrate(ajaxcommand.ncov30dayMsg, reqTime[0]['reqTime'], 'same');
        // let fiducialVal = ['confirmedCount', 'currentConfirmedCount', 'curedCount', 'deadCount'];
        removeLoading('loadAnIndexMap');
        $('.playMapAn').show();
        worldMap(ajaxcommand.mapmakerMsg, dataprocess.ascData(ajaxcommand.ncov150dayMsg, 'reqTime'), null, 'map');
    }

    /**
     * 暂停背景视频
     * 
     * @method pauseVideo
     */
    function pauseVideo() {
        $('.pauseVideo').on('click', function() {
            document.getElementById("video").pause();
            $('.playVideo').show();
            $('.pauseVideo').hide();
        });
    }

    /**
     * 播放背景视频
     * 
     * @method playVideo
     */
    function playVideo() {
        $('.playVideo').on('click', function() {
            document.getElementById("video").play();
            $('.pauseVideo').show();
            $('.playVideo').hide();
        });
    }

    /**
     * 暂停背景音乐
     * 
     * @method pauseVideo
     */
    function pauseMusic() {
        $('.pauseMusic').on('click', function() {
            document.getElementById("bgMusic").pause();
            $('.playMusic').show();
            $('.pauseMusic').hide();
        });
    }

    /**
     * 播放背景音乐
     * 
     * @method playVideo
     */
    function playMusic() {
        $('.playMusic').on('click', function() {
            document.getElementById("bgMusic").play();
            $('.pauseMusic').show();
            $('.playMusic').hide();
        });
    }

    let mapAnStatus = 0; // 0没在播放

    /**
     * 播放地图动画
     * 
     * @method playVideo
     */
    function playMapAn() {
        $('.playMapAn').on('click', function() {
            mapAnStatus = 1;
            $('.reMapAn').hide();
            $('.pauseMapAn').show();
            $('.playMapAn').hide();
        });
    }

    /**
     * 暂停地图动画
     * 
     * @method pauseMapAn
     */
    function pauseMapAn() {
        $('.pauseMapAn').on('click', function() {
            mapAnStatus = 0;
            $('.playMapAn').show();
            $('.pauseMapAn').hide();
        });
    }

    /**
     * 重新播放地图动画
     * 
     * @method reMapAn
     */
    function reMapAn() {
        $('.reMapAn').on('click', function() {
            mapAnStatus = 1;
            $('#map').empty();
            $('.pauseMapAn').show();
            $('.reMapAn').hide();
            worldMap(ajaxcommand.mapmakerMsg, dataprocess.ascData(ajaxcommand.ncov150dayMsg, 'reqTime'), null, 'map');
        });
    }

    playMapAn();
    pauseMapAn();
    reMapAn();
    playVideo();
    playMusic();
    pauseVideo();
    pauseMusic();

    ceshi();

});