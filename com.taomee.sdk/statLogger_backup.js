/**
 * Created by looper on 2016/12/8.
 * 统计NodeJs版本的statlogger的实现
 * shanghai、TAOMEE
 */
var statCommon = require("../com.taomee.util/statCommon.js");
var fs=require("fs");
//将Statlogger申明类的模块对外引用
module.exports = StatLogger;

/**
 * statlogger的构造函数
 * @constructor
 */

function StatLogger(game, zone, svr, site, isgame) {
   /* var m_path;
    var m_appId;
    var m_siteId;
    var m_zoneId;
    var m_svrId;
    var m_isGame;
    var m_need_multi = true;
    var m_basic_fd;
    var m_custom_fd;
    var m_basic_ts;
    var m_custom_ts;
    var m_hostIp;
    var m_initEd;*/

    var path = "";
    if (statCommon.isWindowsOS()) {
        path = "c:/opt/taomee/stat/data";
    }
    else {
        path = "/opt/taomee/stat/data";
    }

    if (!statCommon.stat_makeDirSync(path + "/inbox")) {
        /*console.log("gggg");*/
        return;
    }

    m_path = path;
    m_appId = game;
    m_siteId = site;
    m_zoneId = zone;
    m_svrId = svr;
    m_isGame = isgame;
    if (m_appId == 1 || m_appId == 2 || m_appId == 5
        || m_appId == 6 || m_appId == 10
        || m_appId == 16 || m_appId == 19) {
        m_need_multi = false;

    }
    m_basic_fd = -1;
    m_custom_fd = -1;
    m_basic_ts = 0;
    m_custom_ts = 0;
    m_hostIp = statCommon.getIPAdress();
    /*StatLogger.prototype.m_hostIp=this.m_hostIp;*/
    m_initEd = 1;
    /*setM_hostIp(m_hostIp);
    setM_appId(m_appId);
    setM_zoneId(m_zoneId);
    setM_svrId(m_svrId);
    setM_siteId(m_siteId);
    setM_initEd(m_initEd);
    setM_basic_ts(m_basic_ts);
    setM_path(m_path);*/

}
//m_appid、m_zoneid、m_svrid、m_siteid

setM_path = function (m_path1) {
    m_path = m_path1;
}
getM_path = function () {
    return m_path;
}
setM_hostIp = function (m_hostIp1) {
    m_hostIp = m_hostIp1;
}
getM_hostIp = function () {
    return m_hostIp;
}
setM_appId = function (m_appId1) {
    m_appId = m_appId1;
}
getM_appId = function () {
    return m_appId
}
setM_zoneId = function (m_zoneId1) {
    m_zoneId = m_zoneId1;
}
getM_zoneId = function () {
    return m_zoneId
}
setM_svrId = function (m_svrId1) {
    m_svrId = m_svrId1;
}
getM_svrId = function () {
    return m_svrId;
}
setM_siteId = function (m_siteId1) {
    m_siteId = m_siteId1;
}
getM_siteId = function () {
    return m_siteId;
}

setM_initEd = function (m_initEd1) {
    m_initEd = m_initEd1;
}
getM_initEd = function () {
    return m_initEd;
}

setM_basic_ts = function (m_basic_ts1) {
    m_basic_ts = m_basic_ts1;
}
getM_basic_ts = function () {
    return m_basic_ts;
}

StatLogger.prototype.online_count = function (cnt, zone) {
    if (cnt < 0) {
        return;
    }
    var s = statCommon.stat_trim_underscore(zone);
    if (s == "") {
        zone = "_all_";
    }
    //获取系统时间戳
    var ts = (Date.now() / 1000).toString().substring(0, 10);
    // console.log("-----:"+this.m_hostIp);
    var basic_info = set_basic_info("_olcnt_", "_olcnt_", ts, "-1", "-1");
    var online_info = basic_info + "\t_zone_=" + s + "\t_olcnt_="
        + cnt + "\t_op_=item_max:_zone_,_olcnt_\n";
    console.log(online_info);
    write_basic_log(online_info, ts);

}
/**
 * 设置统计日志公共部分
 * @param stid
 * @param sstid
 * @param ts
 * @param acct
 * @param plid
 * @returns {string}
 */
set_basic_info = function (stid, sstid, ts, acct, plid) {
    //console.log("1111"+this.m_hostIp);
    console.log("---"+this.m_appId)
    return "_hip_=" + this.m_hostIp + "\t_stid_=" + stid + "\t_sstid_="
        + sstid + "\t_gid_=" + this.m_appId + "\t_zid_="
        + this.m_zoneId + "\t_sid_=" + this.m_svrId + "\t_pid_="
        + this.m_siteId + "\t_ts_=" + ts + "\t_acid_=" + acct
        + "\t_plid_=" + plid;
}

/**
 * basic统计项的日志持久化操作
 * @param info
 * @param ts
 */
write_basic_log = function (info, ts) {
    //console.log(this.m_initEd)
    //console.log(this.m_basic_ts);
   // console.log(this.m_path);
    if (this.m_initEd == 0) {
        console.log("对象不能初始化");
        return;
    }
    var fileName;
    //console.log(ts);
    //ts=~~ts + 20;
    //console.log(ts);
    if ((ts < this.m_basic_ts) || ((ts - this.m_basic_ts) > 19) || ((this.m_basic_ts + 8 * 60 * 60) / 86400 != (ts + 8 * 60 * 60) / 86400)) {
        this.m_basic_ts = ts - (ts % 20);
        fileName = this.m_path + "/inbox/" + this.m_appId + "_game_basic_" + this.m_basic_ts;
        //console.log(fileName);
    }
    fileName = this.m_path + "/inbox/" + this.m_appId + "_game_basic_" + this.m_basic_ts;
    var options=
        {
            flag:'a'
        }
        fs.writeFileSync(fileName,info,options);
        console.log("写完成成功")
}


