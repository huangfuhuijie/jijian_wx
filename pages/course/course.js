Page({
    data: {},
    /**
     *  页面创建时切换tab-bar
     */
    onShow: function(options) {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 1
            })
        }
    },
});
