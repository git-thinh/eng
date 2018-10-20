var _NAME_UI = {
    ALL: "*",
    BOX_ENGLISH: "BOX_ENGLISH",
    SETTING: "SETTING",
    SEARCH: "SEARCH",
    LINK: "LINK",
    PLAYER: "PLAYER",
    MAIN: "MAIN",
};
var _MSG_TYPE = {
    NONE: 0,
    APP_INFO: 1,

    NOTIFICATION_REG_HANDLE: 5,
    NOTIFICATION_REMOVE_HANDLE: 6,

    URL_REQUEST: 10,
    URL_REQUEST_FAIL: 11,
    URL_REQUEST_SUCCESS: 12,

    URL_CACHE_FOR_SEARCH: 13,
    URL_GET_SOURCE_FROM_CACHE: 14,
    URL_GET_ALL_DOMAIN: 15,

    EN_TRANSLATE_GOOGLE_REQUEST: 20,
    EN_TRANSLATE_GOOGLE_RESPONSE: 21,
    EN_TRANSLATE_SAVE: 22,
    EN_TRANSLATE_REMOVE: 23,

    EN_DEFINE_WORD_REQUEST: 30,
    EN_DEFINE_WORD_RESPONSE: 31,
    EN_DEFINE_WORD_SAVE: 32,
    EN_DEFINE_WORD_REMOVE: 32
};
var _CLIENT_ID = 1;
var _CLIENT_NAME = _NAME_UI.MAIN;
var _GET_ID = function () { var date = new Date(); var id = _CLIENT_ID + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2) + (date.getMilliseconds() + Math.floor(Math.random() * 100)).toString().substring(0, 3); return parseInt(id); };
var f_log = 1 ? console.log.bind(console, '[LOG] ') : function () { };
////////////////////////////////////////////////////////////
var APP_INFO;
var _appInfo = API.f_app_getInfo();
if (_appInfo && _appInfo.length > 0) APP_INFO = JSON.parse(_appInfo);
f_log('APP_INFO = ', APP_INFO);
///////////////////////////////////////////////////////////////////////////
var f_createMsg = function (sendTo, msgType, msgRequest, msgResponse) {
    var date = new Date();
    //alert(date.getFullYear().toString().substr(2) + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2));
    //var id = _CLIENT_NAME.toLowerCase() + '-4xxx-yxxx-xxxxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); }).substring(0, 32);
    var id = _GET_ID();
    //alert(id);
    var _ok = false;
    var _request = ''; if (msgRequest) { if (typeof msgRequest == 'string') _request = msgRequest.split('"').join('¦'); else _request = JSON.stringify(msgRequest).split('"').join('¦'); }
    var _response = ''; if (msgResponse) { _ok = true; if (typeof msgResponse == 'string') _response = msgResponse.split('"').join('¦'); else _response = JSON.stringify(msgResponse).split('"').join('¦'); }
    //alert('CREATE_MSG: RESPONSE=' + _response);
    return { Ok: _ok, test: 'Tiếng việt', MsgId: id, From: _CLIENT_NAME, To: sendTo, MsgType: msgType, MsgRequest: _request, MsgResponse: _response };
}
var f_sendMsg = function (nameReceiver, msg_type, msgRequest, msgResponse) { var m = f_createMsg(nameReceiver, msg_type, msgRequest, msgResponse); API.f_app_callFromJs(JSON.stringify(m)); return m.MsgId; }
var f_sendMAIN = function (msg_type, msgRequest, msgResponse) { return f_sendMsg(_NAME_UI.MAIN, msg_type, msgRequest, msgResponse); };
var f_sendALL = function (msg_type, msgRequest, msgResponse) { return f_sendMsg(_NAME_UI.ALL, msg_type, msgRequest, msgResponse); };
var f_sendSETTING = function (msg_type, msgRequest, msgResponse) { return f_sendMsg(_NAME_UI.SETTING, msg_type, msgRequest, msgResponse); };
var f_sendPLAYER = function (msg_type, msgRequest, msgResponse) { return f_sendMsg(_NAME_UI.PLAYER, msg_type, msgRequest, msgResponse); };
///////////////////////////////////////////////////////////////////////////
var f_translate_Execute = function (oTran) { var type = _MSG_TYPE.EN_TRANSLATE_GOOGLE_REQUEST; };
function f_link_updateUrls(aLink) { f_log('jsonsUrls = ', aLink); API.f_link_updateUrls(JSON.stringify(aLink)); }
///////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function (event) {

});