/**
 * Created by looper on 2017/01/01.
 * 统计NodeJs版本的statlogger的实现
 * shanghai、TAOMEE
 */
"use strict";//严格检查js非法的一些定义，消除js语法的一些不合理、不严谨之处，减少一些怪异行为
var statCommon = require("../com.taomee.util/statCommon.js");
/**
 * 设置currencyType与payReason为全局变量
 *
 */
global.CurrencyType = require("./currencyType.js");
global.PayReason = require("./payReason.js");
global.TaskType = require("./taskType.js");
global.UnsubscribeChannel = require("./unsubscribeChannel.js");
global.NewTransStep = require("./newTransStep.js");


global.task_stid = new Array(new Array("", "", ""),
    new Array("_getnbtsk_", "_donenbtsk_", "_abrtnbtsk_"),
    new Array("_getmaintsk_", "_donemaintsk_", "_abrtmaintsk_"),
    new Array("_getauxtsk_", "_doneauxtsk_", "_abrtauxtsk_"),
    new Array("_getetctsk_", "_doneetctsk_", "_abrtetctsk_")
);

global.new_trans_stid = new Array("", "fGetRegSucc", "fLoadRegSucc", "fSendLoginReq",
    "bGetLoginReq", "bSendLoginReq", "bGetLoginSucc", "fGetLoginSucc", "fLoadLoginSucc",
    "fClickStartBtn", "bGetNewroleReq", "bSendNewroleSucc", "fStartSrvlistReq",
    "bStartGetSrvlist", "bGetSrvlistSucc", "fGetSrvlistSucc", "fSendOnlineReq",
    "fSend1001Req", "bSendOnlineSucc", "fOnlineSucc", "fLoadInfoSucc", "fInterGameSucc");

var fs = require("fs");

//将Statlogger申明类的模块对外引用
module.exports = StatLogger;

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

function StatLogger(game, zone, svr, site, isgame) {


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
    var flag_need;
    if (this.m_appId == 1 || this.m_appId == 2 || this.m_appId == 5
        || this.m_appId == 6 || this.m_appId == 10
        || this.m_appId == 16 || this.m_appId == 19) {
         flag_need=false;
    }
    else {
        flag_need=true;
    }
    this.m_need_multi=flag_need;
    this.m_basic_fd = -1;
    this.m_custom_fd = -1;
    this.m_basic_ts = 0;
    this.m_custom_ts = 0;
    this.m_hostIp = statCommon.getIPAdress();
    /*StatLogger.prototype.m_hostIp=this.m_hostIp;*/
    this.m_initEd = 1;
    //console.log(this.m_need_multi)
}

/**
 *
 * 自定义接口
 */

StatLogger.prototype.log=function(stat_name,sub_stat_name,acct_id,player_id,info)
{
    if(typeof stat_name!="string" ||
        typeof stat_name!="string" ||
        typeof acct_id!="string" ||
        typeof player_id!="string" ||
        typeof info!="object")
    {
        console.log("log()方法参数类型不匹配!");
        return;
    }
    statCommon.stat_trim_underscore(stat_name);
    statCommon.stat_trim_underscore(sub_stat_name);

    if(!(this.is_valid_common_utf8_parm(stat_name,1,256)
        && this.is_valid_common_utf8_parm(sub_stat_name,1,256)))return;

    if(acct_id.length == 0)
    {
        acct_id = "-1";
    }
    if(stat_name.length == 0)
    {
        stat_name = "unknown";
    }
    if(player_id.length == 0)
    {
        player_id = "-1";
    }

    if(sub_stat_name.length == 0)
    {
        sub_stat_name = "unknown";
    }
    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var oss = "";
    oss += this.set_basic_info(stat_name, sub_stat_name, ts, acct_id, player_id);

    oss += info.serialize();

    oss += "\n";
    this.write_custom_log(oss, ts);
}

/**
 *
 * @param step
 * @param acct_id
 */
