/**
 * Created by looper on 2016/12/15.
 */
module.exports=OpCode;


function OpCode() {

}
OpCode.OP_BEGIN = 0;
OpCode.OP_SUM = 1;    // 把某个字段某时间段内所有值相加
OpCode.OP_MAX = 2;    // 求某字段某时间段内最大值
OpCode.OP_SET = 3;    //直接取某字段最新的数值
OpCode.OP_UCOUNT = 4; //对某个字段一段时间的值做去重处理
OpCode.OP_ITEM = 5;      // 求某个大类下的各个ITEM求人数人次
OpCode.OP_ITEM_SUM = 6;  // 对各个ITEM的产出数量/售价等等求和
OpCode.OP_ITEM_MAX = 7;  // 求出各个ITEM的产出数量/售价等等的最大值
OpCode.OP_ITEM_SET = 8;  //求出每个ITEM的最新数值
OpCode.OP_SUM_DISTR = 9; // 对每个人的某字段求和，然后求出前面的“和”在各个区间下的人数
OpCode.OP_MAX_DISTR = 10;// 对每个人的某字段求最大值，然后求出前面的“最大值”在各个区间下的人数
OpCode.OP_MIN_DISTR = 11;//对每个人的某字段求最小值，然后根据前面的最小值在各个区间下做人数分布
OpCode.OP_SET_DISTR = 12;//取某个字段的最新值，做分布
OpCode.OP_IP_DISTR = 13; // 根据IP字段求地区分布的人数人次
OpCode.OP_END = 14;