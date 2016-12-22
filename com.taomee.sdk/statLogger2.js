/**
 * Created by looper on 2016/12/8.
 * 统计NodeJs版本的statlogger的实现
 * shanghai、TAOMEE
 */
var statCommon = require("../com.taomee.util/statCommon.js");
var fs=require("fs");
//将Statlogger申明类的模块对外引用
module.exports = StatLogger2;

/**
 * statlogger的构造函数
 * @constructor
 */
var m_path;
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
var m_initEd;
function StatLogger2(game, zone, svr, site, isgame) {
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

    this.m_path = path;
    this.m_appId = game;
    this.m_siteId = site;
    this.m_zoneId = zone;
    this.m_svrId = svr;
    this.m_isGame = isgame;
    if (this.m_appid == 1 || this.m_appid == 2 || this.m_appid == 5
        || this.m_appid == 6 || this.m_appid == 10
        || this.m_appid == 16 || this.m_appid == 19) {
        this.m_need_multi = false;

    }
    this.m_basic_fd = -1;
    this.m_custom_fd = -1;
    this.m_basic_ts = 0;
    this.m_custom_ts = 0;
    this.m_hostIp = statCommon.getIPAdress();
    /*StatLogger.prototype.m_hostIp=this.m_hostIp;*/
    this.m_initEd = 1;
    setM_hostIp(this.m_hostIp);
    setM_appId(this.m_appId);
    setM_zoneId(this.m_zoneId);
    setM_svrId(this.m_svrId);
    setM_siteId(this.m_siteId);
    setM_initEd(this.m_initEd);
    setM_basic_ts(this.m_basic_ts);
    setM_path(this.m_path);

}
//m_appid、m_zoneid、m_svrid、m_siteid

setM_path = function (m_path) {
    this.m_path = m_path;
}
getM_path = function () {
    return this.m_path;
}
setM_hostIp = function (m_hostIp) {
    this.m_hostIp = m_hostIp;
}
getM_hostIp = function () {
    return this.m_hostIp;
}
setM_appId = function (m_appId) {
    this.m_appId = m_appId;
}
getM_appId = function () {
    return this.m_appId
}
setM_zoneId = function (m_zoneId) {
    this.m_zoneId = m_zoneId;
}
getM_zoneId = function () {
    return this.m_zoneId
}
setM_svrId = function (m_svrId) {
    this.m_svrId = m_svrId;
}
getM_svrId = function () {
    return this.m_svrId;
}
setM_siteId = function (m_siteId) {
    this.m_siteId = m_siteId;
}
getM_siteId = function () {
    return this.m_siteId;
}

setM_initEd = function (m_initEd) {
    this.m_initEd = m_initEd;
}
getM_initEd = function () {
    return this.m_initEd;
}

setM_basic_ts = function (m_basic_ts) {
    this.m_basic_ts = m_basic_ts;
}
getM_basic_ts = function () {
    return this.m_basic_ts;
}

StatLogger2.online_count = function (cnt, zone) {
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
    console.log(this.m_path);
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