StatLogger.prototype.new_trans = function (step, acct_id) {

    if(typeof step!="number" || typeof acct_id!="string")
    {
        console.log("new_trans()方法参数类型调用不匹配!");
        return;
    }
    if (!this.is_valid_newtransstep(step)) {
        console.log("不是合法的步骤!");
        return;
    }

    if (acct_id.length == 0) {
        acct_id = "-1";
    }

    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var oss = "";
    oss += this.set_basic_info("_newtrans_", this.get_new_trans_step(step), ts, acct_id, "-1") + "\n";

    this.write_basic_log(oss, ts);
}

StatLogger.prototype.get_new_trans_step = function (step) {
    return new_trans_stid[step];
}
StatLogger.prototype.is_valid_newtransstep = function (step) {
    return (typeof step == "number") && (step > NewTransStep.NW_BEGIN) && (step < NewTransStep.NW_END);
}

/**
 * 销户
 * @param acct_id
 * @param channel
 */
StatLogger.prototype.cancel_acct = function (acct_id, channel) {

    if(typeof acct_id!="string" || typeof channel!="string")
    {
        console.log("cancel_acct()方法参数类型不匹配!");
        return;
    }
    if (acct_id.length == 0)
        acct_id = "-1";

    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var oss = "";
    var op = "\t_op_=item:_cac_";
    oss += this.set_basic_info("_ccacct_", "_ccacct_", ts, acct_id, "-1");
    oss += ("\t_cac_=" + channel + op + "\n");
    this.write_basic_log(oss, ts);
}


/**
 *  退订vip服务
 * @param acct_id
 * @param uc
 */
StatLogger.prototype.unsubscribe = function (acct_id, uc) {
    if(typeof acct_id!="string" || typeof uc!="number")
    {
        console.log("unsubscribe()方法参数类型不匹配！");
        return;
    }
    if (acct_id.length == 0) {
        acct_id = "-1";
    }

    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var oss = "";
    var op = "\t_op_=item:_uc_";
    oss += this.set_basic_info("_unsub_", "_unsub_", ts, acct_id, "-1");
    oss += ("\t_uc_=" + uc + op + "\n");
    this.write_basic_log(oss, ts);
}

/**
 * 放弃任务TaskType type, String acct_id, String task_name, int lv
 * @param type
 * @param acct_id
 * @param task_name
 * @param lv
 */
StatLogger.prototype.abort_task = function (type, acct_id, task_name, lv) {
    if(typeof type!="number" || typeof acct_id!="string" || typeof task_name!="string" || typeof lv!="number")
    {
        console.log("abort_task() 方法参数类型不匹配!");
        return;
    }
    this.do_task(type, acct_id, task_name, lv, 2);
}


/**
 * 完成任务
 * @param type
 * @param acct_id
 * @param task_name
 * @param lv
 */
StatLogger.prototype.finish_task = function (type, acct_id, task_name, lv) {
    if(typeof type!="number" || typeof acct_id!="string" || typeof task_name!="string" || typeof lv!="number")
    {
        console.log("finish_task() 方法参数类型不匹配!");
        return;
    }
    this.do_task(type, acct_id, task_name, lv, 1);
}
/**
 *
 * @param type
 * @param acct_id
 * @param task_name
 * @param lv
 * @param step
 */
StatLogger.prototype.do_task = function (type, acct_id, task_name, lv, step) {
    statCommon.stat_trim_underscore(task_name);//TODO

    if (!(this.is_valid_tasktype(type)
        && this.is_valid_common_utf8_parm(task_name, 1, 256)))
        return;

    if (acct_id.length == 0) {
        acct_id = "-1";
    }
    if (task_name.length == 0) {
        task_name = "unknown";
    }

    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var oss = "";

    oss += this.set_basic_info(this.get_task_stid(type, step), task_name, ts, acct_id, "-1");
    if (this.is_valid_lv(lv) && lv > 0) {
        oss += ("\t_lv_=" + lv + "\t_op_=item:_lv_\n");
    } else {
        oss += "\n";
    }

    this.write_basic_log(oss, ts);
}

