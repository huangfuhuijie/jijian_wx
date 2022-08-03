import * as util from "../../utils/util";

Page({
    data: {
        isLogin: undefined,
        userName: undefined,
        avatar: undefined,
        userPhone: undefined,
        userId: undefined,
        cardTotal: 0,
    },
    onShow: function (options) {
        this.setData({
            isLogin: wx.getStorageSync("isLogin"),
            userName: wx.getStorageSync("nickName"),
            avatar: wx.getStorageSync("avatar"),
            userPhone: wx.getStorageSync("phone"),
            userId: wx.getStorageSync("userId"),
        })
        // 页面创建时切换tab-bar
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 3
            })
        }
        this.getCardCount();

    },
    /**
     * 查看个人card个数
     **/
    getCardCount: function () {
        let api = "/wx/activate/card/list";
        let action = {
            userId: wx.getStorageSync("userId"),
        };
        util.postRequest(api, action).then(res => {
            this.setData({
                cardTotal: res.rows.length,
            })
        });
    },
    /**
     * 跳转到登录页面
     **/
    goLogin: function () {
        wx.navigateTo({url: "/pages/login/login"});
    },
    /**
     * 跳转到卡包页面
     **/
    goCard() {
        wx.navigateTo({
            url: "/pages/card/card"
        })
    },
    /**
     * 跳转到预约界面
     **/
    goAppointment: function () {
        wx.showToast({
            title: '功能正在开发中！',
            icon: 'none',
            duration: 2000
        })
        // wx.navigateTo({
        //     url: "/pages/card/card"
        // })
    },
    /**
     * 扫一扫
     **/
    scanCode(e) {
        wx.scanCode({
            success: (res) => {
                let result = res.result;
                console.info(result);
            },
        })
    },
    /**
     * 扫一扫
     **/
    goPersonInfo(e) {
        wx.navigateTo({url: "/pages/person-info/person-info"})
    },
    /**
     * 扫一扫
     **/
    goAccessRecord(e) {
        wx.navigateTo({url: "/pages/access-record/access-record"})
    }
});
