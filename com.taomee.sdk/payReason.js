/**
 * Created by looper on 2017/01/12.
 */
module.exports = PayReason;

function PayReason() {

}
/**
 * 定义类变量
 * @type {number}
 */
PayReason.PAY_BEGIN = 0;
PayReason.PAY_VIP = 1; //充值vip
PayReason.PAY_BUY = 2;//购买道具
PayReason.PAY_CHARGE = 3;//充值游戏金币
PayReason.PAY_FREE = 4;//赠送(free)
PayReason.PAY_END = 5;