StatLogger.prototype.get_task_stid = function (type, stage) {
    //console.log(task_stid[type][stage]);
    return task_stid[type][stage];
}

/**
 * 验证任务类型是否合法
 * @param type
 * @returns {boolean}
 */
StatLogger.prototype.is_valid_tasktype = function (type) {
    return (typeof type == "number") && (type > TaskType.TASK_BEGIN ) && (type < TaskType.TASK_END);
}
/**
 * TaskType type, String acct_id, String task_name, int lv
 */
StatLogger.prototype.accept_task = function (type, acct_id, task_name, lv) {
    if(typeof type!="number" || typeof acct_id!="string" || typeof task_name!="string" || typeof lv!="number")
    {
        console.log("accept_task() 方法参数类型不匹配!");
        return;
    }
    //do_task就不需要
    this.do_task(type, acct_id, task_name, lv, 0);
}
/**
 *
 * @param acct_id
 * @param is_vip
 * @param reason
 * @param amt
 * @param lv
 * String acct_id, boolean is_vip, String reason,
   float amt, int lv
 */
StatLogger.prototype.use_golds = function (acct_id, is_vip, reason, amt, lv) {
    if(typeof acct_id!="string" ||
        typeof is_vip!="boolean" ||
        typeof reason!="string" ||
        typeof amt!="number" ||
        typeof lv!="number")
    {
        console.log("use_golds()方法调用参数不匹配");
        return;
    }
    statCommon.stat_trim_underscore(reason);

    if (!(amt > 0
        && amt <= 100000)
        && this.is_valid_common_utf8_parm(reason, 1, 256)
        && this.is_valid_lv(lv))
        return;

    if (acct_id.length == 0) {
        acct_id = "-1";
    }

    if (reason.length == 0) {
        reason = "unknown";
    }

    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var oss = "";
    oss += this.set_basic_info("_usegold_", "_usegold_", ts, acct_id, "-1");
    oss += ("\t_golds_=" + (this.m_need_multi ? amt * 100 : amt) + "\t_op_=sum:_golds_\n");

    oss += this.set_basic_info("_usegold_", reason, ts, acct_id, "-1");
    oss += ("\t_golds_=" + (this.m_need_multi ? amt * 100 : amt) + "\t_isvip_=" + this.convert_isvip(is_vip) + "\t_lv_=" + lv + "\t_op_=item:_isvip_|item_sum:_lv_,_golds_|sum:_golds_\n");

    this.write_basic_log(oss, ts);
}

/**
 * String acct_id, boolean isvip, int lv, int pay_amount,String outcome, int outcnt
 * @param acct_id
 * @param isvip
 * @param lv
 * @param pay_amount
 * @param outcome
 * @param outcnt
 */
StatLogger.prototype.buy_item = function (acct_id, isvip, lv, pay_amount, outcome, outcnt) {
    if(typeof acct_id!="string" ||
        typeof isvip!="boolean" ||
        typeof lv!="number" ||
        typeof pay_amount!="number" ||
        typeof outcome!="string" ||
        typeof outcnt!="number")
    {
        console.log("buy_item()方法调用参数不匹配");
        return;
    }
    if (!this.is_valid_lv(lv)
        && pay_amount > 0
        && this.is_valid_common_utf8_parm(outcome, 1, 256)
        && outcnt > 0)
        return;
    if (acct_id.length == 0) {
        acct_id = "-1";
    }
    if (outcome.length == 0) {
        outcome = "-1";
    }

    this.do_buy_item(acct_id, isvip, lv, this.m_need_multi ? pay_amount * 100 : pay_amount, "_coinsbuyitem_", outcome, outcnt);
    this.use_golds_buyitem(acct_id, isvip, this.m_need_multi ? pay_amount * 100 : pay_amount, lv);
}

/**
 *
 * String acct_id, boolean is_vip, int amt, int lv
 * @param acct_id
 * @param is_vip
 * @param amt
 * @param lv
 */
