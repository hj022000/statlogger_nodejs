/**
 * Created by looper on 2017/01/10.
 * TAOMEE sdk公共工具类
 */
var fs = require("fs");
const os = require("os");
/**
 * 该方法只检查操作系统是windows还是linux
 */
exports.isWindowsOS = function () {
    var flag;//true表示为windows，false表示为linux；
    if (os.EOL == "\r\n") {
        flag = true;
        //path="d:/opt/taomee/stat/data";
    }
    else {
        flag = false;
        //path="/opt/taomee/stat/data";
    }
    return flag;
}

/**
 * 创建指定文件的目录
 * @param path 指定需要创建的文件目录
 * @returns {boolean}
 */
exports.stat_makeDir = function (path) {
    // var flag = false;
    // console.log(path.length);
    if (path.length == 0) {
        return false;
        //  return;
    }
    //console.log("111");
    fs.exists(path, function (exists) {
        var flag;
        if (exists) {
            console.log(path + "路径存在,不需要重新重新创建!");
            return true;
            // return flag;
        }
        else {
            fs.mkdir(path, function (err) {
                if (err) {
                    console.log("创建" + path + "目录失败!");
                    return false;
                    // return flag;
                }
                else {
                    console.log("创建" + path + "目录成功!");
                    return true;
                    // return flag;
                }
            });
        }
    });
}

/**
 * 同步去创建文件夹
 * @param path
 * @returns {boolean}
 */
exports.stat_makeDirSync = function (path) {
    if (path.length == 0) {
        return false;
        //  return;
    }
    var flag = fs.existsSync(path);
   // console.log(flag);
    if (flag == true) {
        return true;
    } else {
        // var d = 0;
        fs.mkdirSync(path, 0777);
        //console.log(d);
        return true;
    }
    //return false;
}

//获取服务器Ip地址
exports.getIPAdress  =function() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
/**
 * 去除指定字符串不要以空格或者_开头或者结尾
 * @param str
 * @returns {string}
 */
exports.stat_trim_underscore = function (str) {
    var cnt = 0;
    var cha = str.split("");
    var i = 0;
    for (i = 0; i < cha.length; i++) {
        if (cha[i] == ' ' || cha[i] == '_') {
            cnt++;
        }
        else {
            break;
        }
    }
    var pos = str.length - 1;
    while (pos > 0) {
        if (cha[pos] == ' ' || cha[pos] == '_') {
            pos = pos - 1;
        }
        else {
            break;
        }
    }
    return str.substring(cnt, pos + 1);
}

/**
 * 判断一个字符串的合法长度
 * @param str
 * @param min
 * @param max
 * @returns {boolean}
 */
exports.size_between=function (str,min,max) {
    if(typeof str=="string") {
        return (str.length >= min) && (str.length <= max);
    }
    else
    {
        console.log("参数"+str+"不为字符串，类型不合法");
        return false;
    }
}

exports.key_no_invalid_chars=function (key) {
    if( typeof key !='string')
    {
        console.log("非法参数类型");
        return true;
    }
    if(key == "" || key.length == 0){
        return true;
    }
    var i;
    for(i = 0;i<=key.length-1;i++){
        if(!(key.charAt(i) != '='
                && key.charAt(i) != ':'
                && key.charAt(i) != ','
                && key.charAt(i) != ';'
                && key.charAt(i) != '.'
                && key.charAt(i) != '|'
                && key.charAt(i) != '\t'
                && key.charAt(i) != ' '
                && key.charAt(i) != '?'
                && key.charAt(i) != '!'
            )){
            return true;
        }
    }
    return false;
}

/*
return {
    getIPAddress: getIPAddress,

};*/
