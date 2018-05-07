<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="modal fade" id="productRuleModel" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
      </div>
      <div class="modal-body">
		<div class="row">
				<div class="col-xs-12">
					<div class="panel panel-default">
						<div class="panel-body" style="background-color: #eeeeee;">
							<form id="search_form" method="post" class="form-inline">
								<div class="form-group">
									<label>规则名称</label> <input type="text" class="form-control"
										id="ruleName" name="qm.rule_name"></input>
								</div>
								<button type="button" class="btn btn-primary btn_loading"
									onclick="getDataModel(1);">
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
							    <th><input type="checkbox" onclick="$.util.checkbox_all(this,'ck1')"/></th>
								<th>规则编号</th>
								<th>规则名称</th>
								<th>借款人年龄</th>
								<th>借款人职业</th>
								<th>借款人房产</th>
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
            <td><input id="all" name="ck1" type="checkbox" value="{{item.id}}" /></td>
            <td>{{item.id}}</td>
            <td>{{item.rule_name}}</td>
            <td>{{item.loan_age}}</td>
            <td>{{item.loan_work}}</td>
            <td>{{item.loan_house}}</td>
		</tr>
		{{/each}}
	</script>
  <script src="/common/js/jquery-1.10.2.min.js"></script>
  <script src="/common/bootstrap/js/bootstrap.min.js"></script>
  <script src="/common/tpl/template.js"></script>
  <script src="/common/p/p.js"></script>
  <script src="/common/layer/layer.js"></script>
  <script src="/common/bin/js/app.js"></script>
  <script type="text/javascript">
    $(document).ready(function(){
		//getData(1);
		$('#reload').click(function(){
			getDataModel(1);
		});
		
	});
    function getDataModel(index) {
	    $.ajax({
			url: "/productRule/productRuleListInvoke?current=" + index,
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
								getDataModel(page);
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
  
    
    function clearCondition() {
        $("#ruleName").val('');
        getDataModel(1);
    }
  </script>
      </div>
    </div>
  </div>