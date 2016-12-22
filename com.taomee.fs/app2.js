/**
 * Created by looper on 2016/12/8.
 */
var statlogger = require("../com.taomee.sdk/statLogger.js");
var statInfo=require("../com.taomee.sdk/statInfo.js");
//var OpCode=require("../com.taomee.sdk/opCode.js");
//var statlogger2 = require("../com.taomee.sdk/statLogger2.js");
//var statlogger2=statlogger;
var d = new statlogger(18, -1, -1, -1, 1);
//

/*var d2 = new statlogger(12, -1, -1, -1, 1);*/
//d.online_count(10,"3服");
/**
 * 落在线统计
 */
/*statlogger.online_count(10,"3服");
statlogger2.online_count(11,"4服");*/
/*d.online_count(10,"3服务器");
d2.online_count(12,"4服务器");*/
/**
 * 登录统计接口
 */
//d.login_online('331025680',"","吉祥如意",true,1,'192.168.11.120','4399',"");

/**
 * 登录退出接口
 */
//d.logout("331025680",true,0,300);
//d.logout("",true,10,300);

/**
 *注册角色接口
 */
 //d.reg_role('331025680',"","",'192.168.11.120','4399');

/**
 * 付费统计接口
 */
//d.pay("331025", true, 1000,CurrencyType.CCY_CNY, PayReason.PAY_BUY, "兑换游戏CM点", 100, "0");

/**
 * 验证密码统计接口
 */
d.verify_passwd("47159775", "106.132.12.11", "innermedia.taomee.seer.topbar");

/**
 * 账户升级时调用
 */
//d.level_up("47159775","jsks",20);

/**
 *
 */
d.obtain_golds("47159876", 10);

/**
 *
 */
//d.buy_item("34159876", true, 13, 20, "元旦礼包", 10);

/**
 *
 */
//d.use_golds("47169879", true, "_开启新功能_", 18, 17);
//var dd=true;
//console.log(typeof dd);
/**
 *  接受任务
 */
d.accept_task(TaskType.TASK_NEWBIE, "3781654", "打开背包", 10);
//d.accept_task(TaskType.TASK_STORY, "3781654", "打开背包", 10)
//d.finish_task(TaskType.TASK_NEWBIE, "3781654", "打开背包", 18);

//d.abort_task(TaskType.TASK_NEWBIE, "3781654", "打开背包", 19);

/**
 *
 */
//console.log(typeof UnsubscribeChannel.UC_MIBI)
//d.unsubscribe("33102568",UnsubscribeChannel.UC_MIBI);
//d.unsubscribe("331025682",UnsubscribeChannel.UC_DUANXIN);


/**
 *
 */
//d.cancel_acct("342352345", "weixin");

/**
 * 新注册转换接口
 */
//console.log(typeof NewTransStep.bGetLoginReq);
d.new_trans(NewTransStep.bGetLoginReq,"342352345");
//d.new_trans(NewTransStep.bGetLoginSucc,"22222");

/*var info = new statInfo();
//console.log(typeof info)
//StatLogger logger = new StatLogger(2,-1,-1,-1,-1);

info.add_info("k1", 10);
info.add_op(OpCode.OP_SUM, "k1","");
info.add_info("k2", 100);
info.add_op(OpCode.OP_SUM, "k2","");
d.log("经济系统", "钻石消耗途径", "8344342333", 1, info);*/
/*
var info2 = new statInfo();
info2.add_info("k1", 101);
info2.add_op(OpCode.OP_SUM, "k1","");
info2.add_info("k2", 1001);
info2.add_op(OpCode.OP_SUM, "k2","");
*/
/*d.log("经济系统1", "钻石消耗途径2", "8344342333", "", info2);*/

