<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>图书馆出入记录</title>
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
				<h4><span class="glyphicon glyphicon-th"></span> 图书馆出入记录</h4>
			</div>
		</div>
		<div class="row">
				<div class="col-xs-12">
					<div class="panel panel-default">
						<div class="panel-body" style="background-color: #eeeeee;">
							<form id="search_form" method="post" class="form-inline">
								<div class="form-group">
									<label>用户账号</label> <input type="text" class="form-control"
										id="userName" name="qm.user_name"></input>
								</div>
								<div class="form-group">
									<label>起始时间</label> <input type="text" class="form-control"
										id="userName" name="qm.visit_time_gt"></input>
								</div>
								<div class="form-group">
									<label>截止时间</label> <input type="text" class="form-control"
										id="userName" name="qm.visit_time_lt"></input>
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
								<th>访问人</th>
								<th>访问人卡号</th>
								<th>所在部门</th>
								<th>访问编号</th>
								<th>访问时间</th>
				                <th>进出</th>
	 
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
		{{each hits as item}}
		<tr>
            <td>{{item.source.name}}</td>
            <td>{{item.source.cardid}}</td>
            <td>{{item.source.dept}}</td>
			<td>{{item.source.visitno}}</td>
			<td>{{item.source.visittime}}</td>
            <td>
               {{if item.source.direction==1}}
                  <span class="label label-success">进</span>
               {{else}}
    			   <span class="label label-default">出</span>
			   {{/if}}

            </td>
 
		</tr>
		{{/each}}
	</script>
</body>
  <script src="/common/js/jquery-1.10.2.min.js"></script>
  <script src="/common/bootstrap/js/bootstrap.min.js"></script>
  <script src="/common/tpl/template.js"></script>
  <script src="/common/p/p.js"></script>
  <script type="text/javascript">
    $(document).ready(function(){

		getData(1);
		$('#reload').click(function(){
			getData(1);
		});
	});
    function getData(index) {
	    $.ajax({
			url: "/tsg/getLibInOutListData?current=" + index,
			method:"post",
			data:$("#search_form").serialize(),
			dataType: "json",
			beforeSend : function() {
				$('#loading').show();
				$('.btn_loading').attr('disabled', true);
			},
			success: function(data){
				if(data && data.code) {
					if(data.code=="1") {
						console.log(data);
						var html = template('listScript', data.value);
						$('#listContainer').html(html);
						// 设置翻页控件
						$('#page').paginator({
							current_page : index,
							page_count : data.total/10,
							button_number : 5,
							total_count : data.total,
							page_size : 10,
							pager_click : function(page) {
								getData(page);
							}
						});
					} else {
						$.dialog.info(data.note);
					}
				} else {
					$.dialog.info("数据格式有误");
				}
				$('#loading').hide();
				$('.btn_loading').attr('disabled', false);
			},
			error: function(){
				$('.img_loading').hide();
				$('.btn_loading').attr('disabled', false);
				$.dialog.info("后台异常，未返回JSON数据");
			       }
			});
	      }
  
  
  </script>
</html>
