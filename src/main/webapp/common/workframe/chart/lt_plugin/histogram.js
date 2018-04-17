/**
 * 创建于:2014-9-15<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 柱状图分装
 * @author chender
 * @version 1.0.0
 */
LT.Histogram=new function(){
	var me={};
	me.create=function(elementId,setting){
		me.elementId=elementId;
		me.setting=setting;
		return me;
	}
	me.build=function(){
		var param={title:"请设置title属性",yLabel:"请设置yLabel属性",tooltip:["百分比","%"],colNames:[],datas:[]};
		$.extend(param,me.setting);
		$('#'+me.elementId).highcharts({
	        chart: {
	            type: 'column',
	            margin: [ 50, 50, 100, 80]
	        },
	        plotOptions:{
	    		column:{
	    			borderColor: "",
	                shadow: false,
	    	        dataLabels:{
	    				enabled : true,
	    				color : 'blue',
	    				style : {
	    					fontWeight : 'bold'
	    				},
	    				formatter : function() {
	    					return this.y + param.tooltip[1];
	    				}			
	    	         }
	    		}
	    	},
	        title: {
	            text: param.title
	        },
	        xAxis: {
	            categories: param.colNames,
	            labels: {
	                rotation: -45,
	                align: 'right',
	                style: {
	                    fontSize: '13px',
	                    fontFamily: 'Verdana, sans-serif'
	                }
	            }
	        },
	        yAxis: {
	            min: 0,
	     
	            title: {
	                text: param.yLabel
	            }
	        },
	        legend: {
	            enabled: false
	        },
	        tooltip: {
	        	headerFormat: '<span style="font-size: 10px">{point.series.name}</span><br/>',
	            pointFormat: param.tooltip[0]+'：<b>{point.y}</b>'+param.tooltip[1]
	        },
	        series: param.datas
	    });
		return me;
	}
	return me;
	
}