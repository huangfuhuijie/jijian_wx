import * as util from "../../utils/util";
var log = require('../../utils/log')

Page({
    data: {
        phone: '',
        realName: '',
        stuNum: "",

    },
    onLoad: function (options) {
        this.getUser();
    },
    /**
     *  获取用户信息
     */
    getUser: function () {
        let api = "/wx/user";
        let action = {
            userId: wx.getStorageSync("userId"),
        }
        util.postRequest(api, action).then(res => {
            this.setData({
                phone: res.data.phonenumber,
                realName: res.data.realName,
                stuNum: res.data.stuNum
            })
        })
    },
    /**
     *  保存个人信息
     */
    savePhone: function (e) {
        let api = "/wx/phone";
        let action = {
            phone: this.data.phone,
            realName: this.data.realName,
            stuNum: this.data.stuNum,
        }
        util.postRequest(api, action).then(res => {
            if (res.code === 200) {
                wx.showToast({
                    title: '修改成功!',
                    icon: 'succes',
                    duration: 2000,
                    mask: true
                })
                setTimeout(() => {
                    wx.navigateBack({delta: 1});
                }, 2000)
            } else {
                log.error(res)
                wx.showToast({
                    title: '修改失败!',
                    icon: 'error',
                    duration: 2000,
                    mask: true
                })
            }

        })
    }
});
