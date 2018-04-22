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
	
 
  </head>
  <body>
   <%@ include file="/modules/common/header.jsp"%>
 <div class="container-fluid">
        <div class="row page-header">
			<div class="col-xs-3">
				<h4><span class="glyphicon glyphicon-th"></span> 修改产品规则</h4>
			</div>
			<div class="col-xs-9" style="text-align: right; padding-right: 0px;">
				<button type="button" class="btn btn-default btn_loading" onclick="form_cancel()"><span class="glyphicon glyphicon-circle-arrow-left"></span>返回</button>
			</div>
		</div>
        <div class="row">
			<div class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-body">
						<form id="productrule_update_form" method="post" class="form-horizontal">
						    <input type="hidden" name="productRule.id" value="${productRule.id}">
						  	<div class="form-group">
						    	<label class="control-label col-xs-2">产品编号 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="product_code" name="productRule.product_code" value="${productRule.product_code}" placeholder="如：10001" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_product_code" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">产品名称 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="product_name" name="productRule.product_name" value="${productRule.product_name}" placeholder="如：财富宝" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_product_name" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">产品额度 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="loan_amount" name="productRule.loan_amount" value="${productRule.loan_amount}" placeholder="如：30000" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_loan_amount" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">产品期限 <font color="red">*</font></label>
						    	<div class="col-xs-2"><input type="text" id="loan_term" name="productRule.loan_term" value="${productRule.loan_term}" placeholder="如：180" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_loan_term" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">借款人职业 <font color="red">*</font></label>
						    	<div class="col-xs-4">
						    	   <label class="checkbox-inline">
                                     <input type="checkbox" id="loan_work1" name="productRule.loan_work" value="1"> 上班族
                                   </label>
                                   <label class="checkbox-inline">
                                     <input type="checkbox" id="loan_work2" name="productRule.loan_work" value="2"> 个体户
                                   </label>
                                   <label class="checkbox-inline">
                                      <input type="checkbox" id="loan_work3" name="productRule.loan_work" value="3"> 无固定职业
                                   </label>
                                   <label class="checkbox-inline">
                                      <input type="checkbox" id="loan_work4" name="productRule.loan_work" value="4"> 学生
                                   </label>
						    	</div>
						    	<div class="col-xs-4"><label id="validate_loan_work" class="control-label validate_label" style="color: red;"></label></div>
						     </div>
                             <div class="form-group">
						        <label class="control-label col-xs-2">借款人房产 <font color="red">*</font></label>
                                <div class="col-xs-4">
						    	   <label class="checkbox-inline">
                                     <input type="checkbox" id="loan_house1" name="productRule.loan_house" value="1"> 住宅
                                   </label>
                                   <label class="checkbox-inline">
                                     <input type="checkbox" id="loan_house2" name="productRule.loan_house" value="2"> 商铺
                                   </label>
                                   <label class="checkbox-inline">
                                      <input type="checkbox" id="loan_house3" name="productRule.loan_house"  value="3"> 厂房
                                   </label>
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
  <script type="text/javascript">
   $(document).ready(function() {
		var works = "${productRule.loan_work}";
		var houses = "${productRule.loan_house}";
		var worksarr=works.split(",");  
		var housesarr=houses.split(",");  
		worksarr.forEach(function(e){ 
			$("input[name='productRule.loan_work']:checkbox").each(function(){ 
				var value = $(this).val();
				if(e == value){
					 $(this).prop('checked', true);
				}  
			});  
		});
		housesarr.forEach(function(e){ 
			$("input[name='productRule.loan_house']:checkbox").each(function(){ 
				var value = $(this).val();
				if(e == value){
					 $(this).prop('checked', true);
				}  
			});  
		});
	});
	function form_cancel(){
		window.location = '/productRule/productRuleList?keep=1';
	}
    function fomr_data() {
    	
    }
	function form_save(){
		$("label.validate_label").text("");
		$.ajax({
			url : "/productRule/productRuleUpdateInvoke",
			method : "post",
			data :  $("#productrule_update_form").serialize(),
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
