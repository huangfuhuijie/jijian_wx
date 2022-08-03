import * as weekUtil from "../../utils/weekUtil";
import * as util from "../../utils/util";

Page({
    data: {
        year:2021,
        dates: {},
        show: false,
        week: 1,//选中的周几
        timetables:[],//当前选中日期课程
    },
    /**
     *  初始日期显示
     */
    onShow: function (options) {
        let date = new Date();
        let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
        let dates = weekUtil.getDates(7, new Date());
        this.setData({
            year:date.getFullYear(),
            show: false,
            dates: dates,
            week: show_day[date.getDay()]
        });
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 1
            })
        }
        this.getCourse(new Date());
    },

    onDisplay() {
        this.getTabBar().setData({
            show: false,
        });
        this.setData({show: true});
    },
    onClose() {
        this.setData({show: false});
        //date组件动画时间300ms
        setTimeout(() => {
            this.getTabBar().setData({
                show: true,
            });
        }, 300)

    },
    onConfirm(event) {
        let date=event.detail;
        console.info(date);
        date.setHours(8);
        let dates = weekUtil.getDates(7, date);
        let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
        this.setData({
            year:date.getFullYear(),
            show: false,
            dates: dates,
            week: show_day[date.getDay()]
        });
        this.getCourse(date);
        setTimeout(() => {
            this.getTabBar().setData({
                show: true,
            });
        }, 300)
    },
    /**
     * 选择时间
     */
    weekClick: function (e) {
        let data= e.currentTarget.dataset.date;
        this.setData({
            week: data.week,
        });
        this.getCourse(new Date(data.fullDate));
    },
    /**
     * 查询选中日期的课程
     */
    getCourse:function (date) {
        console.info(date)
        let api = "/wx/timetable";
        let action = {
            userId: wx.getStorageSync("userId"),
            params: {
                beginTime: date,
                endTime: date,
            }
        }
        util.postRequest(api, action).then(res => {
            console.info(res);
            console.info("date")
            console.info(date)
            let timetables=this.returnCourse(res.timetables);
            console.info(timetables)
            this.setData({timetables:timetables});
        });
    },
    /**
     * 课程数据处理
     */
    returnCourse:function (timetables) {
        let arr1=timetables;
        let arr2=[];
        let item={courseName:"",teacherName:"",startTime:"",price:"",duration:"",status:"",appointmentType:""};
        for (let i=0;i<arr1.length;i++){
            item={courseName:"",teacherName:"",startTime:"",price:"",duration:""}
            item.courseName=arr1[i].curriculum.curriculumName;
            item.teacherName=arr1[i].curriculum.teacherName;
            item.startTime=arr1[i].startTime.substring(11,16);
            item.price=arr1[i].curriculum.price;
            item.duration=arr1[i].curriculum.duration;
            item.status=arr1[i].status;
            item.appointmentType=arr1[i].appointmentType;
            item.appointmentStatus=arr1[i].appointmentStatus;
            item.timetableId=arr1[i].timetableId;
            arr2.push(item);
        }
        return arr2;
    },
    /**
     * 跳转到课程详情页面
     */
    goDetail:function (e) {
        let timetable=e.currentTarget.dataset.item
        let timetableId=timetable.timetableId;
        console.info(timetable)
        wx.navigateTo({url: "/pages/course-detail/course-detail?timetableId="+timetableId+"&appointmentStatus="+timetable.appointmentStatus});
    }
});
