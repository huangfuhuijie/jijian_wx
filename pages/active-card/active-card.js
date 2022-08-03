import * as util from "../../utils/util";

Page({
    data: {
        show: false,
        cardList: [],
        selectCard: {},
        inviteCode:"",//邀请码
    },
    /**
     *  默认加载卡片种类
     */
    onLoad: function (options) {
        let api = "/card/list";
        let action = {};
        util.postRequest(api, action).then(res => {
            console.info(res)
            this.setData({
                cardList: res.rows,
            })
        });
    },
    /**
     *  弹出购买框
     */
    showPopup(e) {
        //设置选中的卡
        this.setData({selectCard: e.currentTarget.dataset.card, show: true});
    },
    /**
     *  关闭购买框
     */
    onClose() {
        this.setData({show: false});
    },
    /**
     *  支付
     */
    payment:function (e) {

    }
});
