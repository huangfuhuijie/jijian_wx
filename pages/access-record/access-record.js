// pages/Calendar/Calendar.js
//打卡日历页面
// var util = require('../../utils/util.js');
// var Bmob = require('../../utils/bmob.js');
import * as util from "../../utils/util";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        objectId: '',
        days: [],
        signUp: [],
        cur_year: 0,
        cur_month: 0,
        count: 0,
        show: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({objectId: options.objectId});
        //获取当前年月
        const date = new Date();
        const cur_year = date.getFullYear();
        const cur_month = date.getMonth() + 1;
        const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
        this.calculateEmptyGrids(cur_year, cur_month);
        this.calculateDays(cur_year, cur_month);
        this.setData({
            cur_year,
            cur_month,
            weeks_ch
        })
        //获取当前用户当前任务的签到状态
        this.onGetSignUp();


    },

    // 获取当月共多少天
    getThisMonthDays: function (year, month) {
        return new Date(year, month, 0).getDate()
    },

    // 获取当月第一天星期几
    getFirstDayOfWeek: function (year, month) {
        return new Date(Date.UTC(year, month - 1, 1)).getDay();
    },

    // 计算当月1号前空了几个格子，把它填充在days数组的前面
    calculateEmptyGrids: function (year, month) {
        var that = this;
        //计算每个月时要清零
        that.setData({days: []});
        const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
        if (firstDayOfWeek > 0) {
            for (let i = 0; i < firstDayOfWeek; i++) {
                let obj = {
                    date: null,
                    isSign: false
                }
                that.data.days.push(obj);
            }
            this.setData({
                days: that.data.days
            });
            //清空
        } else {
            this.setData({
                days: []
            });
        }
    },

    // 绘制当月天数占的格子，并把它放到days数组中
    calculateDays: function (year, month) {
        let that = this;
        const thisMonthDays = this.getThisMonthDays(year, month);
        for (let i = 1; i <= thisMonthDays; i++) {
            let obj = {
                date: i,
                isSign: false
            }
            that.data.days.push(obj);
        }
        this.setData({
            days: that.data.days
        });
    },

    //匹配判断当月与当月哪些日子签到打卡
    onJudgeSign: function () {
        let that = this;
        let signs = that.data.signUp;
        let daysArr = that.data.days;
        for (let i = 0; i < signs.length; i++) {
            let current = new Date(signs[i]);
            let year = current.getFullYear();
            let month = current.getMonth() + 1;
            let day = current.getDate();
            day = parseInt(day);
            for (let j = 0; j < daysArr.length; j++) {
                //年月日相同并且已打卡
                if (year == that.data.cur_year && month == that.data.cur_month && daysArr[j].date == day) {
                    daysArr[j].isSign = true;
                }
            }
        }
        that.setData({days: daysArr});
    },

    // 切换控制年月，上一个月，下一个月
    handleCalendar: function (e) {
        const handle = e.currentTarget.dataset.handle;
        const cur_year = this.data.cur_year;
        const cur_month = this.data.cur_month;
        if (handle === 'prev') {
            let newMonth = cur_month - 1;
            let newYear = cur_year;
            if (newMonth < 1) {
                newYear = cur_year - 1;
                newMonth = 12;
            }
            this.calculateEmptyGrids(newYear, newMonth);
            this.calculateDays(newYear, newMonth);
            this.setData({
                cur_year: newYear,
                cur_month: newMonth
            })
            this.onGetSignUp();
        } else {
            let newMonth = cur_month + 1;
            let newYear = cur_year;
            if (newMonth > 12) {
                newYear = cur_year + 1;
                newMonth = 1;
            }
            this.calculateEmptyGrids(newYear, newMonth);
            this.calculateDays(newYear, newMonth);
            this.setData({
                cur_year: newYear,
                cur_month: newMonth
            })
            this.onGetSignUp();
        }
    },
    //获取当前用户该任务的签到数组
    onGetSignUp: function () {
        let fullYear = this.data.cur_year;
        let month = this.data.cur_month;
        let dayNum = new Date(fullYear, month, 0).getDate(); // 获取当前月最后一天
        let endDate=new Date();
        endDate.setFullYear(fullYear);
        endDate.setMonth(month-1);
        endDate.setDate(dayNum);
        let starDate = new Date();
        starDate.setFullYear(fullYear);
        starDate.setMonth(month-1);
        starDate.setDate(1);
        let api = "/wx/user/scanRecord";
        let action = {
            userId: wx.getStorageSync("userId"),
            params: {
                beginTime: starDate,
                endTime: endDate,
            }
        };
        util.postRequest(api, action).then(res => {
            let dates = [];
            let records = res.records;
            for (let i = 0; i < records.length; i++) {
                dates.push(records[i].scanTime);
            }
            this.setData({signUp: dates, count: records.length});
            this.onJudgeSign();
        });
    },
    /**
     * 查看当日用卡详情
     */
    dayDetail: function (e) {
        console.info(e)
        let fullYear = this.data.cur_year;
        let month = this.data.cur_month;
        let date = e.currentTarget.dataset.date;
        wx.navigateTo({
            url:"/pages/record-detail/record-detail?fullYear="+fullYear+"&month="+month+"&date="+date
        })
    },
    showPopup() {
        this.setData({show: true});
    },

    onClose() {
        this.setData({show: false});
    },
})
