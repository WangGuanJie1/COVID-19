/**
 * 对象数组中的某个键值进行升序排序
 * 
 * @method ascData
 * 
 * @param {Array} sourceData 数据
 * @param {String} key 键名
 
 * @return 升序排列过后的对象数组
 */
export function ascData(sourceData, key) {
    let temporaryData = JSON.parse(JSON.stringify(sourceData));
    temporaryData.sort((a, b) => {
        return a[key] - b[key];
    });
    return temporaryData;
};

/**
 * 对象数组中的某个键值进行降序排序
 * 
 * @method descData
 * 
 * @param {Array} sourceData 数据
 * @param {String} key 键名
 * 
 * @return 降序排列过后的对象数组
 */
export function descData(sourceData, key) {
    let temporaryData = JSON.parse(JSON.stringify(sourceData));
    temporaryData.sort((a, b) => {
        return b[key] - a[key];
    });
    return temporaryData;
};

/**
 * 时间戳转日期
 * 
 * @method timeStampDis
 * 
 * @param {Array} sourceData 数据
 * @param {String} type 日期转换类型
 * @param {String} jointMark 格式连接符
 * @param {String} timeKey 转换字段
 * 
 * @return 转换后的数组对象
 */
export function timeStampDis(sourceData, type = 'datetime', jointMark = '-', timeKey = 'reqTime') {
    let temporaryData = JSON.parse(JSON.stringify(sourceData));
    switch (type) {
        // 日期时间型
        case 'datetime':
            {
                for (const item in temporaryData) {
                    let reqTimeVal = new Date(parseInt(temporaryData[item][timeKey]) * 1000);
                    let year = reqTimeVal.getFullYear();
                    let month = reqTimeVal.getMonth() + 1;
                    let day = reqTimeVal.getDate();
                    let hours = reqTimeVal.getHours();
                    let min = reqTimeVal.getMinutes();
                    let sec = reqTimeVal.getSeconds();
                    temporaryData[item][timeKey] = year + jointMark + month + jointMark + day + ' ' + hours + ':' + min + ':' + sec;
                }
                break;
            }
            // 日期时间型（中文年月日时分秒做拼接）
        case 'datetimeCn':
            {
                for (const item in temporaryData) {
                    let reqTimeVal = new Date(parseInt(temporaryData[item][timeKey]) * 1000);
                    let year = reqTimeVal.getFullYear();
                    let month = reqTimeVal.getMonth() + 1;
                    let day = reqTimeVal.getDate();
                    let hours = reqTimeVal.getHours();
                    let min = reqTimeVal.getMinutes();
                    let sec = reqTimeVal.getSeconds();
                    temporaryData[item][timeKey] = year + '年' + month + '月' + day + '日' + hours + '时' + min + '分' + sec + '秒';
                }
                break;
            }
            // 日期型（包含年份）
        case 'date':
            {
                for (const item in temporaryData) {
                    let reqTimeVal = new Date(parseInt(temporaryData[item][timeKey]) * 1000);
                    let year = reqTimeVal.getFullYear();
                    let month = reqTimeVal.getMonth() + 1;
                    let day = reqTimeVal.getDate();
                    temporaryData[item][timeKey] = year + jointMark + month + jointMark + day;
                }
                break;
            }
            // 日期型（包含年份，中文年月日做拼接）
        case 'dateCn':
            {
                for (const item in temporaryData) {
                    let reqTimeVal = new Date(parseInt(temporaryData[item][timeKey]) * 1000);
                    let year = reqTimeVal.getFullYear();
                    let month = reqTimeVal.getMonth() + 1;
                    let day = reqTimeVal.getDate();
                    temporaryData[item][timeKey] = year + '年' + month + '月' + day + '日';
                }
                break;
            }
            // 日期型（不包含年份）
        case 'monthday':
            {
                for (const item in temporaryData) {
                    let reqTimeVal = new Date(parseInt(temporaryData[item][timeKey]) * 1000);
                    let month = reqTimeVal.getMonth() + 1;
                    let day = reqTimeVal.getDate();
                    temporaryData[item][timeKey] = month + jointMark + day;
                }
                break;
            }
            // 日期型（不包含年份，中文日月做拼接）
        case 'monthdayCn':
            {
                for (const item in temporaryData) {
                    let reqTimeVal = new Date(parseInt(temporaryData[item][timeKey]) * 1000);
                    let month = reqTimeVal.getMonth() + 1;
                    let day = reqTimeVal.getDate();
                    temporaryData[item][timeKey] = month + '月' + day + '日';
                }
                break;
            }
            // 自定： x月x日 x:x
        case 'custom':
            {
                for (const item in temporaryData) {
                    let reqTimeVal = new Date(parseInt(temporaryData[item][timeKey]) * 1000);
                    let month = reqTimeVal.getMonth() + 1;
                    let day = reqTimeVal.getDate();
                    let hours = reqTimeVal.getHours();
                    let min = reqTimeVal.getMinutes();
                    temporaryData[item][timeKey] = month + '月' + day + '日&ensp;' + hours + ':' + min;
                }
                break;
            }
        default:
            break;
    }
    return temporaryData;
}

