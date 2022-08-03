import QRCode from "../../utils/qrcode";
import * as util from "../../utils/util";

Page({
    data: {},
    onLoad: function (options) {
    },
    onShow() {
        this.getUserCode();
    },
    /**
     * 获取用户门禁码
     **/
    getUserCode:function(){
        let api="/wx/userCode";
        let action={
            userId:wx.getStorageSync("userId"),
        };
        util.postRequest(api,action).then(res=>{
            if (res.code==200){
                this.accessCode(res.msg);
            }else {
                console.log('后台出错！')
            }

        });
    },
    /**
     * 生成二维码
     **/
    accessCode: function (userCode) {
        if (userCode) {
            new QRCode({
                canvasId: "myQrcode",
                text: userCode,
                width: 200,
                height: 200,
                image: {
                    imageResource: '../../assets/images/logo.png',
                    dx: 70,
                    dy: 70,
                    dWidth: 60,
                    dHeight: 60,
                },
                callback: (res) => {
                    console.log(res)
                    this.setData({show: true})
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '你还未登录，请先登录了在操作！',
                success: function (res) {
                    console.log(res)
                    if (res.confirm) {
                        console.log('用户点击了确定')
                        wx.reLaunch({
                            url: '/pages/login/login'
                        })
                    } else {
                        console.log('用户点击了取消');
                    }
                }
            })
        }

    },
});
