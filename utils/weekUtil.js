function getDates(days,todate) {//todate默认参数是当前日期，可以传入对应时间
    let dateArry = [];
    let date=new Date(todate);
    let select=date.getDay();
    if(select==0){
        select=6;
    }else {
        select=select-1
    }
    date.setDate((date.getDate()-select))
    for (var i = 0; i < days; i++) {
        var dateObj = dateLater(date, i);
        dateArry.push(dateObj)
    }
    return dateArry;
}


/**
 * 传入时间后几天
 * param：传入时间：dates:"2019-04-12",later:往后多少天
 */
function dateLater(dates, later) {
    let dateObj = {};
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    date.setDate(date.getDate() + later);
    let year = date.getFullYear();
    let day = date.getDay();
    let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth()+1);
    let date2 = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.fullDate=year+"-"+month+"-"+date2;
    dateObj.date=month+"."+date2;
    dateObj.week = show_day[day];
    return dateObj;
}
module.exports = {
    getDates: getDates
}
