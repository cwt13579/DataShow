<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>统计数据管理</title>
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
				<h4><span class="glyphicon glyphicon-th"></span> 统计数据管理</h4>
			</div>
            <div class="col-xs-9" style="text-align: right; padding-right: 0px;">
				<button type="button" class="btn btn-default btn_loading" onclick="addstatisticsRecord()"><span class="glyphicon glyphicon-plus"></span>新增</button>
			</div>
		</div>
		<div class="row">
				
					<div class="panel panel-default">
						<div class="panel-body" style="background-color: #eeeeee;">
						<div class="col-xs-9">
							<form id="search_form" method="post" class="form-inline">
								<div class="form-group">
									<label>客户经理姓名</label> <input type="text" class="form-control"
										id="user_name" name="qm.user_name"></input>
								</div>
								<button type="button" class="btn btn-primary btn_loading"
									onclick="getData(1);">
									<span class="glyphicon glyphicon-search"></span> 搜索
								</button>
								<span id="loading" style="display: none;"><img
									src="/common/bin/img/loading.gif" /></span>
								<button type="button" class="btn btn-primary btn_loading"
									onclick="clearCondition();">
									<span class="glyphicon glyphicon-repeat"></span> 清除查询条件
								</button>
							</form>
						</div>
						<div class="col-xs-3" style="text-align: right; padding-right: 0px;">
						  <a class="btn btn-default btn_loading" href="/template/sr.xls"><span  class="glyphicon glyphicon-download">导入模板</span></a>
			              <button class="btn btn-default btn_loading" data-toggle="modal" data-target="#stasticsUploadModel"><span class="glyphicon glyphicon-upload"></span>导入</button>
			              <button class="btn btn-default btn_loading" data-toggle="modal" data-target="#orgUploadModel"><span class="glyphicon glyphicon-upload"></span>导入机构</button>
			           </div>
					</div>
				</div>
			</div>
	    <div class="row">
			<div class="col-xs-12">
				<div class="table-responsive">
					<table class="table table-hover">
						<thead>
							<tr>
								<th>账号</th>
								<th>用户名</th>
								<th>机构编号</th>
								<th>机构名称</th>
								<th>推荐数</th>
								<th>申请数</th>
								<th>日期</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody id="listContainer">

						</tbody>
					</table>
				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="col-xs-12 text-right" id="page"></div>
		</div>
  </div>
  <script id="listScript" type="text/html">
		{{each list as item}}
		<tr>
            <td>{{item.user_account}}</td>
            <td>{{item.user_name}}</td>
            <td>{{item.org_code}}</td>
            <td>{{item.org_name}}</td>
            <td>{{item.recommend_count}}</td>
            <td>{{item.apply_count}}</td>
            <td>{{item.date}}</td>
            <td>
				<a href="#" onclick="deleteStatisticsRecord('{{item.id}}')"><span class="glyphicon glyphicon-trash"></span> 删除</a>
			</td>
		</tr>
		{{/each}}
	</script>
	<%@ include file="/modules/statisticsrecord/statisticsUploadModel.jsp"%>

</body>
  <script src="/common/js/jquery-1.10.2.min.js"></script>
  <script src="/common/bootstrap/js/bootstrap.min.js"></script>
  <script src="/common/tpl/template.js"></script>
  <script src="/common/p/p.js"></script>
  <script src="/common/layer/layer.js"></script>
  <script type="text/javascript">
    $(document).ready(function(){
		getData(1);
		$('#reload').click(function(){
			getData(1);
		});
	});
    function importTemplate() {
    	window.location="/statisticsRecord/importTemplate"
    }
    
    function uploadFile() {
    	var formobj =  document.getElementById("importFile");
    	var formdata = new FormData(formobj);
     	  $.ajax({
      		url:"/statisticsRecord/importStasticsRecord",
      		method : "post",
            beforeSend : function() {
      		},
      		success : function(data) {
      			if (data && data.code == 1) {
      				layer.msg("上传成功",{time:1000},function(){
      					getData(1);
  					});
      				
      			} else {
      				layer.msg("系统异常，上传失败",{time:1000});
      			}
      		},
      		error : function() {
      			layer.msg("上传失败",{time:1000},function(){
  					getData(1);
  				});
      		}
      	});
     	  
    }
    function getData(index) {
	    $.ajax({
			url: "/statisticsRecord/statisticsRecordListInvoke?current=" + index,
			method:"post",
			data:$("#search_form").serialize(),
			dataType: "json",
			beforeSend : function() {
				$('#loading').show();
				$('.btn_loading').attr('disabled', true);
			},
			success: function(resp){
				console.log
				if(resp && resp.code) {
					if(resp.code==1) {
						var html = template('listScript', resp.data);
						$('#listContainer').html(html);
						// 设置翻页控件
						$('#page').paginator({
							current_page : index,
							page_count : resp.data.totalPage,
							button_number : 5,
							total_count : resp.data.totalRow,
							page_size : 10,
							pager_click : function(page) {
								getData(page);
							}
						});
					} else {
						layer.msg(data.note);
					}
				} else {
					layer.msg("数据格式有误");
				}
				$('#loading').hide();
				$('.btn_loading').attr('disabled', false);
			},
			error: function(){
				$('.img_loading').hide();
				$('.btn_loading').attr('disabled', false);
				layer.msg("后台异常，未返回JSON数据");
			       }
			});
	      }
  
    function addstatisticsRecord() {
    	window.location="/statisticsRecord/statisticsRecordAdd";
    }
    function editstatisticsRecord(id) {
    	window.location = '/statisticsRecord/statisticsRecordEdit?id=' + id;
    }
    function deleteStatisticsRecord(id) {
    	layer.confirm('删除确认', '', function() {
    	  $.ajax({
    		url:"/statisticsRecord/statisticsRecordDeleteInvoke?id=" + id,
    		method : "post",
            beforeSend : function() {
    		},
    		success : function(data) {
    			if (data && data.code == 1) {
    				layer.msg("删除成功",{time:1000},function(){
    					getData(1);
					});
    				
    			} else {
    				layer.msg("系统异常，删除失败",{time:1000});
    			}
    		},
    		error : function() {
    			layer.msg("删除失败",{time:1000},function(){
					getData(1);
				});
    		}
    	});
      },400);
    }
    function clearCondition() {
        $("#user_name").val('');
        getData(1);
    }
   
  </script>
</html>
