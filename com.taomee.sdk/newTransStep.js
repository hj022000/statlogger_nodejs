/**
 * Created by looper on 2017/01/15.
 */
module.exports=NewTransStep;


function NewTransStep() {

}
NewTransStep.NW_BEGIN = 0;
NewTransStep.fGetRegSucc = 1;
NewTransStep.fLoadRegSucc = 2;
NewTransStep.fSendLoginReq = 3;
NewTransStep.bGetLoginReq = 4;
NewTransStep.bSendLoginReq = 5;
NewTransStep.bGetLoginSucc = 6;
NewTransStep.fGetLoginSucc = 7;
NewTransStep.fLoadLoginSucc = 8;
NewTransStep.fClickStartBtn = 9;
NewTransStep.bGetNewroleReq = 10;
NewTransStep.bSendNewroleSucc = 11;
NewTransStep.fStartSrvlistReq = 12;
NewTransStep.bStartGetSrvlist = 13;
NewTransStep.bGetSrvlistSucc = 14;
NewTransStep.fGetSrvlistSucc = 15;
NewTransStep.fSendOnlineReq = 16;
NewTransStep.fSend1001Req = 17;
NewTransStep.bSendOnlineSucc = 18;
NewTransStep.fOnlineSucc = 19;
NewTransStep.fLoadInfoSucc = 20;
NewTransStep.fInterGameSucc = 21;
NewTransStep.NW_END = 22;