export let mapmakerMsg = {}; // 世界地图绘制数据
export let ncov30dayMsg = []; // 近30日国家及地区疫情动态数据
export let ncov60dayMsg = []; // 近60日国家及地区疫情动态数据
export let ncov150dayMsg = []; // 近150日国家及地区疫情动态数据
export let sta30dayMsg = []; // 近30日全球疫情统计数据
export let sta60dayMsg = []; // 近60日全球疫情统计数据
export let enNameMsg = []; // 国家英文名称
export let consta30dayMsg = []; // 近30日每日各洲疫情统计数据
export let consta60dayMsg = []; // 近60日每日各洲疫情统计数据
export let ceshi = { fdasf: 23423 };


/**
 * 获取近30日国家及地区疫情动态数据
 * 
 * @method getNcov30day
 * 
 * @return {Array} 获取到的数据
 */
export async function getNcov30day() {
    return $.ajax({
        type: "GET",
        url: "http://localhost/data/select",
        data: {
            comm: "ncov30day",
        },
        dataType: "json",
    }).done(res => {
        ncov30dayMsg = JSON.parse(JSON.stringify(res));

    }).fail(err => {
        console.log(err);

    });
}

/**
 * 获取近60日国家及地区疫情动态数据
 * 
 * @method getNcov60day
 * 
 * @return {Array} 获取到的数据
 */
export async function getNcov60day() {
    return $.ajax({
        type: "GET",
        url: "http://localhost/data/select",
        data: {
            comm: "ncov60day",
        },
        dataType: "json",
    }).done(res => {
        ncov60dayMsg = JSON.parse(JSON.stringify(res));
    }).fail(err => {
        console.log(err);

    });
}

/**
 * 获取近150日国家及地区疫情动态数据
 * 
 * @method getNcov60day
 * 
 * @return {Array} 获取到的数据
 */
export async function getNcov150day() {
    return $.ajax({
        type: "GET",
        url: "http://localhost/data/select",
        data: {
            comm: "ncov150day",
        },
        dataType: "json",
    }).done(res => {
        ncov150dayMsg = JSON.parse(JSON.stringify(res));
    }).fail(err => {
        console.log(err);

    });
}
/**
 * 获取国家英文名称
 * 
 * @method getEnname
 * 
 * @return {Array} 获取到的数据
 */
export async function getEnname() {
    return $.ajax({
        type: "GET",
        url: "http://localhost/data/select",
        data: {
            comm: 'enname'
        },
        dataType: "json",
    }).done(res => {
        // 拷贝至全局变量enNameMsg
        enNameMsg = JSON.parse(JSON.stringify(res));
    }).fail(err => {
        console.log(err);

    });
}

/**
 * 获取近30日全球疫情统计数据
 * 
 * @method getSta30day
 * 
 * @return {Array} 获取到的数据
 */
export async function getSta30day() {
    return $.ajax({
        type: "GET",
        url: "http://localhost/data/select",
        data: {
            comm: 'sta30day',
        },
        dataType: "json",
    }).done(res => {
        sta30dayMsg = JSON.parse(JSON.stringify(res));
    }).fail(err => {
        console.log(err);

    });
}

/**
 * 获取近60日全球疫情统计数据
 * 
 * @method getSta60day
 * 
 * @return {Array} 获取到的数据
 */
export async function getSta60day() {
    return $.ajax({
        type: "GET",
        url: "http://localhost/data/select",
        data: {
            comm: 'sta60day',
        },
        dataType: "json",
    }).done(res => {
        sta60dayMsg = JSON.parse(JSON.stringify(res));
    }).fail(err => {
        console.log(err);

    });
}

/**
 * 获取近30日每日各洲疫情统计数据
 * 
 * @method getConsta30day
 * 
 * @return {Array} 获取到的数据
 */
export async function getConsta30day() {
    return $.ajax({
        type: "GET",
        url: "http://localhost/data/select",
        data: {
            comm: 'consta30day',
        },
        dataType: "json",
    }).done(res => {
        consta30dayMsg = JSON.parse(JSON.stringify(res));
    }).fail(err => {
        console.log(err);

    });
}

/**
 * 获取近60日每日各洲疫情统计数据
 * 
 * @method getConsta60day
 * 
 * @return {Array} 获取到的数据
 */
export async function getConsta60day() {
    return $.ajax({
        type: "GET",
        url: "http://localhost/data/select",
        data: {
            comm: 'consta60day',
        },
        dataType: "json",
    }).done(res => {
        consta60dayMsg = JSON.parse(JSON.stringify(res));
    }).fail(err => {
        console.log(err);

    });
}

/**
 * 获取世界地图绘制数据
 * 
 * @method getWorldJson
 * 
 * @return {Object} 获取到的地图绘制数据
 */
export async function getWorldJson() {
    return $.ajax({
        type: "GET",
        url: "/json/world.json",
        dataType: "json",
    }).done(res => {
        mapmakerMsg = JSON.parse(JSON.stringify(res));
    }).fail(err => {
        console.log(err);

    });
}

/**
 * 获取关于国家及地区最新疫情动态的时间点
 * 
 * @method getMaxtimeoftrend
 * 
 * @return {Array} 获取到的数据
 */
export async function getMaxtimeoftrend() {
    return $.ajax({
        type: "GET",
        url: "http://localhost/data/select",
        data: {
            comm: 'maxtimeoftrend'
        },
        dataType: "json",
    }).done(res => {

    }).fail(err => {
        console.log(err);

    });
}

/**
 * 获取最新疫情新闻资讯
 * 
 * @method getNewsnewest
 * 
 * @return {Array} 获取到的数据
 */
export async function getNewsnewest() {
    return $.ajax({
        type: "GET",
        url: "http://localhost/data/select",
        data: {
            comm: 'newsnewest'
        },
        dataType: "json",
    }).done(res => {

    }).fail(err => {
        console.log(err);

    });
}