/**
 * Created by looper on 2016/12/15.
 */
/**
 * StatInfo 自定义类
 * @type {StatInfo}
 */
module.exports = StatInfo;
global.OpCode = require("./opCode.js");
var statCommon = require("../com.taomee.util/statCommon.js");
/**
 * 私有变量
 * @type {number}
 */
var sc_key_maxsz = 64;
var sc_value_maxsz = 64;
var m_has_op = false;
var m_info = new Array();
var m_ops=new Array();

function StatInfo() {
    var i;
    for (i = 0; i < OpCode.OP_END; i++) {
        m_ops[i]= new Array();
    }
    this.clear();
}

/**
 * 添加info信息
 */
StatInfo.prototype.add_info=function(key, value)
{
    statCommon.stat_trim_underscore(key);
    if (typeof value == "string") {
        if (!(this.is_valid_value(value) && (m_info.length <= 30))) {
            console.log(value + "值不合法,or 数组长度超过30");
            return;
        }
    } else {
        if (!(value > 0 && m_info.length <= 30)) {
            console.log(value + "小于0,or 数组长度超过30");
            return;
        }
    }
    m_info[key] = value;
   // console.log(m_info[key])

}

StatInfo.prototype.add_op = function (op, key1, key2) {
    statCommon.stat_trim_underscore(key1);
    statCommon.stat_trim_underscore(key2);
    /**
     * hasOwnProperty 判断数组当中的key是否存在
     */
    if (!(this.is_valid_op(op) && m_info.hasOwnProperty(key1))) {
        return;
    }
    switch (op) {
        case OpCode.OP_ITEM_SUM:
        case OpCode.OP_ITEM_MAX:
        case OpCode.OP_ITEM_SET:
            if (!(m_info.hasOwnProperty(key2))) {
                return;
            }
            key1 = key1 + "," + key2;
            break;
        default:
            break;
    }
    /**
     * 不能直接赋值，需要push
     */
    m_ops[op].push(key1);

    //m_ops[op].push(key1);
   // console.log(m_ops[op])
    m_has_op=true;

}

StatInfo.prototype.clear=function () {
   // this.m_info=this.m_info.splice(0,this.m_info.length);
    m_info=new Array();
    if(m_has_op == true) {
        var i;
        for (i = OpCode.OP_BEGIN + 1; i != OpCode.OP_END; i++)
        {
           // this.m_ops[i]=this.m_ops[i].splice(0,this.m_ops[i].length);
            m_ops[i]=new Array();
        }
        m_has_op=false;
    }
}

StatInfo.prototype.serialize=function () {
    var out="";
    for(var a in m_info)
    {
        out+="\t";
        out +=(a+"="+m_info[a]);
    }

    if(m_has_op){

        var op = new Array(
            "",
                "sum:", "max:", "set:", "ucount:",
                "item:", "item_sum:", "item_max:", "item_set:",
                "sum_distr:", "max_distr:", "min_distr:",
                "set_distr:",
                "ip_distr:");
        var vline = "";

        out += "\t_op_=";


        for(var i = OpCode.OP_BEGIN;i != OpCode.OP_END;i++){

            if(m_ops[i].length != 0){
                out += vline;
                out += this.serialize_op(op[i],m_ops[i]);

                vline = "|";
            }
        }
    }

    return out;

}


StatInfo.prototype.serialize_op=function(op,keys)
{
    var vline="";
    var i=0;
    var oss="";
    for(i=0;i<keys.length;i++)
    {
        oss+=vline+op+keys[i];
        vline="|";
    }
    return oss;
}

StatInfo.prototype.is_valid_value = function (value) {
    return statCommon.size_between(value, 1, this.sc_value_maxsz) && !statCommon.key_no_invalid_chars(value);
}

/**
 * 判断是否是合法操作符Op
 * @param op
 * @returns {boolean}
 */
StatInfo.prototype.is_valid_op = function (op) {
    return (op > OpCode.OP_BEGIN && op < OpCode.OP_END);
}
