<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>修改采集服务</title>
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
				<h4><span class="glyphicon glyphicon-th"></span> 修改采集服务</h4>
			</div>
			<div class="col-xs-9" style="text-align: right; padding-right: 0px;">
				<button type="button" class="btn btn-default btn_loading" onclick="form_cancel()"><span class="glyphicon glyphicon-circle-arrow-left"></span>返回</button>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-body">
						<form id="logcollect_update_form" method="post" class="form-horizontal">
						       <input type="hidden" name="logCollect.collect_id" value="${logCollect.collect_id}">
						  	<div class="form-group">
						    	<label class="control-label col-xs-2">采集任务名称 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="collect_name" name="logCollect.collect_name" value="${logCollect.collect_name}" placeholder="如：数据治理访问日志采集" class="form-control"/></div>
 						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">es索引 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="collect_es_index" name="logCollect.collect_es_index" value="${logCollect.collect_es_index}" placeholder="如：access-log" class="form-control"/></div>
 						  	</div>
 						  	<div class="form-group">
						  		<label class="control-label col-xs-2">es类型<font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="collect_es_type" name="logCollect.collect_es_type" value="${logCollect.collect_es_type}" placeholder="如：access-log" class="form-control"/></div>
 						  	</div>
 						  	<div class="form-group">
						  		<label class="control-label col-xs-2">日志源 <font color="red">*</font></label>
						        <div class="col-xs-4"><select id="src_id" name="logCollect.src_id"  class="form-control"></select></div>
 						  	</div>
 						  	<div class="form-group">
						  		<label class="control-label col-xs-2">采集服务 <font color="red">*</font></label>
						        <div class="col-xs-4"><select id="machine_id" name="srcCollectMachine.machine_id"  class="form-control"></select></div>
 						  	</div>
 						  	<div class="form-group">
						  		<label class="control-label col-xs-2">任务状态 <font color="red">*</font></label>
						        <div class="col-xs-4"><select id="status" name="logCollect.status"  class="form-control"></select></div>
 						  	</div>
			  				<button type="button" class="btn btn-default btn_loading" onclick="form_save();"><span class="glyphicon glyphicon-ok"></span> 保存</button>
			  				<span class="img_loading" style="display: none;"><img src="/common/bin/img/loading.gif" /></span>
			  				<button type="button" class="btn btn-default btn_loading" onclick="form_cancel();"><span class="glyphicon glyphicon-remove"></span> 取消</button>
			  			</form>
		  			</div>
				</div>
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
		var status = "${logCollect.status}"
		var srcId = "${logCollect.src_id}"
		var machineId = "${logCollect.machine_id}"
		statusArr = status.split(",");
		srcArr = srcId.split(",");
		machineArr = machineId.split(",");
		$("#status").ui_select({schema:"CollectStatus",needDefault:false,selectedValue:statusArr})
		$("#src_id").ui_select({schema:"LogSourceInfo",needDefault:false,selectedValue:srcArr})
		$("#machine_id").ui_select({schema:"LogCollectMachine",needDefault:false,selectedValue:machineArr})
	});
	function form_cancel(){
		window.location = '/log/logcollect/logCollectList?keep=1';
	}

	function form_save(){
		$.ajax({
			url : "/log/logcollect/logCollectUpdateInvoke",
			method : "post",
			data :  $("#logcollect_update_form").serialize(),
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
