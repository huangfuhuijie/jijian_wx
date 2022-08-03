import QRCode from '../../utils/qrcode.js';
import * as util from "../../utils/util";
import * as config from "../../utils/config";
var log = require('../../utils/log')

Page({
    data: {
        isLogin: "",//用户是否登录
        show: false,//是否显示门禁码
        isWechatPublic: false,//是否显示公众号
        number: 0,//实时人数
        store: config.store
    },
    onReady() {
        this.getOnlineCount();
        this.isLogin = wx.getStorageSync("isLogin");
        this.login();
        // if (this.isLogin === true) {
        //
        // } else {
        //     this.login();
        // }
        // this.canvasImg();
    },
    onShow: function (options) {
        // 页面创建时显示tab-bar
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
        }
    },
    /**
     *  默认登录
     */
    login: function () {
        //用户默认没有登录
        wx.setStorageSync("isLogin", false);
        wx.login({
            success: res => {
                let that = this;
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
                            if (res.statusCode === 200) {
                                if (res.data.code === 200) {
                                    //后台根据code获取到openid与session_key并返回一个token和用户授权状态，
                                    // 根据授权状态判断是否跳转授权页面
                                    let userInfoStatus = res.data.iSWxUserInfoComplete;
                                    wx.setStorageSync('token', res.data.token);
                                    wx.setStorageSync("userCode", res.data.user.userCode);
                                    wx.setStorageSync("nickName", res.data.user.nickName);
                                    wx.setStorageSync("phone", res.data.user.phonenumber);
                                    wx.setStorageSync("userId", res.data.user.userId);
                                    wx.setStorageSync("avatar", res.data.user.avatar);
                                    console.info(res)
                                    //如果用户信息完善就直接进入index页面，如果不完善就让用户授权获取用户信息 1：不完整 2：完整
                                    if (userInfoStatus == 2) {
                                        wx.setStorageSync("isLogin", true);
                                    } else {
                                        wx.setStorageSync("isLogin", false);
                                    }
                                    that.isComplete();
                                } else {
                                    log.error(res)
                                    wx.showToast({
                                        title: "调用后台失败，请联系管理员！",
                                        icon: 'none',
                                    })
                                }
                            } else {
                                log.error(res)
                                wx.showToast({
                                    title: "调用后台失败，请联系管理员！",
                                    icon: 'none',
                                })
                            }
                        },
                        fail(error) {
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
    rand(min, max) {
        return parseInt(Math.random() * (max - min + 1) + min, 10);
      },
    /**
     * 循环获取在线人数
     */
    getOnlineCount: function () {
        // let api = "/wx/peopleCount";
        // let action = {}
        // //进来先获取一次数据
        // util.getRequest(api, action).then(res => {
        //     this.setData({number: res.data.peopleCount});
        // });
        // //实时人数定时循环获取数据
        // setInterval(() => {
        //     util.getRequest(api, action).then(res => {
        //         this.setData({number: res.data.peopleCount});
        //     });
        // }, 1000 * 30);
        var peopleList = [0,0,0,0,0,0,0,0,0,2,5,10,20,20,15,15,15,15,20,25,30,35,35,0]
        var date = new Date();
        var peopleNumber = this.rand(Math.max(0,peopleList[date.getHours()]-5),peopleList[date.getHours()]+10)
        this.setData({number: peopleNumber});
    },
    /**
     * 拨打店铺联系电话
     **/
    callPhone(e) {
        wx.makePhoneCall({phoneNumber: this.data.store.phoneNumber,})
    },
    /**
     *  绘制人数提示动态小动画
     */
    canvasImg: function () {
        const query = wx.createSelectorQuery()
        query.select('#myCanvas')
            .fields({node: true, size: true})
            .exec((res) => {
                const oc = res[0].node;
                const ctx = oc.getContext('2d');
                const colors = ["#21da6d", "#21da6d", "#21da6d"];
                console.info(oc)
                const lineArr = [

                    {
                        start: {
                            x: 10,
                        },
                        end: {
                            x: 10,
                            y: 50
                        }
                    },
                    {
                        start: {
                            x: 20
                        },
                        end: {
                            x: 20,
                            y: 0
                        }
                    },
                    {
                        start: {
                            x: 30
                        },
                        end: {
                            x: 30,
                            y: 70
                        }
                    },
                ];
                ctx.clearRect(0, 0, oc.width, oc.height);
                ctx.save();
                ctx.fillStyle = "#2a2929";
                ctx.fillRect(0, 0, oc.width, oc.height);
                ctx.restore();

                function step() {
                    ctx.clearRect(0, 0, oc.width, oc.height);
                    ctx.save();
                    ctx.fillStyle = "#2a2929";
                    ctx.fillRect(0, 0, oc.width, oc.height);
                    ctx.restore();

                    for (let i = 0; i < lineArr.length; i++) {
                        if (lineArr[i].end.y >= oc.height - 10) {
                            lineArr[i].end.dir = 'add';
                        } else if (lineArr[i].end.y <= 10) {
                            lineArr[i].end.dir = 'minus';
                        }
                        if (lineArr[i].end.dir === 'minus') {
                            lineArr[i].end.y += 4;
                        } else {
                            lineArr[i].end.y -= 4;
                        }

                    }
                    for (let i = 0; i < lineArr.length; i++) {
                        ctx.save();
                        ctx.fillStyle = colors[i];
                        ctx.fillRect(lineArr[i].start.x, oc.height - lineArr[i].end.y, 3, lineArr[i].end.y);
                        ctx.restore();
                    }
                    oc.requestAnimationFrame(step);
                }

                oc.requestAnimationFrame(step);
            })
    },
    /**
     * 查看店铺位置
     **/
    openLocation(e) {
        wx.openLocation({
            longitude: Number(this.data.store.longitude),
            latitude: Number(this.data.store.latitude),
            name: this.data.store.name,
            address: this.data.store.address
        })
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
     * 跳转到卡包页面
     **/
    goCard(e) {
        wx.navigateTo({
            url: "/pages/card/card"
        })
    },
    /**
     * 生成二维码
     **/
    accessCode: function (e) {
        wx.navigateTo({
            url: "/pages/door-code/door-code"
        })
        // let userCode = wx.getStorageSync("userCode");
        // if (userCode) {
        //     new QRCode({
        //         canvasId: "myQrcode",
        //         text: userCode,
        //         width: 200,
        //         height: 200,
        //         image: {
        //             imageResource: '../../assets/images/logo.jpg',
        //             dx: 70,
        //             dy: 70,
        //             dWidth: 60,
        //             dHeight: 60,
        //         },
        //         callback: (res) => {
        //             console.log(res)
        //             this.setData({show: true})
        //         }
        //     })
        // } else {
        //     wx.showModal({
        //         title: '提示',
        //         content: '你还未登录，请先登录了在操作！',
        //         success: function (res) {
        //             console.log(res)
        //             if (res.confirm) {
        //                 console.log('用户点击了确定')
        //                 wx.reLaunch({
        //                     url: '/pages/login/login'
        //                 })
        //             } else {
        //                 console.log('用户点击了取消');
        //             }
        //         }
        //     })
        // }

    },
    /**
     * 关闭二维码弹框
     **/
    onClose() {
        this.setData({show: false});
    },
    /**
     * 跳转到构买卡包页面
     **/
    payCard: function () {
        wx.showToast({
            title: '目前暂不支持线上购买',
            icon: 'none',
            duration: 2000
        })
        // wx.navigateTo({
        //     url: "/pages/active-card/active-card"
        // })
    },
    /**
     * 关注公众号
     **/
    openWechat: function () {
        this.setData({isWechatPublic: true});
    },
    /**
     *  关闭公众号弹框
     **/
    wechatPublicClose() {
        this.setData({isWechatPublic: false});
    },
    /**
     * 长按保存图片
     */
    saveImg(e) {
        let url = e.currentTarget.dataset.url;
        wx.saveImageToPhotosAlbum({
            filePath: url,
            success(res) {
                console.log(res);
                wx.showToast({
                    title: '保存成功！',
                    icon: 'none',
                    duration: 2000
                })
            },
            fail(res) {
                console.log(res);
                wx.showToast({
                    title: '保存失败！',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    /**
     *  判断用户信息是否完善
     */
    isComplete(){
        let api="/wx/user/complete";
        let action={userId:wx.getStorageSync("userId") };
        util.postRequest(api,action).then(res=>{
            console.info(res)
            //如果用户信息不完善提醒他完善个人信息
            if(!res.isUserInfoComplete){
                wx.showModal({
                    title: '提示',
                    content: '请完善个人信息',
                    success (res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: "/pages/person-info/person-info"
                            })
                        } else if (res.cancel) {

                        }
                    }
                })
            }
        });

    }
});
