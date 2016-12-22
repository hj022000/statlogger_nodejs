/**
 * Created by looper on 2016/12/8.
 */
var fs = require("fs");
var path;
const os = require("os");
/**
 * 该方法只检查操作系统是windows还是linux
 */
var os_system;
exports.isWindowsOS=function () {
   // var os_system;
    if (os.EOL == "\r\n") {
        os_system = "windows";
        //path="d:/opt/taomee/stat/data";
    }
    else {
        os_system = "linux";
        //path="/opt/taomee/stat/data";
    }
    return os_system;
}


//console.log("操作系统类型:" + os_system);
