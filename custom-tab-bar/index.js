Component({
    data: {
        selected: 0,
        show:true,
        color: "#7A7E83",
        selectedColor: "#3cc51f",
        list: [
            {
                pagePath: "/pages/index/index",
                iconPath: "/assets/images/index.png",
                selectedIconPath: "/assets/images/index-active.png",
                text: "首页"
            },
            // {
            //     pagePath: "/pages/course/course",
            //     iconPath: "/assets/images/course.png",
            //     selectedIconPath: "/assets/images/course-active.png",
            //     text: "预约"
            // },
            // {
            //     pagePath: "/pages/timetable/timetable",
            //     iconPath: "/assets/images/timetable.png",
            //     selectedIconPath: "/assets/images/timetable-active.png",
            //     text: "课程"
            // },
            {
                pagePath: "/pages/person/person",
                iconPath: "/assets/images/person.png",
                selectedIconPath: "/assets/images/person-active.png",
                text: "我的"
            }
        ]
    },
    attached() {
    },
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset
            const url = data.path
            wx.switchTab({url})
            this.setData({
                selected: data.index
            })
        }
    }
})