StatLogger.prototype.use_golds_buyitem = function (acct_id, is_vip, amt, lv) {
    if(typeof acct_id!="string" || typeof is_vip!="boolean" || typeof  amt!="number" || typeof lv!="number")
    {
        console.log("use_golds_buyitem()方法调用参数类型不合法!")
        return;
    }
    if (acct_id.length == 0) {
        acct_id = "-1";
    }

    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var oss = "";
    oss += this.set_basic_info("_usegold_", "_usegold_", ts, acct_id, "-1");
    oss += ("\t_golds_=" + amt + "\t_op_=sum:_golds_\n");

    oss += this.set_basic_info("_usegold_", "_buyitem_", ts, acct_id, "-1");
    oss += ("\t_golds_=" + amt + "\t_isvip_=" + this.convert_isvip(is_vip) + "\t_lv_=" + lv + "\t_op_=item:_isvip_|item_sum:_lv_,_golds_|sum:_golds_\n");

    this.write_basic_log(oss, ts);
}

/**
 * 获得金币的接口  String acct_id,int amt
 * @param acct_id
 * @param amt
 */
StatLogger.prototype.obtain_golds = function (acct_id, amt) {

    if(typeof acct_id!="string" || typeof amt!="number")
    {
        console.log("obtain_golds()方法调用参数类型不匹配!");
        return;
    }
    if (!(0 < amt && amt <= 1000000000))return;
    if (acct_id.length == 0) {
        acct_id = "-1";
    }
    console.log(this.m_need_multi);
    this.do_obtain_golds(acct_id, "_systemsend_", this.m_need_multi ? amt * 100 : amt);
}


/**
 * 等级升级统计接口  String acct_id,String race,int lv
 * @param acct_id
 * @param race
 * @param lv
 */
StatLogger.prototype.level_up = function (acct_id, race, lv) {
    if(typeof acct_id!="string" || typeof  race!="string" || typeof lv!="number")
    {
        console.log("level_up()方法调用参数类型不匹配!");
        return;
    }
    if (!this.is_valid_lv(lv))
        return;
    if (acct_id.length == 0) {
        acct_id = "-1";
    }

    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var oss = "";
    oss += this.set_basic_info("_aclvup_", "_aclvup_", ts, acct_id, "-1");
    oss += ("\t_lv_=" + lv + "\t_op_=set_distr:_lv_\n");

    if (!(race.length == 0)) {
        statCommon.stat_trim_underscore(race);
        if (!this.is_valid_race(race))
            return;
        oss += this.set_basic_info("_racelvup_", race, ts, acct_id, "-1");
        oss += ("\t_lv_=" + lv + "\t_op_=set_distr:_lv_\n");
    }

    this.write_basic_log(oss, ts);
}

/**
 * 验证密码统计  String acct_id,String cli_ip,String ads_id
 * @param acct_id
 * @param cli_ip
 * @param ads_id
 */
StatLogger.prototype.verify_passwd = function (acct_id, cli_ip, ads_id) {
    if(typeof acct_id!="string" || typeof cli_ip!="string" || typeof ads_id!="string")
    {
        console.log("verify_passwd()方法调用参数类型不匹配!");
        return;
    }
    if (acct_id.length == 0) {
        acct_id = "-1";
    }

    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var op = "\t_op_=";
    var oss = "";
    oss += this.set_basic_info("_veripass_", "_veripass_", ts, acct_id, "-1");
    oss += this.set_device_info(ads_id);

    if (cli_ip.length != 0 && this.is_valid_ip(cli_ip)) {
        oss += ("\t_cip_=" + cli_ip);
        op += ("ip_distr:_cip_|");
    }

    if (op.length > 6) {
        op = op.substring(0, op.length - 1);
        oss += (op + "\n");
    } else {
        oss += "\n";
    }

    this.write_basic_log(oss, ts);
}

