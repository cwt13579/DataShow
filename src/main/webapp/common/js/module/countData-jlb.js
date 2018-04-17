$(function () {

    /*参与人次的统计图*/
    var personNumData = {
        'time':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        'joinPerson':[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        'joinTime':[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
    }

    function makePersonNumData(da) {
        var PersonNumChart = echarts.init(document.getElementById('personNumData'));
        var  PersonNumOption = {
            title : {

            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {

            },
            toolbox: {

            },
            grid: {
                left: '3%',
                right: '7%',
                bottom: '3%',
                containLabel: true
            },
            calculable : true,
            xAxis : [
                {
                    name:'时间',
                    type : 'category',
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
                    data : da.time
                }
            ],
            yAxis : [
                {
                    name:'参与人数',
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
                    name:'参与人次',
                    type:'bar',
                    barGap:0,
                    itemStyle: {
                        normal: {
                            color: '#5ec6f9'
                        }
                    },
                    data: da.joinPerson

                },
                {
                    name:'参与人数',
                    type:'bar',
                    itemStyle: {
                        normal: {
                            color: '#abdaac'
                        }
                    },
                    data: da.joinTime


                }
            ]
        };

        PersonNumChart.setOption(PersonNumOption);

    }
    makePersonNumData(personNumData);




    /*领奖情况*/
    var awardData = {
        'text':['火星店','兰州店','奔驰店','奥迪店','耐克店','达斯店','本家店'],
        'count':[
            {'name':'已领取','data':[320, 302, 301, 334, 390, 330, 320]},
            {'name':'剩余','data':[21, 43, 67, 156, 234, 564, 123]},
        ]
    };
    function makeAwardData(da) {
        var AwardDataChart = echarts.init(document.getElementById('awardData'));

        var  awardDataOption = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis:  {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: da.text
            },
            series: [
                {
                    name:  da.count[0].name,
                    type: 'bar',
                    barGap:0,
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#5ec6f9'
                        }
                    },
                    data: da.count[0].data
                },
                {
                    name: da.count[1].name,
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#abdaac'
                        }
                    },
                    data:da.count[1].data
                }



            ]
        };

        AwardDataChart.setOption(awardDataOption);


    }
    makeAwardData(awardData);



    var dataColor ={
        'inColor':['#e8d595','#ffa9a4','#80d0fa'],
        'outColor':['#e2ca7b','#c8aba3','#89d5e4','#ff948c',
            '#8fc6ac','#aacf74','#5cc5f9','#d6b5e4']
    };

    /*路线统计*/
    var couponDetail ={
        'outData':[
            {value:335, name:'路线1',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[0]
                    }
                }
            },
            {value:310, name:'路线2',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[1]
                    }
                }
            },
            {value:234, name:'路线3',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[2]
                    }
                }
            },
            {value:135, name:'路线4',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[3]
                    }
                }
            },
            {value:105, name:'路线5',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[4]
                    }
                }
            },
            {value:251, name:'路线6',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[5]
                    }
                }
            },
            {value:147, name:'路线7',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[6]
                    }
                }
            },
            {value:102, name:'路线8',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[7]
                    }
                }
            }]
    };

    function  makecouponDetailData(da) {
        var couponDetailDataChart = echarts.init(document.getElementById('couponDetailData'));

        var  couponDetailDataOption = {
            title : {
                text: '路线统计',
                x:'left'
            },
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
                    name:'路线统计',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:da.outData
                }
            ]
        };
        couponDetailDataChart.setOption(couponDetailDataOption);
    }

    makecouponDetailData(couponDetail);



    //点击屏幕变化按钮时，图表发生变化
    $('.navbar-toggle').click(function()	{
        setTimeout(function() {
            //图表重写数据
            makePersonNumData(personNumData);
            makeAwardData(awardData);
            makecouponDetailData(couponDetail);

        },500);
    });

    $('.size-toggle').click(function()	{
        setTimeout(function() {
            //图表重写数据

            makePersonNumData(personNumData);
            makeAwardData(awardData);
            makecouponDetailData(couponDetail);

        },500);
    });


    /*屏幕发生变化的时候*/
    $(window).resize(function(e){
        //resize morris chart
        setTimeout(function() {
            //图表重写数据

            makePersonNumData(personNumData);
            makeAwardData(awardData);
            makecouponDetailData(couponDetail);

        },500);
    });

});