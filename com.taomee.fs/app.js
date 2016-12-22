/**
 * Created by looper on 2016/12/8.
 */
/*
 var t1=require("../com.taomee.util/statCommon.js");
 //var t2=t1.isWindowsOS();
 //var f2=t1.stat_makeDir("c:/opt/taomee/stat/data/inbox3");
 //console.log(f2);
 //console.log(t2);
 if(t1.stat_makeDir("c:/opt/taomee/stat/data/inbox7")==false)
 {
 console.log(false);
 }
 else
 {
 console.log(true);
 }*/
//var os = require('os');

/*
var os = require('os');
var IPv4,hostName;
*/
/*console.log(os.networkInterfaces());*/
//console.log(d.toString());
//hostName=os.hostname();
/*
for(var i=0;i<os.networkInterfaces()."VMware Network Adapter VMnet8".length;i++){
    if(os.networkInterfaces().eth0[i].family=='IPv4'){
        IPv4=os.networkInterfaces().eth0[i].address;
    }
}
console.log('----------local IP: '+IPv4);
console.log('----------local host: '+hostName);*/

exports.getIPAdress=function(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}