StatLogger.prototype.is_valid_ip = function (ip) {
    var dip = ip.split(".");
    //console.log(dip.toString())
    if (dip.length != 4)
        return false;
    var num;
    for (num = 0; num < dip.length; num++) {
        //console.log(dip[num]);
        if (dip[num] > 255 || dip[num] < 0) {
            return false;
        }
    }
    return true;
}
/**
 * 在线统计接口  int cnt, String zone
 * @param cnt
 * @param zone
 */
StatLogger.prototype.online_count = function (cnt, zone) {
    if(typeof cnt!="number" || typeof  zone!="string")
    {
        console.log("online_count()方法调用参数不匹配!");
        return;
    }
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
    var basic_info = this.set_basic_info("_olcnt_", "_olcnt_", ts, "-1", "-1");
    //console.log("111:"+this.m_appId);
    var online_info = basic_info + "\t_zone_=" + s + "\t_olcnt_="
        + cnt + "\t_op_=item_max:_zone_,_olcnt_\n";
    // console.log(online_info);
    this.write_basic_log(online_info, ts);

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
StatLogger.prototype.set_basic_info = function (stid, sstid, ts, acct, plid) {
    //console.log("1111"+this.m_hostIp);
    //console.log("---"+this.m_appId);
    // console.log("-----:"+this.m_appId)
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
StatLogger.prototype.write_basic_log = function (info, ts) {
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
    var options =
        {
            flag: 'a',
            mode: '777'

        }
    fs.writeFileSync(fileName, info, options);
    //console.log("写完成成功")
}


StatLogger.prototype.write_custom_log = function (info, ts) {
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
        fileName = this.m_path + "/inbox/" + this.m_appId + "_game_custom_" + this.m_basic_ts;
        //console.log(fileName);
    }
    fileName = this.m_path + "/inbox/" + this.m_appId + "_game_custom_" + this.m_basic_ts;
    var options =
        {
            flag: 'a'
        }
    fs.writeFileSync(fileName, info, options);
    //console.log("写完成成功")
}
/**
 * 登录活跃接口  String acct_id, String player_id, String race,
 *               boolean isvip, Integer lv, String cli_ip,
 *               String ads_id, String zone
 * @param acct_id
 * @param player_id
 * @param race
 * @param isvip
 * @param lv
 * @param cli_ip
 * @param ads_id
 * @param zone
 */
StatLogger.prototype.login_online = function (acct_id, player_id, race, isvip, lv, cli_ip, ads_id, zone) {
    if(typeof acct_id!="string" ||
        typeof player_id!="string" ||
        typeof race!="string" ||
        typeof isvip!="boolean" ||
        typeof  lv!="number" ||
        typeof  cli_ip!="string"||
        typeof  ads_id!="string" ||
        typeof  zone!="string")
    {
        console.log("login_online()方法调用参数不匹配!");
        return;
    }
    var ts = (Date.now() / 1000).toString().substring(0, 10);
    //console.log(ts);
    var op = '\t_op_=item:_vip_|';
    if (lv > 0) {
        op = op + "item:_lv_|";
    }
    var lgac_info = this.set_basic_info("_lgac_", "_lgac_", ts, acct_id,
            player_id)
        + "\t_vip_="
        + this.convert_isvip(isvip)
        + "\t_lv_="
        + lv
        + this.set_device_info(ads_id);
    if (cli_ip.length != 0) {
        lgac_info = lgac_info + "\t_cip_=" + cli_ip;
        op = op + "ip_distr:_cip_|";
    }
    if (zone == "") {
        zone = "_all_";
    }
    lgac_info = lgac_info + "\t_zone_=" + zone;
    op = op + "item:_zone_|";
    if (op.length > 6) {
        op = op.substring(0, op.length - 1) + "\n";
        lgac_info = lgac_info + op;
        // System.out.println(op);
    } else {
        lgac_info = lgac_info + "\n";
    }
    if(player_id.length >0) {
        lgac_info = lgac_info + this.set_basic_info("_lgpl_", "_lgpl_", ts, acct_id,
                player_id) + "\n";
    }
    if(race.length >0) {
        var race2 = statCommon.stat_trim_underscore(race);
        lgac_info = lgac_info + this.set_basic_info("_lgrace_", race2, ts, acct_id,
                player_id)
            + "\t_vip_="
            + this.convert_isvip(isvip)
            + "\t_lv_="
            + lv + "\t_op_=item:_vip_|item:_lv_\n";
    }
    this.write_basic_log(lgac_info, ts);
    //console.log("写入文件成功")
}


StatLogger.prototype.set_device_info = function (ads) {
    return "\t_ad_=" + ads;
}


StatLogger.prototype.convert_isvip = function (isvip) {
    var isvip_flag = 0;
    if (isvip) {
        isvip_flag = 1;
    }
    return isvip_flag;
}

/**
 * 用户退出系统 String acct_id, boolean isvip, String lv, Integer oltime
 * @param acct_id
 * @param isvip
 * @param lv
 * @param oltime
 */
StatLogger.prototype.logout = function (acct_id, isvip, lv, oltime) {
    if(typeof acct_id!="string" || typeof isvip!="boolean" || typeof lv!="number" || typeof oltime!="number")
    {
        console.log("logout()方法调用参数不匹配!");
        return;
    }
    var ts = (Date.now() / 1000).toString().substring(0, 10);
    if(acct_id.length==0)
    {
        acct_id="-1";
    }
    var logout_info = this.set_basic_info("_logout_", "_logout_", ts,
            acct_id, "-1")
        + "\t_vip_="
        + this.convert_isvip(isvip)
        + "\t_lv_="
        + lv
        + "\t_oltm_="
        + oltime
        + "\t_intv_="
        + this.logout_time_interval(oltime)
        + "\t_op_=sum:_oltm_|item:_intv_\n";
    this.write_basic_log(logout_info, ts);
    //console.log("写退出统计文件成功!");
}

/**
 * private String logout_time_interval(Integer tm)
 */
StatLogger.prototype.logout_time_interval = function (tm) {
    if (tm <= 0) {
        return "0";
    } else if (tm < 11) {
        return "0~10";
    } else if (tm < 61) {
        return "11~60";
    } else if (tm < 301) {
        return "61~300";
    } else if (tm < 601) {
        return "301~600";
    } else if (tm < 1201) {
        return "601~1200";
    } else if (tm < 1801) {
        return "1201~1800";
    } else if (tm < 2401) {
        return "1801~2400";
    } else if (tm < 3001) {
        return "2401~3000";
    } else if (tm < 3601) {
        return "3001~3600";
    } else if (tm < 7201) {
        return "3601~7200";
    } else {
        return "大于7200";
    }
}

/**
 * 注册角色统计 String acct_id, String player_id, String race,String cli_ip, String ads_id
 * @param acct_id
 * @param player_id
 * @param race
 * @param cli_ip
 * @param ads_id
 */
StatLogger.prototype.reg_role = function (acct_id, player_id, race, cli_ip, ads_id) {
    if(typeof acct_id!="string" ||
        typeof  player_id!="string" ||
        typeof  race!="string" ||
        typeof cli_ip!="string" ||
        typeof  ads_id!="string")
    {
        console.log("reg_role()方法调用参数不匹配!");
        return;
    }
    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var op = "\t_op_=";
    var clip = null;
    var basic_info = this.set_basic_info("_newac_", "_newac_", ts, acct_id,
        player_id);

    var device_info=null;
    if(ads_id.length !=0) {
        device_info = this.set_device_info(ads_id);
    }
    var newac_info = "";
    if (cli_ip.length != 0) {
        clip = "\t_cip_=" + cli_ip;
        op = op + "ip_distr:_cip_|";
    }
    if (op.length > 6) {
        op = op.substring(0, op.length - 1) + "\n";
        newac_info = basic_info + device_info + clip + op;
        // System.out.println(op);
    } else {
        newac_info = basic_info + device_info + cli_ip + "\n";
    }
    if (player_id.length != 0) {
        newac_info = newac_info + this.set_basic_info("_newpl_", "_newpl_", ts, acct_id,
                player_id) + "\n"
    }
    if (race.length != 0) {
        var race2 = statCommon.stat_trim_underscore(race);
        newac_info = newac_info + this.set_basic_info("_newrace_", race2, ts, acct_id,
                player_id) + "\n";
    }
    this.write_basic_log(newac_info, ts);


}

/**
 * 付费统计接口 String acct_id, boolean isvip, int pay_amount,
                CurrencyType currency, PayReason pay_reason, String outcome,
                int outcnt, String pay_channel
 * @param acct_id
 * @param isvip
 * @param pay_amount
 * @param currency
 * @param pay_reason
 * @param outcome
 * @param outcnt
 * @param pay_channel
 */
StatLogger.prototype.pay = function (acct_id, isvip, pay_amount, currency, pay_reason, outcome, outcnt, pay_channel) {
    if(typeof acct_id!="string" ||
        typeof  isvip!="boolean" ||
        typeof pay_amount!="number" ||
        typeof  currency!="number" ||
        typeof pay_reason!="number" ||
        typeof  outcome!="string" ||
        typeof  outcnt!="number" ||
        typeof  pay_channel!="string"
    )
    {
        console.log("pay()方法调用参数不匹配!");
        return;
    }
    if (!(typeof pay_amount == "number"
        && pay_amount > 0
        && this.is_valid_currency(currency)
        && this.is_valid_payreason(pay_reason)
        && outcnt > 0
        && (outcome.length > 0 || pay_reason != PayReason.PAY_BUY)
        && this.is_valid_common_utf8_parm(outcome, 0, 256)
        && this.is_valid_common_utf8_parm(pay_channel, 1, 256))) {
        return;
    }
    //console.log("1111");
    if (acct_id == "") {
        acct_id == "-1";
    }
    var reason;
    switch (pay_reason) {
        case PayReason.PAY_CHARGE:
            reason = "_buycoins_";
            break;
        case PayReason.PAY_VIP:
            reason = "_vipmonth_";
            break;
        case PayReason.PAY_BUY:
            reason = "_buyitem_";
            break;
        case PayReason.PAY_FREE:
            reason = "_costfree_";
            break;
        default:
            reason = "";
            break;
    }
    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var op = "\t_op_=sum:_amt_|item_sum:_vip_,_amt_|item_sum:_paychannel_,_amt_|item_sum:_ccy_,_amt_|item:_paychannel_";
    var oss = "";
    if (pay_reason != PayReason.PAY_FREE) {
        oss += this.set_basic_info("_acpay_", "_acpay_", ts, acct_id, "-1")
            + "\t_vip_="
            + this.convert_isvip(isvip)
            + "\t_amt_="
            + pay_amount
            + "\t_ccy_="
            + currency
            + "\t_paychannel_="
            + pay_channel
            + op
            + "\n";
    }
    oss += this.set_basic_info("_acpay_", reason, ts, acct_id, "-1")
        + "\t_vip_="
        + this.convert_isvip(isvip)
        + "\t_amt_="
        + pay_amount
        + "\t_ccy_="
        + currency
        + "\t_paychannel_="
        + pay_channel
        + op
        + "\n";

    this.write_basic_log(oss, ts);
    switch (pay_reason) {
        case PayReason.PAY_CHARGE:
            this.do_obtain_golds(acct_id, "_userbuy_", outcnt);
            break;
        case PayReason.PAY_VIP:
            this.do_buy_vip(acct_id, pay_amount, outcnt);
            break;
        case PayReason.PAY_BUY:
            this.do_buy_item(acct_id, isvip, 0, pay_amount, "_mibiitem_", outcome, outcnt);
            break;
        default:
            break;
    }
}

/**
 * String acct_id, boolean isvip, int lv,int pay_amount, String pay_type, String outcome, int outcnt
 * @param acct_id
 * @param isvip
 * @param lv
 * @param pay_amount
 * @param pay_type
 * @param outcome
 * @param outcnt
 */

StatLogger.prototype.do_buy_item = function (acct_id, isvip, lv, pay_amount, pay_type, outcome, outcnt) {
    if(typeof acct_id!="string" ||
        typeof isvip!="boolean" ||
        typeof lv!="number" ||
        typeof pay_amount!="number" ||
        typeof pay_type!="string" ||
        typeof outcome !="string" ||
        typeof outcnt !="number"
    )
    {
        console.log("do_buy_item()方法调用参数不匹配!");
        return;
    }
    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var oss = "";
    oss += this.set_basic_info("_buyitem_", pay_type, ts, acct_id, "-1");
    var op = "\t_op_=sum:_golds_";
    if (this.is_valid_lv(lv) && lv != 0) {
        op += "|item:_lv_";
    }
    oss += ("\t_isvip_=" + this.convert_isvip(isvip) + "\t_item_=" + outcome + "\t_itmcnt_=" + outcnt + "\t_golds_=" + pay_amount + "\t_lv_=" + lv + op + "\n");
    this.write_basic_log(oss, ts);
}

/**
 *
 * @param lv
 * @returns {boolean}
 */
StatLogger.prototype.is_valid_lv = function (lv) {
    return lv >= 0 && lv <= 5000;
}


/**
 * String acct_id, int pay_amount, int amt
 * @param acct_id
 * @param pay_amount
 * @param amt
 */
StatLogger.prototype.do_buy_vip = function (acct_id, pay_amount, amt) {
    if(typeof acct_id!="string" ||
       typeof pay_amount!="number" ||
       typeof amt !="number"
    )
    {
        console.log("do_buy_vip()方法调用参数不匹配!");
        return;
    }
    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var oss="";
    oss += this.set_basic_info("_buyvip_", "_buyvip_", ts, acct_id, "-1")
        + "\t_payamt_="
        + pay_amount
        + "\t_amt_="
        + amt
        + "\t_op_=item:_amt_|item_sum:_amt_,_payamt_\n";
    this.write_basic_log(oss, ts);
}

/**
 * String acct_id, String reason, int amt
 * @param acct_id
 * @param reason
 * @param amt
 */
StatLogger.prototype.do_obtain_golds = function (acct_id, reason, amt) {
    if(typeof acct_id!="string" || typeof  reason!="string" || typeof amt!="number")
    {
        console.log("do_obtain_golds()方法调用参数不匹配!");
        return;
    }
    var ts = (Date.now() / 1000).toString().substring(0, 10);
    var oss="";
    oss += this.set_basic_info("_getgold_", reason, ts, acct_id, "-1")
        + "\t_golds_="
        + amt
        + "\t_op_=sum:_golds_\n";
    this.write_basic_log(oss, ts);
}


/**
 * 判断currency是否合法
 * @param ccy
 * @returns {boolean}
 */
StatLogger.prototype.is_valid_currency = function (ccy) {
    return (typeof ccy == "number") && (ccy > CurrencyType.CCY_BEGIN ) && (ccy < CurrencyType.CCY_END);
}

/**
 * 判断payReason是否合法
 * @param r
 * @returns {boolean}
 */
StatLogger.prototype.is_valid_payreason = function (r) {
    return (typeof r == "number") && (r > PayReason.PAY_BEGIN) && (r < PayReason.PAY_END);
}


/**
 * 判断值合法
 * @param parm
 * @param min
 * @param max
 * @returns {boolean}
 */
StatLogger.prototype.is_valid_race = function (race) {
    return (statCommon.size_between(race, 1, 256)) && (!statCommon.key_no_invalid_chars(race));
}

StatLogger.prototype.is_valid_common_utf8_parm = function (parm, min, max) {
    return (statCommon.size_between(parm, min, max)) && (!statCommon.key_no_invalid_chars(parm));
}
