<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>产品管理平台</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link href="/common/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/common/loading/css/showLoading.css">
  </head>
  <body>
 <%@ include file="/modules/common/header.jsp"%>
 <div class="container-fluid">
	   <div class="row page-header">
			<div class="col-xs-3">
				<h4><span class="glyphicon glyphicon-th"></span></h4>
			</div>
		</div>
		<div class="row">
		     <div class="panel panel-default">
		         <div class="panel-heading"><span class="glyphicon glyphicon-th-list"></span></div>
					  <div class="panel-body" id="echart_lib_io_top10_panel">
		                      <div id="echart_lib_io_top10" style="height: 250px;"></div>
		              </div>
		     </div>
		</div>
		<div class="row">
		     <div class="panel panel-default">
		         <div class="panel-heading"><span class="glyphicon glyphicon-th-list"></span>产品规则</div>
					  <div class="panel-body" id="echart_lib_dept_io_top10_panel">
		                      <div id="echart_lib_dept_io_top10" style="height: 250px;"></div>
		              </div>
		     </div>
		</div>
  </div>
</body>
  <script src="/common/js/jquery-1.10.2.min.js"></script>
  <script src="/common/bootstrap/js/bootstrap.min.js"></script>
  <script src="/common/chart/echarts-plain.js"></script>
  <script src="/common/loading/js/jquery.showLoading.min.js"></script>
  <script type="text/javascript">
  $(document).ready(function(){
	  //getLibIOTop10Data();
	  //init_echart_lib_dept_io_top10();
  });
  </script>
</html>
