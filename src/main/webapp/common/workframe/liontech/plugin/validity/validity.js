/**
 * 创建于:2014-5-6<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 文字校验插件
 * @author chender
 * @version 1.0.0
 */
LT.Validity=new function(){
	this.checkInt=function(number){
		var a = /^-?\d+$/;
		if (!a.test(number)) {
			return "请输入整数";
		} else {
			if (parseInt(number) > 2147483648) {
				return "输入的整数值过大,最大为:2147483648";
			}
			return null;
		}	
	}
	
	this.checkLong = function(number) {
		var a = /^-?\d+$/;
		if (!a.test(number)) {
			return "请输入整数";
		} else {
			return null;
		}
	};
	this.checkDouble = function(number) {
//		var a = /^(\d{1,3}(,\d\d\d)*(\.\d+)?|\d+(\.\d+)?)$/;
		var a = /^(-?\d+)(\.\d+)?$/;
		if (!a.test(number)) {
			return "请输入合法的数值,格式为xxx.xxx";
		} else {
			return null;
		}
	};
	this.checkString = function(number) {
		return null;
	};
	
	
	this.checkDate = function(date,dateFormat,onlyLastDate) {
		if (date==null) {
			return null;
		}
		if(dateFormat=="yymmdd"){
			if(date.length!=8){
				return "日期格式必须为yymmdd"				
			}
		}else if(dateFormat=="yymm"){
			if(date.length!=6){
				return "日期格式必须为yymm";				
			}else{
				date=date+"01";
			}
		}else if(dateFormat=="yy"){
			if(date.length!=4){
				return "日期格式必须为yy";				
			}else{
				date=date+"0101";
			}
		}else{
			return "不支持的日期格式:"+dateFormat;	
		}
		date=date.substring(0,4)+"-"+date.substring(4,6)+"-"+date.substring(6,8);
		var a = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/ig;
		var time=new Date().getTime();
		if (!a.test(date)) {
			return "日期格式不正确或当前日期不存在";
		} else if(onlyLastDate) {//只允许选择月末
			var lastDays=[31,28,31,30,31,30,31,31,30,31,30,31];
			var year=parseInt(date.substring(0,4));
			var month=parseInt(date.substring(5,7))-1;
			var day=parseInt(date.substring(8,10));
			var leap=(year%400==0||(year%4==0&&year%100!=0));
			if(leap){
				lastDays[1]=29;
			}
			if(lastDays[month]==day){								
				return null;
			}else{
				return "请输入月末的最后一天";
			}			
		}
	};

}