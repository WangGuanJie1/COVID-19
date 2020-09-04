import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';
import * as dataprocess from '../common/dataprocess';
/**
 * 生成各洲现有确诊周比叠加柱状图
 * 
 * @method cBarCurrentConfirmed
 * 
 * @param {Array} data 疫情数据，需提前排除无用数据
 * @param {String} containerName 容器名称
 */
export function cBarCurrentConfirmed(data, containerName) {
    let temporaryData = JSON.parse(JSON.stringify(data));

    // 数据处理
    let disData = dataprocess.ascData(temporaryData, 'reqTime');
    dataprocess.ascData(disData, 'continents');
    const chart = new Chart({
        container: containerName,
        autoFit: true,
    });
    chart.data(data);
    chart.scale('confirmedCount', {

    });
    chart.axis('date', {
        tickLine: null,
    });
    chart.axis('confirmedCount', {
        label: {
            formatter: text => {
                return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            }
        },

    });
    chart.legend({
        position: 'bottom',
    });
    chart.tooltip({
        shared: true,
        showMarkers: false,
    });
    chart.interaction('active-region');
    chart
        .interval()
        .adjust('stack')
        .position('date*confirmedCount')
        .color('continents', ['#00f7ff', '#00e3ff', '#00cdff', '#00b7ff', '#00a0fd', '#0087f1', '#106cde']);

    chart.render();

};

/**
 * 生成疫情动态环形图
 * 
 * @method cDoughnutStatistics
 * 
 * @param {Array} data 疫情数据，需提前排除无用数据,并比率计算
 * @param {String} containerName 容器名称
 */
export function cDoughnutStatistics(data, containerName) {
    let temporaryData = JSON.parse(JSON.stringify(data));
    const chart = new Chart({
        container: containerName,
        autoFit: true,
    });
    chart.data(temporaryData);
    chart.scale('percent', {
        formatter: (val) => {
            val = val * 100 + '%';
            return val;
        },
    });
    chart.coordinate('theta', {
        radius: 0.75,
        innerRadius: 0.6,
    });
    chart.tooltip({
        showTitle: false,
        showMarkers: false,
    });
    chart
        .interval()
        .adjust('stack')
        .position('percent')
        .color('item')
        .label('percent',
            (percent) => {
                return {
                    content: (temporaryData) => {
                        return `${temporaryData.item} : ${parseInt(percent * 100)}%`;
                    },
                };
            }, {
                offset: 15,
                style: {
                    fontSize: 12,
                    fill: '#bfbfbf',
                },
            }
        )
        .tooltip('item*percent', (item, percent) => {
            percent = parseInt(percent * 100) + '%';
            return {
                name: item,
                value: percent,
            };
        });
    chart.interaction('element-active');
    chart.interaction('element-single-selected');
    chart.render();
}

/**
 * 生成疫情动态曲线折线图
 * 
 * @method cTendencyTrendFewDays
 * 
 * @param {Array} data 显示的数据，需提前排除无用数据
 * @param {String} containerName 容器名称
 */
export function cTendencyTrendFewDays(data, containerName) {
    let temporaryData = JSON.parse(JSON.stringify(data));
    // 数据处理
    let disData = dataprocess.ascData(temporaryData, 'reqTime');
    let claKeyName = "situation";
    let claValKeyName = "quantity";
    let claConf = {
        typeInfo: [{
            keyName: claKeyName,
            keyValue: '现存确诊',
            valKeyName: claValKeyName,
            correspondingKey: 'currentConfirmedCount',
        }, {
            keyName: claKeyName,
            keyValue: '累计治愈',
            valKeyName: claValKeyName,
            correspondingKey: 'curedCount',
        }, {
            keyName: claKeyName,
            keyValue: '累计死亡',
            valKeyName: claValKeyName,
            correspondingKey: 'deadCount',
        }, ],
        saveKey: ['date']
    };
    disData = dataprocess.dataClassification(disData, claConf);
    // 配置信息
    const chart = new Chart({
        container: containerName,
        autoFit: true,
    });
    chart.data(disData);
    chart.scale(claValKeyName, {
        // type: 'pow',
        nice: true
    });
    chart.tooltip({
        showCrosshairs: true,
        shared: true,
    });
    chart.legend({
        position: "bottom",
    });
    chart.axis(claValKeyName, {
        label: {
            formatter: text => {
                return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            }
        },
    });
    chart
        .line()
        .position('date*' + claValKeyName)
        .color(claKeyName);
    chart
        .point()
        .position('date*' + claValKeyName)
        .color(claKeyName)
        .shape('circle');
    chart.render();
}

/**
 * 生成世界地图
 * 
 * @method createWorldMap
 * 
 * @param {Object} worldData 地图绘制数据
 * @param {String} containerName 容器名称
 * @param {Object} option 图表配置信息
 * 
 * @return {Object} 国家经纬度视图数据（G2 WorldGeo）
 */
export function createWorldMap(worldData, containerName, option) {
    const ds = new DataSet();

    // 基本配置信息
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
        title: option['tooltipTitle']
    });

    // 地图配置
    const worldGeo = ds.createView().source(worldData, {
        type: 'GeoJSON',
    });
    const mapView = chart.createView();
    mapView.changeData(worldGeo.rows);
    mapView
        .polygon()
        .position('longitude*latitude')
        .style({
            fill: 'l(90) 0:rgba(75,36,118,1) 1:rgba(75,36,118,1)',
            lineWidth: 1,
            stroke: 'rgba(233,216,246,.8)',
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
    chart.render();
}

/**
 * 疫情动态气泡地图
 * 
 * @method bubbleMap
 * 
 * @param {Object} worldData 地图绘制数据
 * @param {Array} opData 疫情数据，需提前排除无用数据
 * @param {String} containerName 容器名称
 * @param {Object} option 图表配置信息
 */
export function bubbleMap(worldData, opData, containerName, option) {
    let temporaryData = JSON.parse(JSON.stringify(opData));
    let worldMapData = JSON.parse(JSON.stringify(worldData));

    const ds = new DataSet();

    // 基本配置信息
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
        title: option['tooltipTitle']
    });

    // 地图配置
    const worldGeo = ds.createView().source(worldMapData, {
        type: 'GeoJSON',
    });
    const mapView = chart.createView();
    mapView.changeData(worldGeo.rows);
    mapView
        .polygon()
        .position('longitude*latitude')
        .style({
            fill: 'l(90) 0:rgba(75,36,118,1) 1:rgba(75,36,118,1)',
            lineWidth: 1,
            stroke: 'rgba(233,216,246,.8)',
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
    // 数据处理
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
        });

    // 显示数据配置
    const showData = ds
        .createView()
        .source(disData)
        .transform({
            type: 'geo.centroid',
            geoDataView: worldGeo,
            field: 'enName',
            as: ['longitude', 'latitude'],
        });
    const pointView = chart.createView();
    pointView.data(showData.rows);
    pointView
        .point()
        .position('longitude*latitude')
        .color(option['bubbleFillColor'])
        .shape("circle")
        .size(option['showField'], [5, option['fieldMax']])
        .tooltip("confirmedCount*currentConfirmedCount*curedCount*deadCount")
        .style({
            fillOpacity: .3,
            stroke: option['bubbleFillColor']
        });
    pointView.scale({
        cnName: {
            alias: '国家'
        },
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
    pointView.interaction('element-active');
    chart.render();
}