//ajax请求方法
var ajaxRequest = function(url,requesType,data,responseType){
	var resultData;
	if(url == null || url ==''){
		return null;
	}
	if(requesType == null || requesType == '' || (requesType !='POST' && requesType != 'GET')){
		requesType ='POST';
	}
	if(responseType == null || responseType != ''){
		responseType='JSON';
	}
	$.ajax({
		  type: requesType,
		  url: url,
		  data: data,
		  async: false,
		  dataType: responseType,
		  success: function(responseDate){
			  resultData = responseDate;
		  }
	});
	
	return resultData;
}

//HTML地址栏取值
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
} 