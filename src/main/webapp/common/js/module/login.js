var needVerify="";
function isNeedVerify(){
	var resultJson = ajaxRequest("login/needVerify", null, null, null);
	if (resultJson != null) {
		var data = resultJson.response.data;
		if (data && data.needVerify) {
			var time = new Date().getTime();
			needVerify = 'n';
			$("#verify").attr("src", "login/getVerify?" + time);
			$("#needVerify").show();
		}
	}
}

isNeedVerify();
function login() {
	$("#loginForm").submit();
	return false;
}

function changeVerify() {
	var time = new Date().getTime();
	$("#verify").attr("src", "login/getVerify?" + time);
}

//错误类型
var errorType="";
var href = location.href;
if (href.indexOf("error=oxff45") >= 0) {
	var resultJson = ajaxRequest("login/findLoginError", null, null, null);
	if (resultJson != null) {
		$("#error-msg").html(resultJson.response.desc);
		var data = resultJson.response.data;
		errorType = data.type;
	}
}

//第二个参数:清除什么类型的错误提示 u, 用户密码账号提示  v 验证码          第三个参数,e 代表回车后提交,p代表密码框获得焦点,v代表如果需要验证码就验证码框获得焦点,如果不需要验证码,就提交
function inputOperate(event,cleanType,focusType) {
	
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if (e && e.keyCode == 13) {
		if(focusType && focusType=='p'){
			$("#p").focus();
		}else if(focusType && focusType=='v'){
			//如果需要验证码
			if(needVerify=='n'){
				$("#verifyCode").focus();
			}else{
				login();
			}
		}else{
			login();
		}
	}else{
		//不是回车动作
		if(cleanType && 'u'== cleanType && errorType=='u'){
			$("#error-msg").html("");
		}
		if(cleanType && 'v'== cleanType && errorType=='v'){
			$("#error-msg").html("");
		}
	}
	
}


function keyDown(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if (e && e.keyCode == 13) {
		login();
	}
}


