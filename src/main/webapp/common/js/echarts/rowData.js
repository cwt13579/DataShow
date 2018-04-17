option = {
    title : {
        text: '某地区蒸发量和降水量',
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['蒸发量','降水量']
    },
    toolbox: {

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
            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
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
            name:'蒸发量',
            type:'bar',
            barGap:0,
            itemStyle: {
                normal: {
                    color: '#5ec6f9'
                }
            },
            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]

        },
        {
            name:'降水量',
            type:'bar',
            itemStyle: {
                normal: {
                    color: '#abdaac'
                }
            },
            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]


        }
    ]
};
