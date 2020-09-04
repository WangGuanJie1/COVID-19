webpackHotUpdate("index/index",{

/***/ "./public/javascripts/index/index.js":
/*!*******************************************!*\
  !*** ./public/javascripts/index/index.js ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var _antv_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @antv/g2 */ \"./node_modules/@antv/g2/esm/index.js\");\n/* harmony import */ var _antv_data_set__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @antv/data-set */ \"./node_modules/@antv/data-set/build/data-set.js\");\n/* harmony import */ var _antv_data_set__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_antv_data_set__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var pagepiling_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pagepiling.js */ \"./node_modules/pagepiling.js/jquery.pagepiling.js\");\n/* harmony import */ var pagepiling_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(pagepiling_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _common_ajaxcommand__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/ajaxcommand */ \"./public/javascripts/common/ajaxcommand.js\");\n/* harmony import */ var _common_dataprocess__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/dataprocess */ \"./public/javascripts/common/dataprocess.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n$(function() {\r\n    /**\r\n     * pagepiling配置信息\r\n     */\r\n    $('#container').pagepiling({\r\n        sectionsColor: ['rgba(241,242,235,1)', 'rgba(241,242,235,1)', 'rgba(241,242,235,1)', 'rgba(241,242,235,1)', 'rgba(241,242,235,1)', 'rgba(241,242,235,1)'],\r\n        navigation: {\r\n            'position': 'right',\r\n            'tooltips': ['疫情趋势动画', 'Page 2', 'Page 3', 'Pgae 4', 'Pgae 5', 'Pgae 6']\r\n        }\r\n    });\r\n\r\n\r\n    /**\r\n     * 生成疫情动态气泡地图\r\n     * \r\n     * @method cTendencyTrendFewDays\r\n     * \r\n     * @param {Object} worldData 地图绘制数据\r\n     * @param {Array} opData 疫情数据，需提前排除无用数据\r\n     * @param {Array} fiducialVal 需要引用的数据字段名称\r\n     * @param {String} containerName 容器名称\r\n     */\r\n    function worldMap(worldData, opData, fiducialVal, containerName) {\r\n        let temporaryData = JSON.parse(JSON.stringify(opData));\r\n        const ds = new _antv_data_set__WEBPACK_IMPORTED_MODULE_1___default.a();\r\n\r\n        // 图表配置\r\n        const chart = new _antv_g2__WEBPACK_IMPORTED_MODULE_0__[\"Chart\"]({\r\n            container: containerName,\r\n            autoFit: true,\r\n        });\r\n        chart.scale({\r\n            longitude: {\r\n                sync: true,\r\n            },\r\n            latitude: {\r\n                sync: true,\r\n            },\r\n        });\r\n        chart.axis(false);\r\n        chart.legend(false);\r\n        chart.tooltip({\r\n            showTitle: true,\r\n            showMarkers: false,\r\n            title: 'provinceName'\r\n        });\r\n\r\n        // 地图配置\r\n        const worldGeo = ds.createView().source(worldData, {\r\n            type: 'GeoJSON',\r\n        });\r\n        const mapView = chart.createView();\r\n        mapView.data(worldGeo.rows);\r\n        mapView\r\n            .polygon()\r\n            .position('longitude*latitude')\r\n            .style({\r\n                fill: 'rgba(255,255,255)',\r\n                lineWidth: 1,\r\n                stroke: 'rgba(0,0,0,.3)',\r\n                shadowColor: 'rgba(0,0,0,.06)',\r\n                shadowOffsetX: 5,\r\n                shadowOffsetY: 20,\r\n            })\r\n            .tooltip(false)\r\n            .animate({\r\n                appear: {\r\n                    animation: 'grow-in-xy',\r\n                    duration: 300\r\n                }\r\n            });\r\n\r\n        // 疫情数据处理\r\n        const disData = ds.createView().source(temporaryData);\r\n        disData\r\n            .transform({\r\n                type: 'pick',\r\n                fields: ['date', 'provinceName', 'enName', 'confirmedCount', 'currentConfirmedCount', 'curedCount', 'deadCount']\r\n            })\r\n            .transform({\r\n                type: 'geo.centroid',\r\n                geoDataView: worldGeo,\r\n                field: 'enName',\r\n                as: ['longitude', 'latitude'],\r\n            })\r\n            .transform({\r\n                type: 'partition',\r\n                groupBy: ['date']\r\n            });\r\n        const dates = Object.keys(disData.rows);\r\n        let count = 0;\r\n\r\n        // 疫情数据配置\r\n        const pointView = chart.createView();\r\n        pointView\r\n            .point()\r\n            .position('longitude*latitude')\r\n            .color('#F92F2C')\r\n            .shape(\"circle\")\r\n            .size('currentConfirmedCount', [5, 70])\r\n            .tooltip(\"confirmedCount*currentConfirmedCount*curedCount*deadCount\")\r\n            .style({\r\n                fillOpacity: .3,\r\n                stroke: '#FF5A00'\r\n            }).animate({\r\n                appear: {\r\n                    animation: 'zoom-in',\r\n                    delay: 600,\r\n                    duration: 300\r\n                }\r\n            });\r\n\r\n        pointView.scale({\r\n            confirmedCount: {\r\n                alias: '累计确诊'\r\n            },\r\n            currentConfirmedCount: {\r\n                alias: '现存确诊'\r\n            },\r\n            curedCount: {\r\n                alias: '累计治愈'\r\n            },\r\n            deadCount: {\r\n                alias: '累计死亡'\r\n            }\r\n        });\r\n        let dateUp = function() {\r\n                const date = dates[count];\r\n                pointView.annotation().clear(true);\r\n                pointView.annotation().text({\r\n                    position: ['12%', '80%'],\r\n                    content: disData.rows[date][0]['date'],\r\n                    style: {\r\n                        fontSize: 70,\r\n                        fill: '#999',\r\n                        textAlign: 'center',\r\n                        fillOpacity: 0.3\r\n                    },\r\n                });\r\n                pointView.changeData(disData.rows[date]);\r\n            }\r\n            // dateUp();\r\n        let interval = setInterval(() => {\r\n            if (count === dates.length) {\r\n                clearInterval(interval);\r\n            } else {\r\n                dateUp();\r\n                count++;\r\n                // console.log(count);\r\n            }\r\n\r\n        }, 200);\r\n\r\n        // dateUp();\r\n\r\n        // // 动画配置\r\n        // let anLoopState = 0;\r\n\r\n        // let loopAn = function() {\r\n        //     setInterval(() => {\r\n        //         if (count === dates.length) {\r\n        //             setTimeout(() => {\r\n        //                 count = 0;\r\n        //             }, 5000);\r\n        //         }\r\n        //     }, 200);\r\n\r\n        // }\r\n\r\n        //     //设置圆点的hover效果\r\n        //     userView.state({\r\n        //         active: {\r\n        //             style: {\r\n        //                 lineWidth: 1,\r\n        //                 stroke: '#FF2F29',\r\n        //                 fillOpacity: 0.65,\r\n        //             }\r\n        //         }\r\n        //     });\r\n        pointView.interaction('element-active');\r\n        chart.render();\r\n    }\r\n    async function ceshi() {\r\n        let msg = null;\r\n        // 获取世界地图绘制数据\r\n        await _common_ajaxcommand__WEBPACK_IMPORTED_MODULE_3__[\"getWorldJson\"]();\r\n\r\n        await _common_ajaxcommand__WEBPACK_IMPORTED_MODULE_3__[\"getNcov150day\"]();\r\n        let reqTime = await _common_ajaxcommand__WEBPACK_IMPORTED_MODULE_3__[\"getMaxtimeoftrend\"]();\r\n\r\n        // msg = dataprocess.timestampFiltrate(ajaxcommand.ncov30dayMsg, reqTime[0]['reqTime'], 'same');\r\n        // let fiducialVal = ['confirmedCount', 'currentConfirmedCount', 'curedCount', 'deadCount'];\r\n        worldMap(_common_ajaxcommand__WEBPACK_IMPORTED_MODULE_3__[\"mapmakerMsg\"], _common_dataprocess__WEBPACK_IMPORTED_MODULE_4__[\"ascData\"](_common_ajaxcommand__WEBPACK_IMPORTED_MODULE_3__[\"ncov150dayMsg\"], 'reqTime'), null, 'map');\r\n    }\r\n\r\n    let videoStatus = 0;\r\n    /**\r\n     * 暂停背景视频\r\n     * \r\n     * @method pauseVideo\r\n     */\r\n    function pauseVideo() {\r\n        $('.pauseVideo').on('click', function() {\r\n            document.getElementById(\"video\").pause();\r\n            $('.playVideo').show();\r\n        });\r\n    }\r\n\r\n    /**\r\n     * 播放背景视频\r\n     * \r\n     * @method playVideo\r\n     */\r\n    function playVideo() {\r\n        $('.playVideo').on('click', function() {\r\n            document.getElementById(\"video\").play();\r\n            $('.pauseVideo').show();\r\n        });\r\n    }\r\n\r\n\r\n    playVideo();\r\n    pauseVideo();\r\n\r\n    ceshi();\r\n\r\n});\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\")))\n\n//# sourceURL=webpack:///./public/javascripts/index/index.js?");

/***/ })

})