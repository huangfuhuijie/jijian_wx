import * as util from "../../utils/util";

Page({
    data: {
        records:[],//每日出入时间列表
    },
    onLoad: function (options) {
        console.info(options)
        let fullYear = options.fullYear;
        let month = options.month;
        let date = options.date;
        let time = new Date();
        time.setFullYear(fullYear);
        time.setMonth(month-1);
        time.setDate(date);
        let api = "/wx/user/scanRecord/detail";
        let action = {
            userId: wx.getStorageSync("userId"),
            params: {
                beginTime: time,
                endTime: time,
            }
        }
        util.postRequest(api, action).then(res => {
            this.setData({records:res.records});
        });
    }
});
