var BU = new function() {
	this.bindData = function(html, object) {
		if(!(object instanceof Object) && !(object instanceof Array)) {
			return html.replace("#{item}", object);
		}
		var div = document.createElement("div");
		div.innerHTML = html;
		var binds = div.querySelectorAll("[bind-data]");
		var map = {};
		for(var i = 0; i < binds.length; i++) {
			map[binds[i].getAttribute("bind-data")] = binds[i].innerHTML;
		}
		if(!object) {
			return "";
		}
		if(!(object instanceof Array)) {
			object = [object];
		}
		if(object.length == 0) {
			return "";
		}
		html = this.replaceAll(html, "#{src}", "src");
		var result = "";
		for(var i in object) {
			var temp = html;
			var one = object[i];
			if(!(one instanceof Object) && !(one instanceof Array)) {
				temp = temp.replace("#{item}", dealSpecialChar(one));
			} else
				for(var p in one) {
					if(one[p] && (one[p] instanceof Array)) {
						if(map[p]) {
							temp = temp.replace(map[p], this.bindData(map[p], one[p]));
						} else {
							for(var j in one[p]) {
								var o = one[p][j];
								if(o instanceof Object) {
									for(var q in o) {
										temp = temp.replace("#{" + q + "_" + j + "}", dealSpecialChar(o[q]));
									}
								} else {
									temp = temp.replace("#{item_" + j + "}", dealSpecialChar(o));
								}
							}
						}
					} else {
						temp = this.replaceAll(temp, "#{" + p + "}", dealSpecialChar(one[p]));
					}
				}
			result += temp;
		}
		return result;
	}

	this.replaceAll = function(string, old, replaceWith, ignoreCase) {
		if(!RegExp.prototype.isPrototypeOf(old)) {
			return string.replace(new RegExp(old, (ignoreCase ? "gi" : "g")), replaceWith);
		} else {
			return string.replace(old, replaceWith);
		}
	}

	this.bindScroll = function(param) {
		var loading = false;
		window.onscroll = function() {
			if(loading) {
				return;
			};
			if(document.body.scrollTop == 0) {
				if(param.top) {
					loading = true;
					param.top(function() {
						setTimeout(function() {
							loading = false;
						}, 150);
					});
				}
			} else if(document.documentElement.clientHeight + document.body.scrollTop == document.body.scrollHeight) {
				if(param.bottom) {
					loading = true;
					param.bottom(function() {
						setTimeout(function() {
							loading = false;
						}, 150);
					});
				}
			}
		}
	}

	function dealSpecialChar(str) {
		if(str == null || Object.prototype.toString.call(str) != "[object String]") {
			return str;
		}
		str = str.replace(/[<>&"]/g, function(c) {
			return {
				'<': '&lt;',
				'>': '&gt;',
				'&': '&amp;',
				'"': '&quot;'
			}[c];
		});
		return str;
	}

	this.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		return r && unescape(r[2]);
	}

	this.getAbsPath = function(path) {
		return window.location.protocol + "//" + window.location.host + "/" +
			(window.location.pathname.split("/")[1] || "") + "/" + path;
	}

	this.post = function(url, param, callback, err) {
		this.ajax("POST", url, param, function(flag, text) {
			if(flag) {
				text = JSON.parse(text);
				if(text.status != 1) {
					err(text.errCode, text.errMessage);
				} else {
					callback(text.body);
				}
			} else {
				err("net-error", "网络开小差");
			}
		});
	}

	this.alert=function(msg){
		alert(msg);
	}

	this.get = function(url, param, callback, err, syn) {
		this.ajax("GET", url, param, function(flag, text) {
			if(flag) {
				text = JSON.parse(text);
				if(text.status != 1) {
					err(text.errCode, text.errMessage);
				} else {
					callback(text.body);
				}
			} else {
				err("net-error", "网络开小差");
			}
		}, syn);
	}

	this.ajax = function(type, url, param, callback, syn) {
		var request = window.ActiveXObject ? new ActiveXObject("MSXML2.XMLHTTP") :
			new XMLHttpRequest();
		var p = "";
		if(param) {
			for(var i in param) {
				p += i + "=" + param[i] + "&";
			}
			if(p != "") {
				p = p.substring(0, p.length - 1);
			}
		}
		if(type == "GET" && p) {
			if(url.indexOf("?") != -1) {
				url = url + "&" + p;
			} else {
				url = url + "?" + p;
			}
		}
		request.open(type, url, !syn);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
		request.onreadystatechange = function() {
			if(request.readyState == 4) {
				if(request.status == 200) {
					callback(true, request.responseText);
				} else {
					callback(false, request.responseText);
				}
			}
		};
		request.send(type == "GET" ? null : p);
	}

	this.fileserver="http://berchina.jios.org:18105/fileServer/files/"; var fileserver="http://berchina.jios.org:18105/fileServer/files/";
	this.getFile=function(url){
		return this.fileserver+url;
	};
	this.parseTime = function(time, format_date, format_time) {
		format_date = format_date || "yyyy年MM月dd日";
		format_time = format_time || "HH:mm:ss";
		var date = new Date(time);
		var y = date.getFullYear();
		var m = date.getMonth();
		var d = date.getDate();
		var now = new Date();
		if(y == now.getFullYear() && m == now.getMonth() && d == now.getDate()) {
			return "今天 " + this.dateFormat(date, format_time);
		}
		now.setDate(now.getDate() - 1);
		if(y == now.getFullYear() && m == now.getMonth() && d == now.getDate()) {
			return "昨天 " + this.dateFormat(date, format_time);
		}
		now.setDate(now.getDate() - 1);
		if(y == now.getFullYear() && m == now.getMonth() && d == now.getDate()) {
			return "前天 " + this.dateFormat(date, format_time);
		}
		return this.dateFormat(date, format_date)
	};

	this.dateFormat = function(date, format) {
		format = format.replace("yyyy", date.getFullYear());
		format = format.replace("MM", date.getMonth() + 1 > 9 ? date.getMonth() + 1 : ("0" + (date.getMonth() + 1)));
		format = format.replace("dd", date.getDate() > 9 ? date.getDate() : ("0" + date.getDate()));
		format = format.replace("HH", date.getHours() > 9 ? date.getHours() : ("0" + date.getHours()));
		format = format.replace("mm", date.getMinutes() > 9 ? date.getMinutes() : ("0" + date.getMinutes()));
		format = format.replace("ss", date.getSeconds() > 9 ? date.getSeconds() : ("0" + date.getSeconds()));
		return format;
	};
	this.alert=function(msg){
		alert(msg);
	};
	this.getCookie=function(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
		else
		return null;
	};
}

