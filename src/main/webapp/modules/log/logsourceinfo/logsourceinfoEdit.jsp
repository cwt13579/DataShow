<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>修改日志源</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link href="/common/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="/common/upload/css/fileinput.min.css" rel="stylesheet">
    <link href="/common/select/css/bootstrap-multiselect.css" rel="stylesheet">
 
  </head>
  <body>
 <%@ include file="/modules/common/header.jsp"%>
 <div class="container-fluid">
        <div class="row page-header">
			<div class="col-xs-3">
				<h4><span class="glyphicon glyphicon-th"></span> 修改日志源</h4>
			</div>
			<div class="col-xs-9" style="text-align: right; padding-right: 0px;">
				<button type="button" class="btn btn-default btn_loading" onclick="form_cancel()"><span class="glyphicon glyphicon-circle-arrow-left"></span>返回</button>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
				 <form id="logsourceinfo_update_form" method="post" class="form-horizontal">
				 		<input type="hidden" name="logSourceInfo.src_id" value="${logSourceInfo.src_id}">
				<div class="panel panel-default">
					<div class="panel-body">
					  <ul id="myTab" class="nav nav-tabs">
						<li class="active"><a href="#base" data-toggle="tab"> 基本信息</a></li>
	                    <li><a href="#extend" data-toggle="tab">扩展信息</a></li>
	                  </ul>
	                  <div id="myTabContent" class="tab-content" style="padding-top:20px">
	                     <div class="tab-pane fade in active" id="base">
	                        <div class="form-group">
						    	<label class="control-label col-xs-2">日志源名称 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="src_name" name="logSourceInfo.src_name" value="${logSourceInfo.src_name}" placeholder="如：数据治理访问日志" class="form-control"/></div>
 						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">日志源类型 <font color="red">*</font></label>
						        <div class="col-xs-4"><select id="src_type" name="logSourceInfo.src_type"  class="form-control"></select></div>
 						  	</div>
 						  	
			  			 </div>
	                     <div class="tab-pane fade" id="extend">
	                      <div id="db">
	                        <div class="form-group">
						  		<label class="control-label col-xs-2">IP<font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="src_ip" name="logSourceInfo.src_ip" value="${logSourceInfo.src_ip}" placeholder="如：192.168.3.253" class="form-control"/></div>
 						  	</div>
 						  	 <div class="form-group">
						  		<label class="control-label col-xs-2">端口<font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="src_port" name="logSourceInfo.src_port" value="${logSourceInfo.src_port}" placeholder="如：8890" class="form-control"/></div>
 						  	</div>
 						  	<div class="form-group">
						  		<label class="control-label col-xs-2">用户名<font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="src_user" name="logSourceInfo.src_user" value="${logSourceInfo.src_user}" placeholder="如：zy" class="form-control"/></div>
 						  	</div>
 						  	<div class="form-group">
						  		<label class="control-label col-xs-2">密码<font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="src_pass" name="logSourceInfo.src_pass" value="${logSourceInfo.src_pass}" placeholder="如：123" class="form-control"/></div>
 						  	</div>
 						  	<div class="form-group">
						  		<label class="control-label col-xs-2">sql<font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="src_sql" name="logSourceInfo.src_sql" value="${logSourceInfo.src_sql}" placeholder="如：select * from visit" class="form-control"/></div>
 						  	</div>
 						  </div>
 						  <div id="file">
 						  	<div class="form-group">
						  		<label class="control-label col-xs-2">文件路径<font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="src_path" name="logSourceInfo.src_path" value="${logSourceInfo.src_path}" placeholder="如：/opt/log/access-log" class="form-control"/></div>
 						  	</div>
 						  	<div class="form-group">
						  		<label class="control-label col-xs-2">日志格式 <font color="red">*</font></label>
						        <div class="col-xs-4"><select id="format_type" name="logSourceInfo.format_type"  class="form-control"></select></div>
 						  	</div>
 						  	<div class="form-group" id="src_separator_div">
						  		<label class="control-label col-xs-2">分隔符<font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="src_separator" name="logSourceInfo.src_separator" value="${logSourceInfo.src_separator}" placeholder="如：," class="form-control"/></div>
 						  	</div>
 						  	<div class="form-group" id="src_regex_div">
						  		<label class="control-label col-xs-2">grok pattern匹配<font color="red">*</font></label>
						    	<div class="col-xs-9">
						     	  <textarea class="form-control" rows="5" id="src_regex" name="logSourceInfo.src_regex" >${logSourceInfo.src_regex}</textarea>
						    	</div>
 						  	</div>
	                     </div>
	                     <div id="syslog">
	                        <div class="form-group">
						  		<label class="control-label col-xs-2">grok pattern匹配<font color="red">*</font></label>
						    	<div class="col-xs-9">
						     	  <textarea class="form-control" rows="5" id="src_regex" name="logSourceInfo.src_regex" >${logSourceInfo.src_regex}</textarea>
						    	</div>
 						  	</div>
	                     </div>
	                  </div>
	                        <button type="button" class="btn btn-default btn_loading" onclick="form_save();"><span class="glyphicon glyphicon-ok"></span> 保存</button>
			  				<span class="img_loading" style="display: none;"><img src="/common/bin/img/loading.gif" /></span>
			  				<button type="button" class="btn btn-default btn_loading" onclick="form_cancel();"><span class="glyphicon glyphicon-remove"></span> 取消</button>
	                     
		  			</div>
		  			</div>
				</div>
			  </form>
			</div>
		</div>
  </div>
