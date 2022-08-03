import * as util from "../../utils/util";
import * as config from "../../utils/config";

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUseGetUserProfile: false,
    },
    onLoad() {
        //判断是否有wx.getUserProfile这个方法
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
        //默认登录
        wx.login({
            success: res => {
                let code = res.code;//发送给服务器的code
                if (code) {
                    let api = "/wxLogin";
                    let action = {code: code};
                    wx.request({
                        url: config.base_url + api,
                        data: action,
                        method: "post",
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success(res) {
                            if (res.data.code === 200) {
                                //后台根据code获取到openid与session_key并返回一个token和用户授权状态，
                                // 根据授权状态判断是否跳转授权页面
                                let userInfoStatus = res.data.iSWxUserInfoComplete;
                                wx.setStorageSync('token', res.data.token);
                                wx.setStorageSync("userCode", res.data.user.userCode);
                                wx.setStorageSync("userId", res.data.user.userId);
                                console.info(res)
                                //如果用户信息完善就直接进入index页面，如果不完善就让用户授权获取用户信息 1：不完整 2：完整
                                if (userInfoStatus == 2) {
                                    wx.setStorageSync("nickName", res.data.user.nickName);
                                    // wx.setStorageSync("phone", res.data.user.phonenumber);
                                    wx.setStorageSync("avatar", res.data.user.avatar);
                                    wx.setStorageSync("isLogin", true);
                                    wx.switchTab({
                                        url: '/pages/index/index'
                                    })
                                }
                            } else {
                                wx.showToast({
                                    title: "调用后台失败，请联系管理员！",
                                    icon: 'none',
                                })
                            }
                        },
                        fail(error) {
                            console.error(error)
                            if (error.errMsg === 'request:fail timeout') {
                                error.errMsg = '请求超时'
                            }
                        }
                    })
                } else {
                    console.log("获取用户登录态失败！");
                }
            }
        })
    },
    /**
     *  授权获取用户信息
     */
    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '用于完善成员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                this.setData({
                    userInfo: res.userInfo,
                    // hasUserInfo: true
                });
                this.putUserInfo();
            },
            fail: (error) => {
                wx.showToast({
                    title: "授权失败,请重新授权！",
                    icon: 'none',
                })
            }
        })
    },
    getUserInfo(e) {
        // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
        this.setData({
            userInfo: e.detail.userInfo,
            // hasUserInfo: true
        })
        this.putUserInfo();
    },
    /**
     *  用户信息存入数据库
     */
    putUserInfo() {
        let api = "/wx/user";
        let action = {
            nickName: this.data.userInfo.nickName,
            avatar: this.data.userInfo.avatarUrl,
        };
        util.putRequest(api, action).then(res => {
            wx.setStorageSync("nickName", this.data.userInfo.nickName);
            wx.setStorageSync("avatar", this.data.userInfo.avatarUrl);
            wx.setStorageSync("isLogin", true);
            //不直接授权获取手机号之后，保存完用户信息直接进入首页
            wx.switchTab({
                url: '/pages/index/index'
            })
        });
    },
    /**
     *  用户授权手机号 (目前没用改到了个人中心手动添加)
     */
    getPhoneNumber: function (e) {//这个事件同样需要拿到e
        let ency = e.detail.encryptedData;
        let iv = e.detail.iv;
        let errMsg = e.detail.errMsg
        if (iv == null || ency == null) {
            wx.showToast({
                title: "授权失败,请重新授权！",
                icon: 'none',
            })
            return false
        }
        //把获取手机号需要的参数取到，然后存到头部data里面
        this.setData({
            ency: ency,
            iv: iv,
            errMsg: errMsg
        })
        this.upPhoneNumber();
    },
    upPhoneNumber: function () {
        let api = "/wx/phone";
        let action = {
            encryptedData: this.data.ency,
            iv: this.data.iv,
        };
        util.postRequest(api, action).then(res => {
            wx.switchTab({
                url: '/pages/index/index'
            })
        });
    },
    /**
     *  直接进入主页面
     */
    goReturn: function (e) {
        wx.switchTab({
            url: '/pages/index/index'
        })
    }
})