window.bu = function(selector) {
	var $ = {};
	var dom = document.querySelector(selector);
	if(!dom) {
		return null;
	}
	$.on = function(evtType, selector, callback) {
		if(evtType == "tap" && !("ontouchend" in document)) {
			evtType = "click";
		}
		dom.addEventListener(evtType, function(evt) {
			var evt = evt || window.event;
			var target = evt.target || evt.srcElement;
			while(target != null) {
				if(target.classList && target.classList.contains(selector)) { //Todo 目前选择器只能是一个单class
					callback.call(target);
					return;
				} else {
					target = target.parentNode;
				}
			}

		});
		return this;
	}
	$.touchEffect = function(selector, callback) {
		this.on("touchstart", selector, function() {
			callback.call(this, true);
		});
		this.on("touchcancel", selector, function() {
			callback.call(this, false);
		});
		this.on("touchmove", selector, function() {
			callback.call(this, false);
		});
		this.on("touchend", selector, function() {
			callback.call(this, false);
		});
		return this;
	}
	return $;
}

setTimeout(bindWindowEvt);

function bindWindowEvt() {
	var touchElement;
	var touchTime;
	var touchGap = 300; //间隔300ms
	var tx = 0,
		ty = 0;
	window.addEventListener("touchstart", function() {
		var evt = evt || window.event;
		touchElement = evt.target || evt.srcElement;
		touchTime = new Date().getTime();
	}, true);
	window.addEventListener("touchmove", function() {
		touchElement = null;
	}, true);
	window.addEventListener("touchcancel", function() {
		touchElement = null;
	}, true);
	window.addEventListener("touchend", function() {
		var evt = evt || window.event;
		if(touchElement == (evt.target || evt.srcElement) && new Date().getTime() < touchTime + touchGap) {
			evt = document.createEvent('Event');
			evt.initEvent("tap", true, true);
			touchElement.dispatchEvent(evt);
		}
	}, true);
}

var BUSER = new function() {
	/**
	 * 检查登录，
	 * onsuccess登录成功回调 可为空，如果空则返回true
	 * onfailure登录失败回调 可为空，如果为空则返回fasle 如果为'default'，则未登录自动跳转登录页
	 * 
	 */
	this.checkLogin=function(onsuccess,onfailure){
		if(BU.getCookie("_ump_session")){
			if (onsuccess){
				onsuccess();
			}else{
				return true;
			}
		}else{
			if (onfailure){
				if('default'==onfailure){
					
					alert("请登录");
					this.goLogin();
				}else{
					onfailure();
				}
			}else{
				return false;
			}
		}
	}
	
	this.goLogin=function(){
		if (!sessionStorage.umpLoginUrl){
			BU.post(BU.getAbsPath("/public/getLoginUrl"),{},function(data){
				sessionStorage.umpLoginUrl=data.loginUrl;
				window.location.href=sessionStorage.umpLoginUrl;
			});
		}else{
			window.location.href=sessionStorage.umpLoginUrl;
			}
	}
}