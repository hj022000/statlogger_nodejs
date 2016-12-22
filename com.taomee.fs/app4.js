/**
 * Created by looper on 2016/12/12.
 */
//var iconv = require('iconv-lite');
var abc=123;
var hd="中国";
//console.log(typeof abc);
console.log(typeof abc=="number");
console.log(abc.toString().length);
var d=(abc.toString().charAt(0)!=1);
console.log(hd.charCodeAt(0))
var a1=new Array(1,2,3);
console.log(a1.toString())
console.log(a1.length);

/*var array=new Array(1,2,3);
console.log(array.reverse());*/

var array1=new Array();
array1[0]="10";
array1[1]=100;
console.log(array1);

/**
 * 改变数组的下标索引,同时判断下标索引的是否存在hasOwnProperty
 * @type {Array}
 */
var array2=new Array();
array2["k1"]="10";
array2["k2"]=100;
console.log(array2);
//array2.clearData();

array2=array2.splice(0,array2.length);
console.log(array2);
array2[0]=1;
array2[1]=3;
console.log(array2);

//console.log(array2.hasOwnProperty("k3"));


