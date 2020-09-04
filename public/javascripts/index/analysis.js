import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';
import 'pagepiling.js';
import * as ajaxcommand from '../common/ajaxcommand';
import * as dataprocess from '../common/dataprocess';

$(function() {
    /**
     * pagepiling配置信息
     */
    $('#container').pagepiling({
        sectionsColor: ['rgba(241,242,235,1)', 'rgba(241,242,235,1)', 'rgba(241,242,235,1)', 'rgba(241,242,235,1)', 'rgba(241,242,235,1)', 'rgba(241,242,235,1)'],
        navigation: {
            'position': 'right',
            'tooltips': ['疫情趋势动画', 'Page 2', 'Page 3', 'Pgae 4', 'Pgae 5', 'Pgae 6']
        }
    });


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
            if (count === dates.length) {
                clearInterval(interval);
            } else {
                dateUp();
                count++;
                // console.log(count);
            }

        }, 200);

        // dateUp();

        // // 动画配置
        // let anLoopState = 0;

        // let loopAn = function() {
        //     setInterval(() => {
        //         if (count === dates.length) {
        //             setTimeout(() => {
        //                 count = 0;
        //             }, 5000);
        //         }
        //     }, 200);

        // }

        //     //设置圆点的hover效果
        //     userView.state({
        //         active: {
        //             style: {
        //                 lineWidth: 1,
        //                 stroke: '#FF2F29',
        //                 fillOpacity: 0.65,
        //             }
        //         }
        //     });
        pointView.interaction('element-active');
        chart.render();
    }
    async function ceshi() {
        let msg = null;
        // 获取世界地图绘制数据
        await ajaxcommand.getWorldJson();

        await ajaxcommand.getNcov150day();
        let reqTime = await ajaxcommand.getMaxtimeoftrend();

        // msg = dataprocess.timestampFiltrate(ajaxcommand.ncov30dayMsg, reqTime[0]['reqTime'], 'same');
        // let fiducialVal = ['confirmedCount', 'currentConfirmedCount', 'curedCount', 'deadCount'];
        worldMap(ajaxcommand.mapmakerMsg, dataprocess.ascData(ajaxcommand.ncov150dayMsg, 'reqTime'), null, 'map');





    }
    ceshi();

});