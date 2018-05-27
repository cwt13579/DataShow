<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>业务系统管理</title>
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
				<h4><span class="glyphicon glyphicon-th"></span> 业务系统管理</h4>
			</div>
            <div class="col-xs-9" style="text-align: right; padding-right: 0px;">
				<button type="button" class="btn btn-default btn_loading" onclick="addBizsys()"><span class="glyphicon glyphicon-plus"></span>新增</button>
			</div>
		</div>
		<div class="row">
				<div class="col-xs-12">
					<div class="panel panel-default">
						<div class="panel-body" style="background-color: #eeeeee;">
							<form id="search_form" method="post" class="form-inline">
								<div class="form-group">
									<label>名称</label> <input type="text" class="form-control"
										id="sysName" name="qm.sys_name"></input>
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
					</div>
				</div>
			</div>
	    <div class="row">
			<div class="col-xs-12">
				<div class="table-responsive">
					<table class="table table-hover">
						<thead>
							<tr>
								<th>业务系统名称</th>
								<th>业务系统IP</th>
								<th>业务系统简介</th>
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
            <td>{{item.sys_name}}</td>
            <td>{{item.sys_ip}}</td>
            <td>{{item.sys_info}}</td>
            <td>
                <a href="#" onclick="editBizsys('{{item.sys_id}}')"><span class="glyphicon glyphicon-edit"></span> 修改</a>
				<a href="#" onclick="deleteBizsys('{{item.sys_id}}')"><span class="glyphicon glyphicon-trash"></span> 删除</a>
			</td>
		</tr>
		{{/each}}
	</script>
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
    function getData(index) {
	    $.ajax({
			url: "/log/bizsys/bizsysListInvoke?current=" + index,
			method:"post",
			data:$("#search_form").serialize(),
			dataType: "json",
			beforeSend : function() {
				$('#loading').show();
				$('.btn_loading').attr('disabled', true);
			},
			success: function(resp){
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
  
    function addBizsys() {
    	window.location="/log/bizsys/bizsysAdd";
    }
    function editBizsys(id) {
    	window.location = '/log/bizsys/bizsysEdit?sys_id=' + id;
    }
    function deleteBizsys(id) {
    	layer.confirm('删除确认', '', function() {
    	  $.ajax({
    		url:"/log/bizsys/bizsysDeleteInvoke?sys_id=" + id,
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
        $("#sysName").val('');
        getData(1);
    }
  </script>
</html>