import * as util from "../../utils/util";

Page({
    data: {
        timetableId: undefined,
        appointmentStatus: undefined,
        timetable:{

        },
    },
    onLoad: function (options) {
        console.info(options)
        let timetableId = options.timetableId;
        let appointmentStatus = options.appointmentStatus;
        this.setData({timetableId:timetableId,appointmentStatus:appointmentStatus})
    },
    onShow() {
        this.getList();
    },
    /**
     * 获取课程详情
     */
    getList: function () {
        let api = "/wx/timetable/" + this.data.timetableId;
        util.getRequest(api, {}).then(res => {
            console.info(res);
            let timetable=this.returnCourse(res.timetable)
            this.setData({timetable:timetable});
        });
    },
    /**
     * 课程数据处理
     */
    returnCourse:function (timetable) {
        let item={};
            item.courseName=timetable.curriculum.curriculumName;
            item.teacherName=timetable.curriculum.teacherName;
            item.startTime=timetable.startTime.substring(0,16);
            item.price=timetable.curriculum.price;
            item.duration=timetable.curriculum.duration;
            item.description=timetable.curriculum.curriculumDescription;
            item.detail=timetable.curriculum.curriculumDetail;
            item.status=timetable.status;
            item.address=timetable.address;
            item.appointmentType=timetable.appointmentType;
            item.timetableId=timetable.timetableId;
        return item;
    },
    /**
     * 预约课程
     */
    appointment:function (e) {
        let api="/wx/appointment";
        let action={
            timetableId:this.data.timetableId,
            userId:wx.getStorageSync("userId"),
        };
        let that=this;
        wx.showModal({
            title: '提示',
            content: '你是否确定预约?',
            success (res) {
                if (res.confirm) {
                    util.postRequest(api,action).then(res=>{
                        console.info(res);
                        if(res.code==200){
                            wx.showToast({
                                title: '预约成功！',
                                icon: 'none',
                                duration: 2000
                            })
                            that.setData({appointmentStatus:1});
                        }else {
                            wx.showToast({
                                title: '预约失败！请稍后重试',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    });
                } else if (res.cancel) {

                }
            }
        })

    },
    /**
     * 取消预约课程
     */
    delAppointment:function (e) {
        let api="/wx/appointment";
        let action={
            timetableId:this.data.timetableId,
            userId:wx.getStorageSync("userId"),
        };
        let that=this;
        wx.showModal({
            title: '提示',
            content: '你是否确定取消预约？',
            success (res) {
                if (res.confirm) {
                    util.deleteRequest(api,action).then(res=>{
                        console.info(res);
                        if(res.code==200){
                            wx.showToast({
                                title: '取消预约成功！',
                                icon: 'none',
                                duration: 2000
                            })
                            that.setData({appointmentStatus:0});
                        }else {
                            wx.showToast({
                                title: '取消预约失败！请稍后重试',
                                icon: 'none',
                                duration: 2000
                            })
                        }

                    });
                } else if (res.cancel) {

                }
            }
        })


    }
});