</body>
  <script src="/common/js/jquery-1.10.2.min.js"></script>
  <script src="/common/bootstrap/js/bootstrap.min.js"></script>
  <script src="/common/tpl/template.js"></script>
  <script src="/common/p/p.js"></script>
  <script src="/common/layer/layer.js"></script>
  <script src="/common/bin/js/enum.js"></script>
  <script src="/common/bin/js/app_fn.js"></script>
  <script src="/common/select/js/bootstrap-multiselect.js"></script>
  <script src="/common/upload/js/fileinput.min.js"></script>
  <script src="/common/upload/js/fileinput_locale_zh.js"></script>
  
  <script type="text/javascript">
	$(document).ready(function() {
		var srcType = "${logSourceInfo.src_type}"
		srcArr = srcType.split(",");
		var formatType = "${logSourceInfo.format_type}"
		formatArr = formatType.split(",");
	    $("#src_type").ui_select({schema:"LogType",needDefault:true,defaultLabel:"请选择",selectedValue:srcArr})
	    $("#format_type").ui_select({schema:"FormatType",needDefault:true,defaultLabel:"请选择",selectedValue:formatArr})
	    chooseSrcType($("#src_type").val());
	    chooseFormatType($("#format_type").val());
        
	    $("#src_type").change(function(){
			var value = $(this).val();
			chooseSrcType(value);
		});
		$("#format_type").change(function(){
			var value = $(this).val();
			chooseFormatType(value);
		});
	});
	
	function form_cancel(){
		window.location = '/log/logsourceinfo/logSourceInfoList?keep=1';
	}
    function chooseSrcType(value) {
    	switch(value) {
		case "1" :
			$("#db").hide();
		    $("#syslog").hide();
			$("#file").show();
			break;
		case "2" :
		case "3" :
		case "4" :
			$("#db").show();
		    $("#syslog").hide();
			$("#file").hide();
			break;
		case "5" :
			$("#db").hide();
		    $("#syslog").show();
			$("#file").hide();
			break;
		case "6" :
			break;
		case "7" :
			break;
		}
    }
    function chooseFormatType(value) {
    	switch(value) {
		case "1" :
			$("#src_regex").hide();
			$("#src_separator").show();
			break;
		case "2" :
			$("#src_regex").show();
			$("#src_separator").hide();
		}
    }
	function form_save(){
		$.ajax({
			url : "/log/logsourceinfo/logSourceInfoUpdateInvoke",
			method : "post",
			data :  $("#logsourceinfo_update_form").serialize(),
			beforeSend : function() {
				$('.img_loading').show();
				$('.btn_loading').attr('disabled', true);
			},
			success : function(data) {
				if(data && data.code){
					// 后台正常处理，未出异常
					if(data.code==1){
						layer.msg("保存成功",{time:1000},function(){
							form_cancel();
						});
					} else {
						 layer.msg("保存失败");
					}
				} else {
					layer.msg("数据格式有误");
				}
				$('.img_loading').hide();
				$('.btn_loading').attr('disabled', false);
			},
			error : function() {
				$('.img_loading').hide();
				$('.btn_loading').attr('disabled', false);
				layer.msg("后台异常，未返回JSON数据");
			}
		});
	}
  </script>
</html>
