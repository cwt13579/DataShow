<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>新增理财产品</title>
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
				<h4><span class="glyphicon glyphicon-th"></span> 新增理财产品</h4>
			</div>
			<div class="col-xs-9" style="text-align: right; padding-right: 0px;">
				<button type="button" class="btn btn-default btn_loading" onclick="form_cancel()"><span class="glyphicon glyphicon-circle-arrow-left"></span>返回</button>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-body">
						<form id="finance_add_form" method="post" class="form-horizontal">
						  	<div class="form-group">
						    	<label class="control-label col-xs-2">产品编号 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="finance_code" name="finance.finance_code" placeholder="如：10001" class="form-control"/></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">产品名称 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="finance_name" name="finance.finance_name" placeholder="如：天天有利" class="form-control"/></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">产品简介 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="finance_intro" name="finance.finance_intro" placeholder="如：收单资金自动买入" class="form-control"/></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">对接产品 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="relate_product" name="finance.relate_product" placeholder="如：理财货币基金" class="form-control"/></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">投资限额 <font color="red">*</font></label>
						    	<div class="form-inline" >
						    	  &nbsp;&nbsp;&nbsp;
						    	   <input type="text" id="invest_min" name="finance.invest_min" value="${finance.invest_min}" placeholder="如：1" class="form-control"/>万
						    	   -
						    	   <input type="text" id="invest_max" name="finance.invest_max" value="${finance.invest_max}" placeholder="如：500" class="form-control"/>万
						    	</div>
						  	</div>
						   <div class="form-group">
						  		<label class="control-label col-xs-2">七日年化收益 <font color="red">*</font></label>
						    	 <div class="form-inline">
						    	 &nbsp;&nbsp;&nbsp;
						    	 	<input type="text" id="week_interest" name="finance.week_interest" value="${finance.week_interest}" placeholder="如：4.36" class="form-control"/>%
						    	    -
						    	   <input type="text" id="week_interest2" name="finance.week_interest2" value="${finance.week_interest2}" placeholder="如：4.39"  class="form-control"/>%
						    	 </div>
						  	</div>
						  	 
					         <div class="form-group">
						        <label class="control-label col-xs-2">产品类型 <font color="red">*</font></label>
						        <div class="col-xs-2"><select id="finance_type" name="finance.finance_type"  class="form-control"></select></div>
					         </div>
 					         <div class="form-group">
						        <label class="control-label col-xs-2">期限类型 <font color="red">*</font></label>
						        <div class="col-xs-2"><select id="term_type" name="finance.term_type"  class="form-control"></select></div>
					         </div>
					         <div class="form-group">
						  		<label class="control-label col-xs-2">产品logo <font color="red">*</font></label>
						    	<div class="col-xs-2">
						    	   <input type="file"  id="logo" name="logo" class="form-control file" />
						    	   <input type="hidden"  id="logo_path" name="finance.logo_path" value="${finance.logo_path}" />
						    	</div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">产品banner <font color="red">*</font></label>
						    	<div class="col-xs-2">
						    	   <input type="file"  id="banner" name="banner" class="form-control file" />
						    	   <input type="hidden"  id="banner_path" name="finance.banner_path" value="${finance.banner_path}" />
						    	</div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">赎回方式 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="back_way" name="finance.back_way"  value="${finance.back_way}" placeholder="如：7*24小时" class="form-control"/></div>
						  	</div>
						  	 <div class="form-group">
						  		<label class="control-label col-xs-2">备注 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="remark" name="finance.remark"  value="${finance.remark}" placeholder="如：无排他性" class="form-control"/></div>
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
		
		$("#logo").fileinput({
	    	  language: 'zh', //设置语言
		      uploadUrl: "/upload/uploadPicture?name=logo", //上传的地址
		      enctype: 'multipart/form-data',
		      showPreview:true,
		      uploadAsync:true,
		      dropZoneEnabled: false,//是否显示拖拽区域
		      allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀
	    });
		 $("#logo").on("fileuploaded", function (event, data, previewId, index) {
		        if (data.code == 0) {
		            layer.msg('文件上传失败:'+msg);
		            return;
		        }
		        //文件上传成功
		        $("#logo_path").val(data.response.data);
		  });
		 $('#logo').on('fileerror', function(event, data, msg) {
			 if (data.code == 0) {
		            layer.msg('fileerror文件上传失败:'+msg);
		            return;
		        }
		  });
		 //上传前
		 $('#logo').on('filepreupload', function(event, data, previewId, index) {
		       
		 });
		 
		 $("#banner").fileinput({
	    	  language: 'zh', //设置语言
		      uploadUrl: "/upload/uploadPicture?name=banner", //上传的地址
		      enctype: 'multipart/form-data',
		      showPreview:true,
		      uploadAsync:true,
		      dropZoneEnabled: false,//是否显示拖拽区域
		      allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀
	    });
		 $("#banner").on("fileuploaded", function (event, data, previewId, index) {
		        if (data.code == 0) {
		            layer.msg('文件上传失败:'+msg);
		            return;
		        }
		        //文件上传成功
		        $("#banner_path").val(data.response.data);
		  });
		 $('#banner').on('fileerror', function(event, data, msg) {
			 if (data.code == 0) {
		            layer.msg('fileerror文件上传失败:'+msg);
		            return;
		        }
		  });
		 //上传前
		 $('#banner').on('filepreupload', function(event, data, previewId, index) {
		       
		 });
		 
		 $("#finance_type").ui_select({schema:"FinanceType",needDefault:false,selectedValue:[]});
		 $("#term_type").ui_select({schema:"TermType",needDefault:false,selectedValue:[]});
	});
	function form_cancel(){
		window.location = '/finance/financeList?keep=1';
	}

	function form_save(){
		$("label.validate_label").text("");
		$.ajax({
			url : "/finance/financeSaveInvoke",
			method : "post",
			data :  $("#finance_add_form").serialize(),
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
