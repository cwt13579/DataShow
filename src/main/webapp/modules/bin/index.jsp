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
		         <div class="panel-heading"><span class="glyphicon glyphicon-th-list"></span>个人全国排名</div>
					  <div class="panel-body" id="echart_user_top10_panel">
		                      <div id="echart_user_top10" style="height: 250px;"></div>
		              </div>
		     </div>
		</div>
		<div class="row">
		     <div class="panel panel-default">
		         <div class="panel-heading"><span class="glyphicon glyphicon-th-list"></span>机构全国排名</div>
					  <div class="panel-body" id="echart_lib_dept_panel">
		                      <div id="echart_lib_dept" style="height: 250px;"></div>
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
	  
	  getTop10();
	  getAllOrg();
  });
  function getTop10() {
	  $("#echart_user_top10_panel").showLoading();
	  $.ajax({
			url : "/getTop10",
			method : "post",
			data :  {},
			beforeSend : function() {
				$('.img_loading').show();
				$('.btn_loading').attr('disabled', true);
			},
			success : function(data) {
				if(data && data.code){
					// 后台正常处理，未出异常
					if(data.code==1){
						var userArr = data.data.userList;
						var scoreArr = data.data.scoreList;
						init_echart_user_top10(userArr,scoreArr);
						$("#echart_user_top10_panel").hideLoading();
					} else {
						 layer.msg("获取数据失败");
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

  function getAllOrg() {
	  $("#echart_lib_dept_panel").showLoading();
	  $.ajax({
			url : "/getAllOrg",
			method : "post",
			data :  {},
			beforeSend : function() {
				$('.img_loading').show();
				$('.btn_loading').attr('disabled', true);
			},
			success : function(data) {
				if(data && data.code){
					// 后台正常处理，未出异常
					if(data.code==1){
						var orgArr = data.data.orgList;
						var scoreArr = data.data.scoreList;
						init_echart_lib_dept(orgArr,scoreArr);
						$("#echart_lib_dept_panel").hideLoading();
					} else {
						 layer.msg("获取数据失败");
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
  function init_echart_user_top10(xArr,yArr) {
	  option = {
			    title : {
			        text: '个人全国排名'
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    toolbox: {
			        show : true,
			        feature : {
			            mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            magicType : {show: true, type: ['line', 'bar']},
			            restore : {show: true},
			            saveAsImage : {show: true}
			        }
			    },
			    calculable : true,
			    xAxis : [
			        {
			            type : 'category',
			            data : xArr
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'综合评分',
			            type:'bar',
			            data: yArr,
			            markPoint : {
			                data : [
			                    {type : 'max', name: '最大值'},
			                    {type : 'min', name: '最小值'}
			                ]
			            },
			            markLine : {
			                data : [
			                    {type : 'average', name: '平均值'}
			                ]
			            }
			        }
			    ]
			};
	  
	  var myChart = echarts.init(document.getElementById('echart_user_top10')); 
	  myChart.setOption(option); 
			                    
  }
  function init_echart_lib_dept(orgArr,scoreArr) {
	  option = {
			    title : {
			        text: '机构全国排名'
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    toolbox: {
			        show : true,
			        feature : {
			            mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            magicType : {show: true, type: ['line', 'bar']},
			            restore : {show: true},
			            saveAsImage : {show: true}
			        }
			    },
			    calculable : true,
			    xAxis : [
			        {
			            type : 'category',
			            data : orgArr,
			            //设置字体倾斜  
	                    axisLabel:{  
	                        interval:0,  
	                        rotate:35,//倾斜度 -90 至 90 默认为0  
	                        margin:3,  
	                        textStyle:{  
	                            fontWeight:"bolder",  
	                            color:"#000000"  
	                        }  
	                    }
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'综合评分',
			            type:'bar',
			            data: scoreArr,
			            markPoint : {
			                data : [
			                    {type : 'max', name: '最大值'},
			                    {type : 'min', name: '最小值'}
			                ]
			            },
			            markLine : {
			                data : [
			                    {type : 'average', name: '平均值'}
			                ]
			            }
			        }
			    ]
			};
	  
	  var myChart = echarts.init(document.getElementById('echart_lib_dept')); 
	  myChart.setOption(option); 
			                    
  }
  </script>
</html>
