/**
 * Created by looper on 2016/12/15.
 */

/*var m_ops=new Array();
 //console.log(typeof  m_ops)
 for(var i=0;i<10;i++)
 {
 m_ops[i]=new Array();
 m_ops[i]["k"+i]="hadoop";
 m_ops[i]["j"+i]="hadoop2";

 }
 console.log(m_ops.length);
 console.log(m_ops)
 var i,j;

 for(i=0;i<m_ops.length;i++)
 {
 console.log(m_ops[i].length)
 }
 //console.log(m_ops[1].length)

 /!*
 var i,j;
 for(i=0;i<m_ops.length;i++)
 {
 /!*console.log("----");
 console.log(i);*!/
 // console.log(typeof m_ops[i]);
 /!*console.log(m_ops[i])
 var d=m_ops[i];
 //console.log(d.length)
 console.log(d)*!/
 //console.log(m_ops[i].length);
 console.log(m_ops[i].hasOwnProperty("k1"));
 }*!/
 /!*for(var a in m_ops)
 {
 console.log(m_ops.length)
 /!*for (var b in m_ops[a])
 {
 console.log(m_ops[a][]);
 }*!/
 }*!/*/
//var d={1:2,2:3,1:4};
//d.push("9:8")
/*set("1:2");
console.log(d);
console.log(typeof d)*/
/*var a=[];
a['k1']="v1";
a['k2']="v2";
a['k3']="v3";
a['k4']="v4";
var f=Object.keys().;
for(var d in f)
{
    console.log(d)
}*/
/*for (var d in a)
{
    console.log(d.valueOf())
}*/

var m_ops=new Array();
//console.log(typeof  m_ops)
for(var i=0;i<10;i++)
{
    m_ops[i]=new Array();
    m_ops[i]["k"+i]="hadoop";
    if(i==2)
    {
        m_ops[i]["k"+(i+1)]="hadoop";
    }
   // m_ops[i]["k"+i]="hadoop2";

}
//console.log(m_ops.length);
//console.log(m_ops)
var str="";
var vline="";
/*console.log(m_ops.length)
for(var i=0;i<m_ops.length;i++)
{
    console.log(m_ops[i]);
    for(var j=0;j<m_ops[i].length;j++)
    {

    }
}*/

for(var a in m_ops)
{
    //console.log(a,m_ops[a]);
    /*for(var b in m_ops[a])
    {
        /!*if(a==0)
        {
            str +=(b+"="+m_ops[a][b]);
        }else
        {
            str+="\t";
            str +=(b+"="+m_ops[a][b]);
        }*!/


       // vline="\t";
    }*/
    //console.log(a.length)
    console.log(m_ops[a]);
   // console.log(str);
}
console.log(str);
