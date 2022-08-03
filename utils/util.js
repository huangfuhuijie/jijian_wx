import * as config from "./config";

/**
 * 时间格式转换
 */
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}
/**
 * GET类型的网络请求
 */
const getRequest = (api, action) => {
    return requestAll(api, action, 'GET')
}

/**
 * DELETE类型的网络请求
 */
const deleteRequest = (api, action) => {
    return requestAll(api, action, 'DELETE')
}

/**
 * PUT类型的网络请求
 */
const putRequest = (api, action) => {
    return requestAll(api, action, 'PUT')
}

/**
 * POST类型的网络请求
 */
const postRequest = (api, action) => {
    return requestAll(api, action, 'POST')
}
/**
 * 网络请求
 */
const requestAll = (api, action, method) => {
    return new Promise((resolve, reject) => {
        const json = JSON.stringify(action);
        const token = wx.getStorageSync("token");
        wx.request({
            url: config.base_url + api,
            data: json,
            method: method,
            header: {
                'content-type': 'application/json',
                'Authorization': token,
            },
            success(res) {
                if (res.statusCode === 404) {
                    reject('请求资源不存在')
                } else if (res.statusCode === 502) {
                    reject('服务端出现了问题')
                } else if (res.statusCode === 403) {
                    reject('没有权限访问')
                } else if (res.statusCode === 200) {
                    if (res.data.code === 205) {
                        // wx.clearStorageSync()
                        // wx.reLaunch({
                        //     url: '/pages/login/login'
                        // })
                        // wx.showToast({
                        //     title: '登录状态过期，请重新登录',
                        //     icon: 'none',
                        //     duration: 2000
                        // })
                    } else if (res.data.code === 401) {
                        // wx.clearStorageSync()
                        // wx.showModal({
                        //     title:'提示',
                        //     content:'你还未登录，请先登录了再操作！',
                        //     success:function(res){
                        //         console.log(res)
                        //         if(res.confirm){
                        //             console.log('用户点击了确定')
                        //             wx.reLaunch({
                        //                 url: '/pages/login/login'
                        //             })
                        //         }else {
                        //             console.log('用户点击了取消');
                        //         }
                        //     }
                        // })
                        // wx.reLaunch({
                        //     url: '/pages/login/login'
                        // })
                        // wx.showToast({
                        //     title: '认证失败，请重新登录',
                        //     icon: 'none',
                        //     duration: 2000
                        // })
                    } else {
                        if (res.header.Authorization) {
                            wx.setStorageSync('token', res.header.Authorization)
                        }
                        resolve(res.data)
                    }
                }
            },
            fail(error) {
                console.error(error)
                if (error.errMsg === 'request:fail timeout') {
                    error.errMsg = '请求超时'
                }
            },
            error(e) {
                console.error('api', '请求接口出现问题', e)
            }
        });
    }).catch((error) => {
        throw error;
    });
}
//查询添加事件范围
const addDateRange=(params, dateRange, propName) =>{
    let search = params;
    search.params = {};
    if (null != dateRange && '' != dateRange) {
        if (typeof (propName) === "undefined") {
            search.params["beginTime"] = dateRange[0];
            search.params["endTime"] = dateRange[1];
        } else {
            search.params["begin" + propName] = dateRange[0];
            search.params["end" + propName] = dateRange[1];
        }
    }
    return search;
}
module.exports = {
    formatTime,
    getRequest,
    deleteRequest,
    putRequest,
    postRequest,
    addDateRange
}
