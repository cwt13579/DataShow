<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>新增标签</title>
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
				<h4><span class="glyphicon glyphicon-th"></span> 新增标签</h4>
			</div>
			<div class="col-xs-9" style="text-align: right; padding-right: 0px;">
				<button type="button" class="btn btn-default btn_loading" onclick="form_cancel()"><span class="glyphicon glyphicon-circle-arrow-left"></span>返回</button>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-body">
						<form id="label_add_form" method="post" class="form-horizontal">
						  	<div class="form-group">
						    	<label class="control-label col-xs-2">标签编号 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="label_code" name="label.label_code" placeholder="如：10001" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_label_code" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">标签名称 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="label_name" name="label.label_name" placeholder="如：放款快" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_label_name" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">标签简介<font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="remark" name="label.remark" placeholder="如：放款快" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_loan_term" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	 
					         <div class="form-group">
						  		<label class="control-label col-xs-2">标签图片 <font color="red">*</font></label>
						    	<div class="col-xs-2">
						    	   <input type="file"  id="labelpath" name="label" class="form-control file" />
						    	   <input type="hidden"  id="label_path" name="label.label_path" value="${label.label_path}" />
						    	</div>
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
		 
		
		$("#labelpath").fileinput({
	    	  language: 'zh', //设置语言
		      uploadUrl: "/upload/uploadPicture?name=label", //上传的地址
		      enctype: 'multipart/form-data',
		      showPreview:true,
		      uploadAsync:true,
		      dropZoneEnabled: false,//是否显示拖拽区域
		      allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀
	    });
		 $("#labelpath").on("fileuploaded", function (event, data, previewId, index) {
		        if (data.code == 0) {
		            layer.msg('文件上传失败:'+msg);
		            return;
		        }
		        //文件上传成功
		        $("#label_path").val(data.response.data);
		  });
		 $('#labelpath').on('fileerror', function(event, data, msg) {
			 if (data.code == 0) {
		            layer.msg('fileerror文件上传失败:'+msg);
		            return;
		        }
		  });
		 //上传前
		 $('#labelpath').on('filepreupload', function(event, data, previewId, index) {
		       
		 });
		 
		 
	});
	function form_cancel(){
		window.location = '/label/labelList?keep=1';
	}

	function form_save(){
		$("label.validate_label").text("");
		$.ajax({
			url : "/label/labelSaveInvoke",
			method : "post",
			data :  $("#label_add_form").serialize(),
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
