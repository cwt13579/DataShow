<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>新增ftp任务</title>
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
				<h4><span class="glyphicon glyphicon-th"></span> 新增ftp任务</h4>
			</div>
			<div class="col-xs-9" style="text-align: right; padding-right: 0px;">
				<button type="button" class="btn btn-default btn_loading" onclick="form_cancel()"><span class="glyphicon glyphicon-circle-arrow-left"></span>返回</button>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-body">
						<form id="ftptask_add_form" method="post" class="form-horizontal">
						  	<div class="form-group">
						    	<label class="control-label col-xs-2">任务名称 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="task_name" name="ftpTask.task_name" placeholder="如：数据治理访问日志任务" class="form-control"/></div>
 						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">Ftp地址 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="ftp_host" name="ftpTask.ftp_host" placeholder="如：192.168.3.253" class="form-control"/></div>
 						  	</div>
 						  	<div class="form-group">
						  		<label class="control-label col-xs-2">Ftp端口<font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="ftp_port" name="ftpTask.ftp_port" placeholder="如：21" class="form-control"/></div>
 						  	</div>
 						  	<div class="form-group">
						  		<label class="control-label col-xs-2">Ftp用户名<font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="ftp_user" name="ftpTask.ftp_user" placeholder="如：user" class="form-control"/></div>
 						  	</div>
 						  	<div class="form-group">
						  		<label class="control-label col-xs-2">Ftp密码<font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="ftp_pwd" name="ftpTask.ftp_pwd" placeholder="如：xxxx" class="form-control"/></div>
 						  	</div>
 						  	<div class="form-group">
						  		<label class="control-label col-xs-2">Ftp路径<font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="ftp_path" name="ftpTask.ftp_path" placeholder="如：/opt/ftppath" class="form-control"/></div>
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

	});
	function form_cancel(){
		window.location = '/log/ftpTask/ftpTaskList?keep=1';
	}

	function form_save(){
		$.ajax({
			url : "/log/ftpTask/ftpTaskSaveInvoke",
			method : "post",
			data :  $("#ftptask_add_form").serialize(),
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
