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
				<h4><span class="glyphicon glyphicon-th"></span> 新增产品规则</h4>
			</div>
			<div class="col-xs-9" style="text-align: right; padding-right: 0px;">
				<button type="button" class="btn btn-default btn_loading" onclick="form_cancel()"><span class="glyphicon glyphicon-circle-arrow-left"></span>返回</button>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-body">
						<form id="productrule_add_form" method="post" class="form-horizontal">
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">规则名称 <font color="red">*</font></label>
						    	<div class="col-xs-4"><input type="text" id="rule_name" name="productRule.rule_name" placeholder="如：通用规则" class="form-control"/></div>
						    	<div class="col-xs-4"><label id="validate_rule_name" class="control-label validate_label" style="color: red;"></label></div>
						  	</div>
						  	<div class="form-group">
						  		<label class="control-label col-xs-2">借款人年龄 <font color="red">*</font></label>
						    	<div class="col-xs-2"><input type="text" id="loan_age" name="productRule.loan_age" placeholder="如：25" class="form-control"/></div>
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
 						     </div>
						        <div class="form-group div1">
						  		<label class="control-label col-xs-2">借款人工龄 <font color="red">*</font></label>
						    	<div class="col-xs-6">
						    	   <label class="checkbox-inline">
                                     <input type="checkbox" id="loan_workyears1" name="productRule.loan_workyears" value="1"> 6个月
                                   </label>
                                   <label class="checkbox-inline">
                                     <input type="checkbox" id="loan_workyears2" name="productRule.loan_workyears" value="2"> 1年
                                   </label>
                                   <label class="checkbox-inline">
                                      <input type="checkbox" id="loan_workyears3" name="productRule.loan_workyears" value="3"> 2年
                                   </label>
                                   <label class="checkbox-inline">
                                      <input type="checkbox" id="loan_workyears4" name="productRule.loan_workyears" value="4"> 3年
                                   </label>
                                   <label class="checkbox-inline">
                                      <input type="checkbox" id="loan_workyears5" name="productRule.loan_workyears" value="5"> 3-5年
                                   </label>
                                   <label class="checkbox-inline">
                                      <input type="checkbox" id="loan_workyears6" name="productRule.loan_workyears" value="6"> 5年以上
                                   </label>
						    	</div>
						  	  </div>
						  	  <div class="form-group div1 div3 ">
						  		<label class="control-label col-xs-2">借款人月收入 <font color="red">*</font></label>
						    	<div class="col-xs-2"><input type="text" id="loan_income" name="productRule.loan_income" value="${productRule.loan_income}" placeholder="如：3000.00" class="form-control"/></div>
						  	  </div>
						  	   <div class="form-group div2">
						  		<label class="control-label col-xs-2">经营年限 <font color="red">*</font></label>
						    	<div class="col-xs-9">
						    	   <label class="checkbox-inline">
                                     <input type="checkbox" id="loan_bisyears1" name="productRule.loan_bisyears" value="1"> 无执照
                                   </label>
                                   <label class="checkbox-inline">
                                     <input type="checkbox" id="loan_bisyears2" name="productRule.loan_bisyears" value="2"> 工商注册不满1年
                                   </label>
                                   <label class="checkbox-inline">
                                      <input type="checkbox" id="loan_bisyears3" name="productRule.loan_bisyears" value="3"> 工商注册1年
                                   </label>
                                   <label class="checkbox-inline">
                                      <input type="checkbox" id="loan_bisyears4" name="productRule.loan_bisyears" value="4"> 工商注册2年
                                   </label>
                                   <label class="checkbox-inline">
                                      <input type="checkbox" id="loan_bisyears5" name="productRule.loan_bisyears" value="5"> 工商注册3-5年
                                   </label>
                                   <label class="checkbox-inline">
                                      <input type="checkbox" id="loan_bisyears6" name="productRule.loan_bisyears" value="6"> 工商注册5年以上
                                   </label>
						    	</div>
						  	  </div>
						  	  <div class="form-group div2">
						  		<label class="control-label col-xs-2">月均流水<font color="red">*</font></label>
						    	<div class="col-xs-2"><input type="text" id="loan_bisincome" name="productRule.loan_bisincome" value="${productRule.loan_bisincome}" placeholder="如：3000.00" class="form-control"/></div>
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
					           <div class="form-group">
						        <label class="control-label col-xs-2">逾期状况 <font color="red">*</font></label>
                                <div class="col-xs-6">
						    	   <label class="checkbox-inline">
                                     <input type="checkbox" id="loan_credit1" name="productRule.loan_credit" value="1"> 信用良好
                                   </label>
                                   <label class="checkbox-inline">
                                     <input type="checkbox" id="loan_credit2" name="productRule.loan_credit" value="2"> 1年内逾期少于3次或少于90天
                                   </label>
                                   <label class="checkbox-inline">
                                      <input type="checkbox" id="loan_credit3" name="productRule.loan_credit"  value="3"> 1年内逾期超过3次或超过90天
                                   </label>
						    	</div>
 					         </div>
 					         <div class="form-group">
						        <label class="control-label col-xs-2">车辆状况 <font color="red">*</font></label>
                                <div class="col-xs-4">
						    	   <label class="checkbox-inline">
                                     <input type="checkbox" id="loan_car1" name="productRule.loan_car" value="1"> 有车
                                   </label>
                                   <label class="radio-inline">
                                     <input type="checkbox" id="loan_car2" name="productRule.loan_car" value="2"> 无车
                                   </label>
						    	</div>
 					         </div>
 					         <div class="form-group">
						        <label class="control-label col-xs-2">参保项目 <font color="red">*</font></label>
                                <div class="col-xs-4">
						    	   <label class="checkbox-inline">
                                     <input type="checkbox" id="loan_insurance1" name="productRule.loan_insurance" value="1"> 公积金
                                   </label>
                                   <label class="checkbox-inline">
                                     <input type="checkbox" id="loan_insurance2" name="productRule.loan_insurance" value="2"> 社保
                                   </label>
                                   <label class="checkbox-inline">
                                      <input type="checkbox" id="loan_insurance3" name="productRule.loan_insurance"  value="3"> 商业保险
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
		   $(".div1").hide();
		   $(".div2").hide();
		   $(".div3").hide();
		 //显示剩下字段
	        $(":checkbox[name='productRule.loan_work']").click(function(){
	        	var value = $(this).val();
	        	if($(this).is(':checked')) {
	            	$(".div"+value).show();
	        	} else {
	        		$(".div"+value).hide();
	        		$(".div"+value).children("div").children("input").val('')
	        		$(".div"+value).children("div").children("label").children("input[type='checkbox']").prop("checked", false);
	        	}
	        });
	});
	function form_cancel(){
		window.location = '/productRule/productRuleList?keep=1';
	}

	function form_save(){
		$("label.validate_label").text("");
		$.ajax({
			url : "/productRule/productRuleSaveInvoke",
			method : "post",
			data :  $("#productrule_add_form").serialize(),
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
