function viewActivity(id){
	$.ajax({
		type : "POST",
		url : "modules/activity/findActivityEditPage",
		data : {activityId: id},
		dataType: "json",
		success : function(data) {
			if(data.body){
				location.href=BF.getBasePath() + "/" + data.body + "?activityId="+id + "&view=true";		
			}else{
				location.href=BF.getModulePath("activity")+"create.html?activityId="+id + "&view=true";			
			}
		}
	});
}
$(function	() {

	var ChannelData = {};
    /*计算top的5个模块的宽度*/
    function setWidth() {
        var modalWidth = ($("#mainBox").width() - 23 * 4 ) / 5 - 10;
        $(".main-div").css('width', modalWidth + 'px');
    }
    var monthArray={'jan':1, 'feb':2, 'mar':3, 'apr':4, 
    		'may':5, 'jun':6, 'jul':7, 'aug':8, 'sep':9, 'oct':10, 'nov':11, 'dec':12};

	function fmtDate(date){
		if(date){
			date = date.toLowerCase();
			var t = date.split(",");
			if(t.length==2){
				var months = t[0].split(" ");
				var t1 = t[1].replace(/(^\s*)|(\s*$)/g, ""); 
				var years = t1.split(" ");
				var year = years[0];
				var apm = years[2];
				var month = monthArray[months[0]];
				var day = months[1];
				var times = years[1].split(":");
				var hour = times[0];
				var mm = times[1];
				var ss = times[2];
				if(apm=='pm'){
					hour = parseInt(hour) + 12;
				}
				var newtimes = hour +":"+mm+":"+ss;
				var newDate = year+"-"+month+"-" +day+" "+newtimes;
				return newDate;
			}
		}
		return date;
	}
    setWidth();

    /*折线图*/

    var lineChartData = {};
    //加载渠道统计
    function loadChannelStatis(){
    	$.ajax({
    		type : "POST",
    		url : "modules/channel/channelStatis",
    		success : function(data) {
    			var dataObj = data.response;
    			if(dataObj){
    				$("#useChannelName").html(getChannelName(dataObj.useChannel));//当前渠道
    				//5个模块的数字的动画显示
    		        var currentUser = dataObj.activityTotal;//正在进行的活动
    		        $({numberValue: 0}).animate({numberValue: currentUser}, {
    		            duration: 2500,
    		            easing: 'linear',
    		            step: function() {
    		                $('#userCount').text(Math.ceil(this.numberValue));
    		            },
    		            done:function(){
    		                $('#userCount').text(currentUser);
    		            }
    		        });
    		        var currentOrder = dataObj.decpageTotal;//专题;
    		        $({numberValue: 0}).animate({numberValue: currentOrder}, {
    		            duration: 2500,
    		            easing: 'linear',
    		            step: function() {
    		                $('#orderCount').text(Math.ceil(this.numberValue));
    		            },
    		            done:function(){
    		                $('#orderCount').text(currentOrder);
    		            }
    		        });
    		        
    				var  currentUserCard = dataObj.couponTotal;//优惠券
    				if(currentUserCard){
				        $({numberValue:0}).animate({numberValue:currentUserCard},{
				            duration:2500,
				            easing:'linear',
				            step:function () {
				                $("#userCard").text(Math.ceil(this.numberValue));
				            },
				            done:function () {
				                $("#userCard").text(currentUserCard);
				            }
				        });
    				}
    				
    				var currentVisitor = dataObj.auditTotal;//待审批 
    		        $({numberValue: 0}).animate({numberValue: currentVisitor}, {
    		            duration: 2500,
    		            easing: 'linear',
    		            step: function() {
    		                $('#visitorCount').text(Math.ceil(this.numberValue));
    		            },
    		            done:function(){
    		                $('#visitorCount').text(currentVisitor);
    		            }
    		        });
    		        var activityMonth = dataObj.activityMonth;
    		        var xdata=[];
    		        var ydata=[];
    		        for(var key in activityMonth){
    					 var total = activityMonth[key];
    		        	 xdata.push(key);
    		        	 ydata.push(total);
    				 }
    		        lineChartData = {'name':'活动开展次数',
		                'x_data':{'name':'','data':xdata},
		                'y_data':{'name':'活动开展次数','data':ydata}
		            };
    		        makeLineChart(lineChartData);
    		        var myAuditData = dataObj.myAuditList;
    		        initWaitData(myAuditData);
    		        
    		        var timeOutActivity = dataObj.timeOutActivity;
    		        initNoticeData(timeOutActivity);
    			}
    		}
    	});
    }
    
    //加载专题渠道统计
    function loadDecpageStatis(){
    	$.ajax({
    		type : "POST",
    		url : BF.getBasePath()+"/modules/dec/page/statis",
    		success : function(data) {
    			var dataObj = data.response;
    			if(dataObj){
    		        var currentOrder = dataObj.decpageTotal;//专题;
    		        $({numberValue: 0}).animate({numberValue: currentOrder}, {
    		            duration: 2500,
    		            easing: 'linear',
    		            step: function() {
    		                $('#orderCount').text(Math.ceil(this.numberValue));
    		            },
    		            done:function(){
    		                $('#orderCount').text(currentOrder);
    		            }
    		        });    		        
    			}
    		}
    	});
    }
    
    $.ajax({
		type : "POST",
		url : BF.getBasePath()+"/modules/channel/list",
		async: false,
		success : function(data) {
			var json = eval('('+data+')');
			ChannelData = json.data;
		}
	});
	
	 function getChannelName(channelId){
		 if(channelId){
			 for(var i in ChannelData){
				 var id = ChannelData[i].id;//渠道ID对应
				 if(channelId==id){
					 return  ChannelData[i].channelName;//渠道名称
				 }
			 }
			 return channelId;
		 }
		 return "";
	 }
    function init(){
    	loadChannelStatis();
    	loadDecpageStatis();
    	loadMarketToolStatis();
    }
    init();
    /*待我审核的数据 数据格式可自己变*/
    var waitLookData = [
        /*{'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''}*/
    ];
    

    function initWaitData(waitLookData) {
        var waitHtml='';
        if(waitLookData!=null &&  waitLookData!='null'){
	        var len = waitLookData.length;
	        if(len>0){
		        for(var i=0;i<len;i++){
		        	var lnkUrl = 'modules/audit/list.html?id='+waitLookData[i].id;
		            waitHtml +='<li><a href="'+lnkUrl+'">'+
		                '<div class="row">'+
		                '<div class="col-md-4 text">'+waitLookData[i].title+'</div>'+
		                '<div class="col-md-4 text-center text">'+fmtDate(waitLookData[i].createTime)+'</div>'+
		                '<div class="col-md-4 text-right"><a href="'+lnkUrl+'" class="btn btn-link btn-sm">查看</a></div>'+
		                '</div>'+
		                '</a></li>';
		        }
		        $("#waitDataBox").html(waitHtml);
	        }else {
                //无数据，显示无数据的
                $("#waitDataBox").next('.show-noData').show();

            }
        }
    }
    //initWaitData(waitLookData);
    
    

   

    /*到期提醒的数据，数据格式可自己变*/
    var noticeData = [
        /*{'name':'AR抓蝴蝶','noticeType':'营销工具','linkeUrl':''},
        {'name':'助力蓝马满500减100','noticeType':'营销工具','linkeUrl':''},
        {'name':'城市接力满100超过了15个字了啦啦啦啦啦了阿联啦啊','noticeType':'优惠券活动','linkeUrl':''},
        {'name':'城市接力满100超过了15个字了啦啦啦啦啦了阿联啦啊','noticeType':'营销工具','linkeUrl':''},
        {'name':'AR抓蝴蝶','noticeType':'营销工具','linkeUrl':''},
        {'name':'城市接力满100超过了15个字了啦啦啦啦啦了阿联啦啊','noticeType':'优惠券活动','linkeUrl':''},
        {'name':'AR抓蝴蝶','noticeType':'优惠券活动','linkeUrl':''},
        {'name':'城市接力满100超过了15个字了啦啦啦啦啦了阿联啦啊','noticeType':'营销工具','linkeUrl':''},
        {'name':'AR抓蝴蝶','noticeType':'优惠券活动','linkeUrl':''}*/
    ];
    function initNoticeData(noticeData) {
        var noticeHtml =  '';
        for (var i=0;i<noticeData.length;i++){
        	var id = noticeData[i].id;
            noticeHtml += ' <li><a href="#" onclick="viewActivity(\''+id+'\')" >'+
                '<div class="row">'+
                '<div class="col-md-10 col-sm-9 text">'+'【<span class="link-text">'+ noticeData[i].name +'</span>】即将结束'+
                '</div>'+
                '<div class="col-md-2 col-md-3 text-right">'+
                '<a href="#" onclick="viewActivity(\''+id+'\')" class="btn btn-link btn-sm">查看</a>'+
                '</div>'+
                '</div>'+
                '</a></li>';
        }
        $("#noticeBox").html(noticeHtml);
        if(noticeData.length <= 0){
            //无数据，显示无数据的
            $("#noticeBox").next('.show-noData').show();
        }
    }
    //initNoticeData(noticeData);

    


    function makeLineChart(da) {
    	if(!da|| !da.x_data||!da.y_data){
    		return ;
    	}
        var lineChart = echarts.init(document.getElementById('placeholder'));
        var option = {
            title: {

            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {

            },
            toolbox: {

            },
            grid: {
                left: '1%',
                right: '7%',
                bottom: '1%',
                containLabel: true,
                show: true,
                backgroundColor:'#f5f5f5'
            },
            xAxis : [
                {
                    name:da.x_data.name,
                    type : 'category',
                    boundaryGap : false,
                    splitLine: {
                        show: true
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#595959'
                        }
                    },
                    data : da.x_data.data
                }
            ],
            yAxis : [
                {
                    name:da.y_data.name,
                    splitLine: {
                        show: true
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#595959'
                        }
                    },
                    type : 'value'
                }
            ],
            series : [
                {
                    name:da.y_data.name,
                    type:'line',
                    stack: '总数',
                    itemStyle: {
                        normal: {
                            color: '#5ec6f9'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#60c7f9'
                            }, {
                                offset: 1,
                                color: '#fff'
                            }])
                        }
                    },
                    symbolSize: 7,
                    data:da.y_data.data
                }
            ]
        };
        lineChart.setOption(option);
    }



    var dataColor ={
        'inColor':['#e2ca7b','#c8aba3','#89d5e4','#ff948c',
                   '#8fc6ac','#aacf74','#5cc5f9','#d6b5e4','#d7b5e4','#d8b5e4','#d9b5e4'],
        'outColor':['#e2ca7b','#c8aba3','#89d5e4','#ff948c',
            '#8fc6ac','#aacf74','#5cc5f9','#d6b5e4','#d7b5e4','#d8b5e4','#d9b5e4']
    };
    
    var toolArray = {
    		'1':'互动营销',
    		'2':'趣味营销',
    		'3':'节日营销',
    		'4':'营销工具'
    };

    var cricleChartData = {
    		'inData':[],
    		'outData':[]
    }
    //加载营销工具统计
    function loadMarketToolStatis(){
    	$.ajax({
    		type : "POST",
    		url : "modules/mt/statis",
    		success : function(data) {
    			var dataObj = data.response;
    			if(dataObj){
    				var marketToolList = dataObj.marketToolList;
    				if(marketToolList!=null && marketToolList!='null'){
    					var len = marketToolList.length;
    					var inDataArray = [];
    					var outDataArray = [];
    					var typeArray = {};
    					var selected = true;
    					for(var i=0;i<len;i++){
    						var item = marketToolList[i];
    						var id = item.id;
    						var type = item.type;
    						var name = item.name;
    						var total = item.createTime;//
    						var tmp = typeArray[type];
    						if(!tmp){
    							typeArray[type] = 0;
    						}
    						var sum = typeArray[type]+total;
    						typeArray[type] = sum;
    						var outItem = {
    								value: total, 
    								name: name,
    				                itemStyle: {
    				                    normal: {
    				                        color: dataColor.outColor[i]
    				                    }
    				                },
    				                selected: selected
    				               };
    						selected = false;
    						outDataArray.push(outItem);
    					}
    					
    					for(var i in typeArray){ 
    						var name  = toolArray[i];
    						if(name){
    							var total = typeArray[i];
	    						var inItem = {
	    								value: total, 
	    								name: name,
	    				                itemStyle: {
	    				                    normal: {
	    				                        color: dataColor.inColor[i]
	    				                    }
	    				                },
	    				                selected: selected
	    				               };
	    						inDataArray.push(inItem);
    						}
    					}
    					
    					cricleChartData.inData = inDataArray;
    					cricleChartData.outData = outDataArray;
    					
    					makeCricleChart(cricleChartData);
    				}
    				
    			}
    		}
    	});
    }
    /*圆形图
    var cricleChartData ={
        'inData':[
            {value:335, name:'分享类',
                itemStyle: {
                    normal: {
                        color: dataColor.inColor[0]
                    }
                },
                selected:true},
            {value:679, name:'互动类',
                itemStyle: {
                    normal: {
                        color: dataColor.inColor[1]
                    }
                }
            },
            {value:1548, name:'游戏类',
                itemStyle: {
                    normal: {
                        color: dataColor.inColor[2]
                    }
                }
            }],
        'outData':[
            {value:335, name:'AR抓蝴蝶',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[0]
                    }
                }
            },
            {value:310, name:'躲炸弹',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[1]
                    }
                }
            },
            {value:234, name:'接力棒',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[2]
                    }
                }
            },
            {value:135, name:'搭配套餐',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[3]
                    }
                }
            },
            {value:105, name:'多人拼团',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[4]
                    }
                }
            }]
    };*/

    function  makeCricleChart(da) {
        var cricleChart = echarts.init(document.getElementById('donutChart'));

       var  criOption = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {

            },
           grid: {
               left: '1%',
               right: '1%',
               bottom: '1%',
               containLabel: true
           },
            series: [
                {
                    name:'营销工具组',
                    type:'pie',
                    selectedMode: 'single',
                    radius: [0, '30%'],

                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:da.inData
                },
                {
                    name:'营销工具',
                    type:'pie',
                    radius: ['40%', '55%'],

                    data:da.outData
                }
            ]
        };
        cricleChart.setOption(criOption);


        /*延迟加载线条的图表，防止两个图表同时加载时出现一个无法显示*/
        setTimeout(function () {
            makeLineChart(lineChartData);
        },800)
    }




    //makeCricleChart(cricleChartData);




    //点击屏幕变化按钮时，图表发生变化
    $('.navbar-toggle').click(function()	{
        setTimeout(function() {
            //图表重写数据
            makeLineChart(lineChartData);
            makeCricleChart(cricleChartData);

        },500);
    });

    $('.size-toggle').click(function()	{
        setTimeout(function() {
            //图表重写数据

            makeLineChart(lineChartData);
            makeCricleChart(cricleChartData);

        },500);
    });


    /*屏幕发生变化的时候*/
    $(window).resize(function(e){
        setWidth();
        //resize morris chart
        setTimeout(function() {
            //图表重写数据

            makeLineChart(lineChartData);
            makeCricleChart(cricleChartData);

        },500);
    });

    $(window).load(function(e)	{

//        //5个模块的数字的动画显示
//        var currentUser = parseInt($('#userCount').attr('data-finNum'));
//        $({numberValue: 0}).animate({numberValue: currentUser}, {
//            duration: 2500,
//            easing: 'linear',
//            step: function() {
//                $('#userCount').text(Math.ceil(this.numberValue));
//            },
//            done:function(){
//                $('#userCount').text(currentUser);
//            }
//        });

        var currentServerload =parseInt($('#serverloadCount').attr('data-finNum')) ;
        $({numberValue: 0}).animate({numberValue: currentServerload}, {
            duration: 2500,
            easing: 'linear',
            step: function() {
                $('#serverloadCount').text(Math.ceil(this.numberValue));
            },
            done:function(){
                $('#serverloadCount').text(currentServerload);
            }
        });

//        var currentOrder = parseInt($('#orderCount').attr('data-finNum'));
//        $({numberValue: 0}).animate({numberValue: currentOrder}, {
//            duration: 2500,
//            easing: 'linear',
//            step: function() {
//                $('#orderCount').text(Math.ceil(this.numberValue));
//            },
//            done:function(){
//                $('#orderCount').text(currentOrder);
//            }
//        });

//        var currentVisitor = parseInt($('#visitorCount').attr('data-finNum')) ;
//        $({numberValue: 0}).animate({numberValue: currentVisitor}, {
//            duration: 2500,
//            easing: 'linear',
//            step: function() {
//                $('#visitorCount').text(Math.ceil(this.numberValue));
//            },
//            done:function(){
//                $('#visitorCount').text(currentVisitor);
//            }
//        });
//        var  currentUserCard = parseInt($("#userCard").attr('data-finNum'));
//        $({numberValue:0}).animate({numberValue:currentUserCard},{
//            duration:2500,
//            easing:'linear',
//            step:function () {
//                $("#userCard").text(Math.ceil(this.numberValue));
//            },
//            done:function () {
//                $("#userCard").text(currentUserCard);
//            }
//        })


    });


});