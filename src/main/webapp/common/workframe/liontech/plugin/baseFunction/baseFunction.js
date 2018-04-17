/**
 * 创建于:2014-5-18<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * LT基础功能
 * @author chender
 * @version 1.0.0
 */
LT.Checker = new function() {
   /* if(top.LT==LT&&location.href.indexOf("liontech/surface/desktop.action")<0&&location.href.indexOf("liontech/login/login.jsp")<0&&!window.IAMSPECIAL){
    	location.href=LT.getBasePath()+"/systemPage/notAllowOpen.jsp";
    }   */
	this.date = function(date) {
		if (!date) {
			return null;
		}
		var a = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/ig;
		if (date.length != 10 || !a.test(date)) {
			return "日期输入不合法";
		} else {
			return null;
		}
	};

	/**
	 * 
	 */
	this.int = function(number) {
		var a = /^-?\d+$/;
		if (!a.test(number)) {
			return "请输入整数";
		} else {
			if (parseInt(number > 2147483648)) {
				return "输入的整数值过大,最大为:2147483648";
			}
			return null;
		}
	};

	this.number = function(type, number) {
		if (type == "int") {
			return this.int(number);
		} else if (type == "long") {
			return this.long(number);
		} else if (type == "float" || type == "double") {
			return this.double(number);
		}
		return this.int(number);
	};
	/**
	 * 
	 */
	this.long = function(number) {
		var a = /^-?\d+$/;
		if (!a.test(number)) {
			return "请输入整数";
		} else {
			return null;
		}
	};
	this.double = function(number) {
		var a = /^(-?\d+)(\.\d+)?$/;
		if (!a.test(number)) {
			return "请输入合法的数值,格式为xxx.xxx";
		} else {
			return null;
		}
	};
	this.string = function(string) {

		return null;
	};

	this.identify = function(identify) {

		return null;
	};
	
	 this.isNull=function(str) {
		var trimStr = $.trim(str);
		if (trimStr.length == 0) {
			return true;
		} else {
			for ( var i = 0; i < trimStr.length; i++) {
				if (trimStr.charAt(i) != " ")
					return false;
			}
			return true;
		}
	}

	/**
	 * 判断该字符串是否为英文字符
	 * 
	 * @param str
	 * @returns {Boolean}
	 */
	 this.isCharacter=function(str) {
		if (this.isNull(str)) {
			return false;
		} else {
			for ( var i = 0; i < str.length; i++) {
				var u = str.charCodeAt(i);
				if ((u > 0) && (u < 128))
					continue;
				else
					return false;
			}
		}
		return true;
	}

	/**
	 * 判断该字符是否为字母
	 * 
	 * @param str
	 * @returns {Boolean}
	 */
	 this.isAlpha=function(str) {
		if (this.isNull(str)) {
			return false;
		} else {
			for ( var i = 0; i < str.length; i++) {
				var mychar = str.charAt(i);
				if ((mychar < 'a' || mychar > 'z')
						&& (mychar < 'A' || mychar > 'Z'))
					return false;
			}
		}
		return true;
	}

	/**
	 * 判断该字符串是否为数字
	 * 
	 * @param str
	 * @returns {Boolean}
	 */
	this.isDigits=function(str) {
		if (this.isNull(str)) {
			return false;
		} else {
			for ( var i = 0; i < str.length; i++) {
				var mychar = str.charAt(i);
				if (mychar < "0" || mychar > "9")
					return false;
			}
		}
		return true;
	}

	/**
	 * 判断是否为中文
	 * 
	 * @param str
	 * @returns {Boolean}
	 */
	this.isChinese=function(str) {
		if (this.isNull(str)) {
			return false;
		}
		var regex = /[\u4e00-\u9fa5]/;
		for ( var i = 0; i < str.length; i++) {
			if (!regex.test(str.charAt(i))) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 判断是否为邮箱地址
	 * 
	 * @param str
	 * @returns {Boolean}
	 */
	this.isEmail=function(str){
		var emailRegex = /^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,4}$/;
	    return emailRegex.test(str);
	}

	/**
	 * 判断是否为字符和数字
	 * 
	 * @param str
	 * @returns {Boolean}
	 */
	 this.isAlphaAndDigits=function(str){
		if(this.isNull(str)) {
			return false;
		} else {
			var addressRegex = /[a-zA-Z\d]/;
		    for (var i = 0; i < str.length; i++) {
		        if (!addressRegex.test(str.charAt(i))) {
		            return false;
		        }
		    }
		    return true;
	    }
	}

	/**
	 * 验证是否为通用名称：中文、字母、数字、-、_、空白、(、)、[、]
	 * 
	 * @param str
	 * @returns {Boolean}
	 */
	 this.isGeneralName=function(str){
		if(this.isNull(str)) {
			return false;
		} else {
			var nameRegex = /[ \(\)\[\]_\-a-zA-Z\u4e00-\u9fa5\d]/;
		    for (var i = 0; i < str.length; i++) {
		        if (!nameRegex.test(str.charAt(i))) {
		            return false;
		        }
		    }
		    return true;
	    }
	}

	/**
	 * 验证是否为通用密码：字母、数字、.、_、-
	 * 
	 * @param str
	 * @returns {Boolean}
	 */
	 this.isGeneralPwd=function(str){
		if(this.isNull(str)) {
			return false;
		} else {
			var pwdRegex = /[\._\-a-zA-Z\d]/;
		    for (var i = 0; i < str.length; i++) {
		        if (!pwdRegex.test(str.charAt(i))) {
		            return false;
		        }
		    }
		    return true;
	    }
	}
}

LT.FileUpLoad = new function() {

	this.upload = function(param) {
		if (param.url == '') {
			return;
		}
		var iframeId = "iframe_" + new Date().getTime();
		var iframe = $(
				"<iframe style='position:absolute;top:-9999px;left:-9999px' id='"
						+ iframeId + "' name='" + iframeId + "'></iframe>")
				.appendTo(document.body).css({
					width : 0,
					height : 0
				});

		var form = $("<form ></form>").attr("action", param.url).attr("method",
				"POST").attr("enctype", "multipart/form-data").attr("id",
				iframeId + "_form").css({
			position : "absolute",
			left : -9999,
			top : -9999
		}).attr("target", iframeId).appendTo(document.body);

		if (param.data) {
			for ( var i in param.data) {
				$(
						'<input type="hidden" name="' + i + '" value="'
								+ param.data[i] + '" />').appendTo(form);
			}
		}
		var file = $("#" + param.fileId);
		var newFile = file.clone();
		file.before(newFile);
		file.attr("id", iframeId + "_file");
		file.appendTo(form);

		if (param.start) {
			param.start.call("");
		}

		form.submit();
		iframe.load(function() {
			var result = iframe[0].contentWindow.document.body.innerHTML;
			if (param.finish) {
				param.finish.call("", result);
				form.remove();
				iframe.remove();
			}
		});
	};

	LT.KeyMapping = function() {
		this.A = 65;
		this.B = 66;
		this.C = 67;
		this.D = 68;
		this.E = 69;
		this.F = 70;
		this.G = 71;
		this.H = 72;
		this.I = 73;
		this.J = 74;
		this.K = 75;
		this.L = 76;
		this.M = 77;
		this.N = 78;
		this.O = 79;
		this.P = 80;
		this.Q = 81;
		this.R = 82;
		this.S = 83;
		this.T = 84;
		this.U = 85;
		this.V = 86;
		this.W = 87;
		this.X = 88;
		this.Y = 89;
		this.Z = 90;
		// 退格
		this.BACK = 8;
		// 空格键
		this.SPACE = 32;
		// ESC键
		this.ESC = 27;
		// F1键
		this.F1 = 16777226;
		// F2键
		this.F2 = 16777227;
		// F3键
		this.F3 = 16777228;
		// F4键
		this.F4 = 16777229;
		// F5键
		this.F5 = 16777230;
		// F6键
		this.F6 = 16777231;
		// F7键
		this.F7 = 16777232;
		// F8键
		this.F8 = 16777233;
		// F9键
		this.F9 = 16777234;
		// F10键
		this.F10 = 16777235;
		// F11键
		this.F11 = 16777236;
		// F12键
		this.F12 = 16777237;
		// `键
		this.DRIP = 96;
		// 1键
		this.NUM_1 = 49;
		// 2键
		this.NUM_2 = 50;
		// 3键
		this.NUM_3 = 51;
		// 4键
		this.NUM_4 = 52;
		// 5键
		this.NUM_5 = 53;
		// 6键
		this.NUM_6 = 54;
		// 7键
		this.NUM_7 = 55;
		// 8键
		this.NUM_8 = 56;
		// 9键
		this.NUM_9 = 57;
		// 0键
		this.NUM_0 = 48;
		// -键
		this.SUB = 45;
		// =键
		this.ADD = 61;
		// tab键
		this.TAB = 9;
		// Q键
		this.Q = 113;
		// W键
		this.W = 119;
		// E键
		this.E = 101;
		// R键
		this.R = 114;
		// T键
		this.T = 116;
		// Y键
		this.Y = 121;
		// U键
		this.U = 117;
		// I键
		this.I = 105;
		// O键
		this.O = 111;
		// P键
		this.P = 112;
		// [键
		this.LEFT_BRACKETS = 91;
		// ]键
		this.RIGHT_BRACKETS = 93;
		// \键
		this.TURN_BEVEL = 92;
		// capslock键
		this.CAPS_LOCK = 16777298;
		// A键
		this.A = 65;
		// S键
		this.S = 83;
		// D键
		this.D = 68;
		// F键
		this.F = 70;
		// G键
		this.G = 71;
		// H键
		this.H = 72;
		// J键
		this.J = 74;
		// K键
		this.K = 75;
		// L键
		this.L = 76;
		// ;键
		this.SEMICOLON = 59;
		// '键
		this.UP_COMMA = 39;
		// 回车键
		this.ENTER = 13;
		// SHIFT键
		this.SHIFT = 131072;
		// Z键
		this.Z = 90;
		// X键
		this.X = 88;
		// C键
		this.C = 67;
		// V键
		this.V = 86;
		// B键
		this.B = 66;
		// N键
		this.N = 78;
		// M键
		this.M = 77;
		// ,键
		this.COMMA = 44;
		// .键
		this.DOT = 46;
		// /键
		this.BEVEL = 47;
		// CTRL键
		this.CTRL = 262144;
		// ALT键
		this.ALT = 65536;
		// 上箭头
		this.UP = 16777217;
		// 下箭头
		this.DOWN = 16777218;
		// 左箭头
		this.LEFT = 16777219;
		// 右箭头
		this.RIGHT = 16777220;
		// SCROLL键
		this.SCROLL = 16777300;
		// PAUSE键
		this.PAUSE = 16777301;
		// INSERT键
		this.INSERT = 16777225;
		// DELETE键
		this.DELETE = 127;
		// HOME键
		this.HOME = 16777223;
		// END键
		this.END = 16777224;
		// PAGEUP键
		this.PAGE_UP = 16777221;
		// PAGEDOWN键
		this.PAGE_DOWN = 16777222;
	}

}