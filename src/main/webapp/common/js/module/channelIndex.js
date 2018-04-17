$(function	()	{

    /*计算top的5个模块的宽度*/
    function  setWidth() {
        var modalWidth = ($("#mainBox").width() -23*4 )/5-10 ;
        $(".main-div").css('width', modalWidth+'px');
    }
    setWidth();

    //Flot Chart
    //Website traffic chart
    var data1 = { data: [[0, 5], [1, 8], [2, 5], [3, 8], [4, 7], [5,9], [6, 8], [7, 8], [8, 10], [9, 12], [10, 10]],
            label: "活动开展次数"
        },
        /*data2 = {data:[[0,4],[1,9],[2,5],[3,9],[4,9],[5,10],[6,5],[7,5],[8,2],[9,3],[10,1]],
         label: "获奖人数"
         },*/
        options = {
            series: {
                lines: {
                    show: true,
                    fill: true,
                    fillColor: 'rgba(165,213,239,0.2)'
                },
                points: {
                    show: true,
                    radius: '4.5'
                }
            },
            grid: {
                hoverable: true,
                clickable: true,
                /*color:'#e9e9e9',*/
                borderColor:'#fff',
                backgroundColor:'#f5f5f5'
            },
            colors: ["#6eaef0"]
        },
        plot;

    plot = $.plot($('#placeholder'), [data1], options);

    $("<div id='tooltip'></div>").css({
        position: "absolute",
        display: "none",
        border: "1px solid #222",
        padding: "4px",
        color: "#fff",
        "border-radius": "4px",
        "background-color": "rgb(0,0,0)",
        opacity: 0.90
    }).appendTo("body");

    $("#placeholder").bind("plothover", function (event, pos, item) {
        if( pos.x){
            var str = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
            $("#hoverdata").text(str);
        }


        if (item) {
            var x = item.datapoint[0],
                y = item.datapoint[1];

            $("#tooltip").html("Visitor : " + y)
                .css({top: item.pageY+5, left: item.pageX+5})
                .fadeIn(200);
        } else {
            $("#tooltip").hide();
        }
    });

    $("#placeholder").bind("plotclick", function (event, pos, item) {
        if (item) {
            $("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
            plot.highlight(item.series, item.datapoint);
        }
    });

    var animate = function () {
        $('#placeholder').animate( {tabIndex: 0}, {
            duration: 3000,
            step: function ( now, fx ) {

                var r = $.map( data1.data, function ( o ) {
                    return [[ o[0], o[1] * fx.pos ]];
                });
                /* var m = $.map( data2.data, function ( o ) {
                 return [[ o[0], o[1] * fx.pos ]];
                 });*/

                /*plot.setData( [{ data: r },{data:m}] );*/
                plot.setData( [{ data: r }] );
                plot.draw();
            }
        });
    };

    animate();

    //饼状图
    var donutChart = Morris.Donut({
        element: 'donutChart',
        data: [
            {label: "Download Sales", value: 1236},
            {label: "In-Store Sales", value: 3091},
            {label: "Mail-Order Sales", value: 2781}
        ],
        colors: ['#f3ce85','#65CEA7' ,'#FC8675']
    });

    //点击屏幕变化按钮时，图表发生变化
    $('.navbar-toggle').click(function()	{
        setTimeout(function() {
            /*$.plot($('#placeholder'), [data1,data2], options);*/
            $.plot($('#placeholder'), data1, options);
        },500);
    });

    $('.size-toggle').click(function()	{
        setTimeout(function() {
            $.plot($('#placeholder'), data1, options);
        },500);
    });

    //Refresh statistic widget
    $('.refresh-button').click(function() {
        var _overlayDiv = $(this).parent().children('.loading-overlay');
        _overlayDiv.addClass('active');

        setTimeout(function() {
            _overlayDiv.removeClass('active');
        }, 2000);

        return false;
    });

    /*待我审核的数据 数据格式可自己变*/
    var waitLookData = [{'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''},
        {'name':'城市接力 助力兰马','time':'2017.03.30 18:00:25','linkUrl':''}
    ];
    function initWaitData(waitLookData) {
        var waitHtml='';
        for(var i=0;i<waitLookData.length;i++){
            waitHtml +='<li><a href="'+waitLookData[i].linkUrl+'">'+
                '<div class="row">'+
                '<div class="col-md-4 text">'+waitLookData[i].name+'</div>'+
                '<div class="col-md-4 text-center text">'+waitLookData[i].time+'</div>'+
                '<div class="col-md-4 text-right"><a href="'+waitLookData[i].linkUrl+'" class="btn btn-link btn-sm">查看</a></div>'+
                '</div>'+
                '</a></li>';
        }
        $("#waitDataBox").html(waitHtml);
    }
    initWaitData(waitLookData);

    /*到期提醒的数据，数据格式可自己变*/
    var noticeData = [{'name':'AR抓蝴蝶','noticeType':'营销工具','linkeUrl':''},
        {'name':'助力蓝马满500减100','noticeType':'营销工具','linkeUrl':''},
        {'name':'城市接力满100超过了15个字了啦啦啦啦啦了阿联啦啊','noticeType':'优惠券活动','linkeUrl':''},
        {'name':'城市接力满100超过了15个字了啦啦啦啦啦了阿联啦啊','noticeType':'营销工具','linkeUrl':''},
        {'name':'AR抓蝴蝶','noticeType':'营销工具','linkeUrl':''},
        {'name':'城市接力满100超过了15个字了啦啦啦啦啦了阿联啦啊','noticeType':'优惠券活动','linkeUrl':''},
        {'name':'AR抓蝴蝶','noticeType':'优惠券活动','linkeUrl':''},
        {'name':'城市接力满100超过了15个字了啦啦啦啦啦了阿联啦啊','noticeType':'营销工具','linkeUrl':''},
        {'name':'AR抓蝴蝶','noticeType':'优惠券活动','linkeUrl':''},
    ];
    function initNoticeData(noticeData) {
        var noticeHtml =  '';
        for (var i=0;i<noticeData.length;i++){
            noticeHtml += ' <li><a href="'+ noticeData[i].linkeUrl +'">'+
                '<div class="row">'+
                    '<div class="col-md-10 col-sm-9 text">'+
                noticeData[i].noticeType +'：【<span class="link-text">'+ noticeData[i].name +'</span>】即将结束'+
                    '</div>'+
                    '<div class="col-md-2 col-md-3 text-right">'+
                        '<a href="'+ noticeData[i].linkeUrl +'" class="btn btn-link btn-sm">查看</a>'+
                    '</div>'+
                '</div>'+
                '</a></li>';
        }
        $("#noticeBox").html(noticeHtml);
    }
    initNoticeData(noticeData);




    /*屏幕发生变化的时候*/
    $(window).resize(function(e){
        setWidth();
        //resize morris chart
        setTimeout(function() {
            $.plot($('#placeholder'), [data1], options);
        },500);
    });

    $(window).load(function(e)	{

        //5个模块的数字的动画显示
        var currentUser = parseInt($('#userCount').attr('data-finNum'));
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

        var currentOrder = parseInt($('#orderCount').attr('data-finNum'));
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

        var currentVisitor = parseInt($('#visitorCount').attr('data-finNum')) ;
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
        var  currentUserCard = parseInt($("#userCard").attr('data-finNum'));
        $({numberValue:0}).animate({numberValue:currentUserCard},{
            duration:2500,
            easing:'linear',
            step:function () {
                $("#userCard").text(Math.ceil(this.numberValue));
            },
            done:function () {
                $("#userCard").text(currentUserCard);
            }
        })


    });
});
