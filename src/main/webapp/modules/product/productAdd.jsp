<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>产品列表</title>
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
				<h4><span class="glyphicon glyphicon-th"></span> 新增产品</h4>
			</div>
			<div class="col-xs-9" style="text-align: right; padding-right: 0px;">
				<button type="button" class="btn btn-default btn_loading" onclick="form_cancel()"><span class="glyphicon glyphicon-circle-arrow-left"></span>返回</button>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-body">
						<form id="product_add_form" method="post" class="form-horizontal">
						  	<div class="form-group">
						    	<label class="control-label col-xs-2">产品编号 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="product_code" name="product.product_code" placeholder="如：10001" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_product_code" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">产品名称 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="product_name" name="product.product_name" placeholder="如：财富宝" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_product_name" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">产品简介 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="product_intro" name="product.product_intro" placeholder="如：银联商务携手xx银行" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_loan_term" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">合作机构 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="institution" name="product.institution" placeholder="如：xx银行" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_loan_term" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">产品额度 <font color="red">*</font></label>
						    	<div class="col-xs-2"><input type="text" id="loan_amount" name="product.product_limit" placeholder="如：30000" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_loan_amount" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">产品周期 <font color="red">*</font></label>
						    	<div class="col-xs-2"><input type="text" id="loan_term" name="product.product_period" placeholder="如：180" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_loan_term" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">产品月利率 <font color="red">*</font></label>
						    	<div class="col-xs-2"><input type="text" id="product_rate" name="product.product_rate" placeholder="如：1-10" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_loan_term" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">计息方式 <font color="red">*</font></label>
						    	<div class="col-xs-4">
						    	   <label class="radio-inline">
                                     <input type="radio" id="interest_way1" name="product.interest_way" value="1"> 按日计息
                                   </label>
                                   <label class="radio-inline">
                                     <input type="radio" id="interest_way2" name="product.interest_way" value="2"> 按月计息
                                   </label>
                                    <label class="radio-inline">
                                     <input type="radio" id="interest_way3" name="product.interest_way" value="3"> 到期还本
                                   </label>
                                    <label class="radio-inline">
                                     <input type="radio" id="interest_way4" name="product.interest_way" value="4"> 随借随还
                                   </label>
						    	</div>
						    	<div class="col-xs-4"><label id="validate_interest_way" class="control-label validate_label" style="color: red;"></label></div>
						     </div>
                             <div class="form-group">
						        <label class="control-label col-xs-2">放款方式 <font color="red">*</font></label>
                                <div class="col-xs-4">
						    	   <label class="radio-inline">
                                     <input type="radio" id="draw_way1" name="product.draw_way" value="1"> 一次申请
                                   </label>
                                   <label class="radio-inline">
                                     <input type="radio" id="draw_way2" name="product.draw_way" value="2"> 循环提款
                                   </label>
                                   <label class="radio-inline">
                                      <input type="radio" id="draw_way3" name="product.draw_way"  value="3"> 随借随还
                                   </label>
						    	</div>
 					         </div>
					         <div class="form-group">
						        <label class="control-label col-xs-2">申请方式<font color="red">*</font></label>
                                <div class="col-xs-4">
						    	   <label class="radio-inline">
                                     <input type="radio" id="apply_way1" name="product.apply_way" value="1"> 天天富App预约
                                   </label>
                                   <label class="radio-inline">
                                     <input type="radio" id="apply_way2" name="product.apply_way" value="2"> 线下身份认证
                                   </label>
						    	</div>
 					         </div> 
 					         <div class="form-group">
						        <label class="control-label col-xs-2">支持地区 <font color="red">*</font></label>
						        <div class="col-xs-4"><select name="productRegion.region_id" id="region_id" class="form-control" multiple="multiple" ></select></div>
					         </div>
					         <div class="form-group">
						  		<label class="control-label col-xs-2">产品logo <font color="red">*</font></label>
						    	<div class="col-xs-2">
						    	   <input type="file"  id="logo" name="logo" class="form-control file" />
						    	   <input type="hidden"  id="logo_path" name="product.logo_path" value="${product.logo_path}" />
						    	</div>
						  	</div>
						  	 <div class="form-group">
						  		<label class="control-label col-xs-2">产品banner <font color="red">*</font></label>
						    	<div class="col-xs-2">
						    	   <input type="file"  id="banner" name="banner" class="form-control file" />
						    	   <input type="hidden"  id="banner_path" name="product.banner_path" value="${product.banner_path}" />
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
		$("#region_id").ui_select({schema:"Region",needDefault:false,selectedValue:[]});
		$("#label_id").ui_select({schema:"Label",needDefault:false,selectedValue:[]});
		$('#region_id').multiselect({
			 nonSelectedText: '请选择',
			    enableFiltering: true,
	            includeSelectAllOption: true,
	            maxHeight: 200,
	            buttonWidth: '400px',
	            dropUp: true
        });
		$('#label_id').multiselect({
		    nonSelectedText: '请选择',
		    enableFiltering: true,
            includeSelectAllOption: true,
            maxHeight: 200,
            buttonWidth: '400px',
            dropUp: true
       });
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
	});
	function form_cancel(){
		window.location = '/product/productList?keep=1';
	}

	function form_save(){
		$("label.validate_label").text("");
		$.ajax({
			url : "/product/productSaveInvoke",
			method : "post",
			data :  $("#product_add_form").serialize(),
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