/**
 * 数据单项分类处理
 * 
 * @method dataClassification
 * 
 * ```ts
 * dataClassification(data,{
 *      typeInfo: [{
 *          keyName: 'key1',
 *          keyValue: '现存确诊',
 *          valKeyName: 'key2',
 *          correspondingKey: 'currentConfirmedCount',
 *      }, ],
 *      saveKey: ['reqTime']
 *  });
 * ```
 * 
 * @param {Array} sourceData 数据
 * @param {Object} optionList 分类参数配置
 * 
 * @return 单项分类过后的结果集
 */
export function dataClassification(sourceData, optionList) {
    let temporaryData = JSON.parse(JSON.stringify(sourceData));
    let disData = [];
    for (const item in temporaryData) {
        for (const type in optionList.typeInfo) {
            let baseObj = {};
            for (const save in optionList.saveKey) {
                baseObj[optionList.saveKey[save]] = temporaryData[item][optionList.saveKey[save]];
            }
            baseObj[optionList.typeInfo[type].keyName] = optionList.typeInfo[type].keyValue;
            baseObj[optionList.typeInfo[type].valKeyName] = temporaryData[item][optionList.typeInfo[type].correspondingKey];
            disData.push(baseObj);
        }
    }
    return disData;
}

/**
 * 数据键值提取
 * 
 * @method keyValGetOut
 * 
 * ```ts
 *  keyValGetOut(data, {
 *      keyName: 'name',
 *      valKeyName: 'enName'
 *  },]);
 * ```
 *
 * @param {Array} sourceData 数据
 * @param {Array} optionList 提取键值配置
 * 
 * @return {Array} 提取过后的数据
 */
export function keyValGetOut(sourceData, optionList) {
    let temporaryData = JSON.parse(JSON.stringify(sourceData));
    let disData = [];
    for (const item in temporaryData) {
        let baseObj = {};
        for (const option in optionList) {
            baseObj[optionList[option]['keyName']] = temporaryData[item][optionList[option]['valKeyName']];
        }
        disData.push(baseObj);
    }
    return disData;
}

/**
 * 根据时间戳进行数据筛选
 * 
 * @param {Array} sourceData 数据
 * @param {Number} reqTime 时间戳
 * @param {String} mode 筛选模式
 * 
 * @return {Array} 筛选过后的数据
 */
