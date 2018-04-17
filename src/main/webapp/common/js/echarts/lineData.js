option = {
    title: {
        text: '堆叠区域图'
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
        data:['邮件营销']
    },
    toolbox: {

    },
    grid: {
        left: '3%',
        right: '7%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            name:'月数',
            type : 'category',
            boundaryGap : false,
            splitLine: {
                show: true
            },
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            name:'活动开展次数',
            splitLine: {
                show: true
            },
            type : 'value'
        }
    ],
    series : [
        {
            name:'邮件营销',
            type:'line',
            stack: '总量',
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
            data:[120, 132, 101, 134, 90, 230, 210]
        }
    ]
};
