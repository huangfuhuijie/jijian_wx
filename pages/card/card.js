import * as util from "../../utils/util";

Page({
    data: {
        myCardList:[],
    },
    onShow: function (options) {
        let api = "/wx/activate/card/list";
        let action = {
            userId:wx.getStorageSync("userId"),
        };
        util.postRequest(api, action).then(res => {
            for (let i =0;i<res.rows.length;i++){
                let j=res.rows[i].remainingTime.indexOf("天");
                if(j===-1){
                    res.rows[i].remainingTime="0天"
                }else {
                    res.rows[i].remainingTime=res.rows[i].remainingTime.substring(0,j+1);
                }

            }
            this.setData({
                myCardList: res.rows,
            })
        });
    },
    /**
     * 跳转到购买卡包页面
     **/
    goRenew() {
        // wx.navigateTo({
        //     url:"/pages/active-card/active-card"
        // })
    }
});