export function timestampFiltrate(sourceData, reqTime, mode) {
    let temporaryData = JSON.parse(JSON.stringify(sourceData));
    let filtrateData = [];

    switch (mode) {
        case 'same': // 与时间戳相同
            {
                for (const item in temporaryData) {
                    if (temporaryData[item]['reqTime'] === reqTime) {
                        filtrateData.push(temporaryData[item]);
                    }
                }
                break;
            }
        case 'before': // 在时间戳之前
            {
                for (const item in temporaryData) {
                    if (temporaryData[item]['reqTime'] < reqTime) {
                        filtrateData.push(temporaryData[item]);
                    }
                }
                break;
            }
        case 'after': // 在时间戳之后
            {
                for (const item in temporaryData) {
                    if (temporaryData[item]['reqTime'] > reqTime) {
                        filtrateData.push(temporaryData[item]);
                    }
                }
                break;
            }
        case 'samedate': // 与时间戳同日
            {
                let data = JSON.parse(JSON.stringify(temporaryData));
                let monthDay = timeStampDis([{ reqTime: reqTime }], 'monthday');
                for (const item in data) {
                    let cnTime = timeStampDis([data[item]], 'monthday');
                    if (cnTime[0]['reqTime'] === monthDay[0]['reqTime']) {
                        filtrateData.push(data[item]);
                    }
                }
                break;
            }
        case 'samedatefirst': // 与时间戳同日的首次记录
            {
                let data = ascData(JSON.parse(JSON.stringify(temporaryData)), 'reqTime');
                let firstTime = null;
                let filData = [];
                let monthDay = timeStampDis([{ reqTime: reqTime }], 'monthday');
                for (const item in data) {
                    let cnTime = timeStampDis([data[item]], 'monthday');
                    if (cnTime[0]['reqTime'] === monthDay[0]['reqTime']) {
                        if (firstTime === null) {
                            firstTime = data[item]['reqTime'];
                        }
                        if (firstTime === data[item]['reqTime']) {
                            filData.push(data[item]);
                        }
                    }
                }
                filtrateData = filData;
                break;
            }
        case 'samedatelast': // 与时间戳同日的最后一次记录
            {
                let data = descData(JSON.parse(JSON.stringify(temporaryData)), 'reqTime');
                let firstTime = null;
                let filData = [];
                let monthDay = timeStampDis([{ reqTime: reqTime }], 'monthday');
                for (const item in data) {
                    let cnTime = timeStampDis([data[item]], 'monthday');
                    if (cnTime[0]['reqTime'] === monthDay[0]['reqTime']) {
                        if (firstTime === null) {
                            firstTime = data[item]['reqTime'];
                        }
                        if (firstTime === data[item]['reqTime']) {
                            filData.push(data[item]);
                        }
                    }
                }
                filtrateData = filData;
                break;
            }
        default:
            {
                filtrateData = temporaryData;
                break;
            }
    }
    return filtrateData;
}

/**
 * 根据星期编号筛选数据
 * 
 * @method weekCondition
 * 
 * @param {Array} sourceData 数据
 * @param {Number} week 星期编号
 * 
 * @return 筛选过后的数据
 */
export function weekCondition(sourceData, week = new Date().getDay()) {
    let temporaryData = JSON.parse(JSON.stringify(sourceData));
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (week > 6 || week < 0) {
        week = 0;
    }
    let disData = [];
    for (const item in temporaryData) {
        if (temporaryData[item]['week'] === days[week]) {
            disData.push(temporaryData[item]);
        }
    }
    return disData;
}

/**
 * 求现存确诊、累计治愈、累计死亡百分比
 * 
 * @method percentGeneration
 * 
 * ```ts
 * 传入数据例子：
 *  [{
 *      id: 347, reqTime: 1588921304, 
 *      currentConfirmedCount: 2271268, 
 *      confirmedCount: 3802492, 
 *      curedCount: 1262241, 
 *      deadCount: 268983,
 *      ......
 *  }]
 * ```
 * 
 * @param {Array} sourceData 仅一条数据，不支持多条
 * 
 * @return {Array} 运算过后的数据
 */
export function percentGeneration(sourceData) {
    let temporaryData = JSON.parse(JSON.stringify(sourceData));
    // 分类配置
    let claKeyName = "item";
    let claValKeyName = "value";
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
        saveKey: ['reqTime']
    };
    let disData = dataClassification(temporaryData, claConf);
    let sum = 0;
    for (const item in disData) {
        sum += disData[item]['value'];
    }
    for (const item in disData) {
        let calculate = disData[item]['value'] / sum;
        disData[item]['percent'] = Math.round(calculate * 100) / 100;
    }
    return disData;
}