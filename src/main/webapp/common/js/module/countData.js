$(function () {

    /*参与人次的统计图*/
    var personNumData = {
        'time':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        'joinPerson':[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        'joinTime':[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]};

    var personNumDetail1 = {
        'time':['1:00-2:00','2:00-3:00','3:00-4:00','4:00-5:00','5:00-6:00','6:00-7:00','7:00-8:00','8:00-9:00','9:00-10:00','10:00-11:00'],
        'joinPerson':[2.0, 6.9, 1.0, 23.2, 23.6, 6.7, 135.6, 132.2, 32.6, 20.0],
        'joinTime':[2.6, 5.9, 9.0, 1.4, 28.7, 4.7, 175.6, 102.2, 148.7, 118.8]};
    var personNumDetail2 = {
        'time':['1:00-2:00','2:00-3:00','3:00-4:00','4:00-5:00','5:00-6:00','6:00-7:00','7:00-8:00','8:00-9:00','9:00-10:00','10:00-11:00'],
        'joinPerson':[2.0, 6.9, 12.0, 24.2, 23.6, 6.7, 15.6, 102.2, 2.6, 20.0],
        'joinTime':[2.6, 5.9, 9.0, 12.4, 28.7, 44.7, 75.6, 12.2, 148.7, 18.8]};

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


        PersonNumChart.on('click', function (params) {
            console.log(params);
            //查找的是下面的时间节点   来查找下个表格的数据
            var clickName = params.name;
            //模拟数据使用，无任何用处，根据自己的数据来请求数据
            if(clickName == '1月' || clickName == '3月' || clickName == '5月' || clickName == '7月'){
                makePersonNumDetailData(personNumDetail1);
            }else {
                makePersonNumDetailData(personNumDetail2);
            }
        });

    }
    makePersonNumData(personNumData);

    /*统计人数与人次的图表*/
    function makePersonNumDetailData(da) {
            var personNumDetailChart = echarts.init(document.getElementById('personNumDetailData'));
            var  personNumDetailOption = {
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

            personNumDetailChart.setOption(personNumDetailOption);



    }


    /*优惠券的图表*/
    var CouponData = {
        'time':['6月1日','6月2日','6月3日','6月4日','6月5日','6月6日','6月7日'],
        'count':[
            {'name':'手机银行','data':[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6]},
            {'name':'百合生活','data':[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6]},
            {'name':'','data':[]}
        ]
    };
    function makeCouponData(da) {
        var CouponChart = echarts.init(document.getElementById('couponData'));
        var  CouponOption = {
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
                    name:'优惠券发放数',
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
                    name: da.count[0].name,
                    type:'bar',
                    barGap:0,
                    itemStyle: {
                        normal: {
                            color: '#d7b7e5'
                        }
                    },
                    data: da.count[0].data

                },
                {
                    name: da.count[1].name,
                    type:'bar',
                    itemStyle: {
                        normal: {
                            color: '#87d5e4'
                        }
                    },
                    data: da.count[1].data
                },
                {
                    name: da.count[2].name,
                    type:'bar',
                    itemStyle: {
                        normal: {
                            color: '#abdaac'
                        }
                    },
                    data: da.count[2].data
                }
            ]
        };

        CouponChart.setOption(CouponOption);




        var countLineHtml = '';
        for (var i=0;i<da.count.length;i++){
            if(da.count[i].name && da.count[i].data.length>0){
                countLineHtml += '<span class="count-line"><span class="count-line'+i+'"></span>'+ da.count[i].name +'</span>';
            }
        }
        $("#couponData_line").html(countLineHtml);
    }
    makeCouponData(CouponData);


    /*文字集齐人数图表*/
    var TextData = {
        'text':['兰','州','银','行','二','十','年'],
        'count':[
            {'name':'手机银行','data':[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6]},
            {'name':'百合生活','data':[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6]},
            {'name':'','data':[]}
        ]
    };
    function makeTextData(da) {
        var TextDataChart = echarts.init(document.getElementById('textData'));
        var  TextDataOption = {
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
                    name:'文字',
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
                    data : da.text
                }
            ],
            yAxis : [
                {
                    name:'文字集齐人数',
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
                    name: da.count[0].name,
                    type:'bar',
                    barGap:0,
                    itemStyle: {
                        normal: {
                            color: '#d7b7e5'
                        }
                    },
                    data: da.count[0].data

                },
                {
                    name: da.count[1].name,
                    type:'bar',
                    itemStyle: {
                        normal: {
                            color: '#87d5e4'
                        }
                    },
                    data: da.count[1].data
                },
                {
                    name: da.count[2].name,
                    type:'bar',
                    itemStyle: {
                        normal: {
                            color: '#abdaac'
                        }
                    },
                    data: da.count[2].data
                }
            ]
        };

        TextDataChart.setOption(TextDataOption);




        var textDataLineHtml = '';
        for (var i=0;i<da.count.length;i++){
            if(da.count[i].name && da.count[i].data.length>0){
                textDataLineHtml += '<span class="count-line"><span class="count-line'+i+'"></span>'+ da.count[i].name +'</span>';
            }
        }
        $("#textData_line").html(textDataLineHtml);
    }
    makeTextData(TextData);

    /*文字集齐人数明细图表*/
    var TextDetailData = {
        'time':['6月1日','6月2日','6月3日','6月4日','6月5日','6月6日','6月7日'],
        'count':[
            {'name':'手机银行','data':[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6]},
            {'name':'百合生活','data':[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6]},
            {'name':'','data':[]}
        ]
    };
    function makeTextDetailData(da) {
        var TextDetailDataChart = echarts.init(document.getElementById('textDetailData'));
        var  TextDetailDataOption = {
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
                    name:'文字集齐人数',
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
                    name: da.count[0].name,
                    type:'bar',
                    barGap:0,
                    itemStyle: {
                        normal: {
                            color: '#d7b7e5'
                        }
                    },
                    data: da.count[0].data

                },
                {
                    name: da.count[1].name,
                    type:'bar',
                    itemStyle: {
                        normal: {
                            color: '#87d5e4'
                        }
                    },
                    data: da.count[1].data
                },
                {
                    name: da.count[2].name,
                    type:'bar',
                    itemStyle: {
                        normal: {
                            color: '#abdaac'
                        }
                    },
                    data: da.count[2].data
                }
            ]
        };

        TextDetailDataChart.setOption(TextDetailDataOption);




        var textDetailDataLineHtml = '';
        for (var i=0;i<da.count.length;i++){
            if(da.count[i].name && da.count[i].data.length>0){
                textDetailDataLineHtml += '<span class="count-line"><span class="count-line'+i+'"></span>'+ da.count[i].name +'</span>';
            }
        }
        $("#textDetailData_line").html(textDetailDataLineHtml);
    }
    makeTextDetailData(TextDetailData);



    var dataColor ={
        'inColor':['#e8d595','#ffa9a4','#80d0fa'],
        'outColor':['#e2ca7b','#c8aba3','#89d5e4','#ff948c',
            '#8fc6ac','#aacf74','#5cc5f9','#d6b5e4']
    };

    /*优惠券发放的明细图表*/
    var couponDetail ={
        'inData':[
            {value:335, name:'25元',
                itemStyle: {
                    normal: {
                        color: dataColor.inColor[0]
                    }
                },
                selected:true},
            {value:679, name:'30元',
                itemStyle: {
                    normal: {
                        color: dataColor.inColor[1]
                    }
                }
            },
            {value:1548, name:'5元',
                itemStyle: {
                    normal: {
                        color: dataColor.inColor[3]
                    }
                }
            }],
        'outData':[
            {value:335, name:'30元',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[0]
                    }
                }
            },
            {value:310, name:'80元',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[1]
                    }
                }
            },
            {value:234, name:'20元',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[2]
                    }
                }
            },
            {value:135, name:'60元',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[3]
                    }
                }
            },
            {value:105, name:'1元',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[4]
                    }
                }
            },
            {value:251, name:'5元',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[5]
                    }
                }
            },
            {value:147, name:'10元',
                itemStyle: {
                    normal: {
                        color: dataColor.outColor[6]
                    }
                }
            },
            {value:102, name:'90元',
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
                    name:'发放情况',
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
                    name:'使用情况',
                    type:'pie',
                    radius: ['40%', '55%'],

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
            makeCouponData(CouponData);
            makeTextData(TextData);
            makeTextDetailData(TextDetailData);
            makecouponDetailData(couponDetail);

        },500);
    });

    $('.size-toggle').click(function()	{
        setTimeout(function() {
            //图表重写数据

            makePersonNumData(personNumData);
            makeCouponData(CouponData);
            makeTextData(TextData);
            makeTextDetailData(TextDetailData);
            makecouponDetailData(couponDetail);

        },500);
    });


    /*屏幕发生变化的时候*/
    $(window).resize(function(e){
        //resize morris chart
        setTimeout(function() {
            //图表重写数据

            makePersonNumData(personNumData);
            makeCouponData(CouponData);
            makeTextData(TextData);
            makeTextDetailData(TextDetailData);
            makecouponDetailData(couponDetail);

        },500);
    });

});