var createResource = function(list){
	
	if(list == null || list.length <= 0){
		return false;
	}
	
	var firstHtml ="";
	var sencondHtml ="";
	for(var i=0; i<list.length; i++){
		var resource = list[i];
		
		if(i==0){
			firstHtml += '<li class="active" onclick=clickFirstMenu("'+resource.id+'",this);>'+resource.resourceName+'</li>';
		}else{
			firstHtml += '<li   onclick=clickFirstMenu("'+resource.id+'",this);>'+resource.resourceName+'</li>';
		}
		
		var secondList = resource.list;
		
		
		if(i==0){
			sencondHtml += '<ul style="display:block;" id="'+resource.id+'">';
		}else{
			sencondHtml += '<ul style="display:none;" id="'+resource.id+'">';
		}
		
		if(secondList != null && secondList.length > 0){
			for(var j=0; j< secondList.length; j++){
				var second  = secondList[j];
					sencondHtml += '<li><a  onclick= jumpToNewPage("'+second.url+'"); > <span class="menu-icon"><i class="fa fa-desktop fa-lg"></i></span><span class="text">'+second.resourceName+'</span><span class="menu-hover"></span></a></li>';
			}
		}
		sencondHtml +='</ul>';
	}
	
	$(window.parent.document).find("#top-menu").html(firstHtml);
	$(window.parent.document).find("#main-menu").html(sencondHtml);


}

function findResourceInChannel(channelId){
	var data = {}; 
	if(channelId){
		data.channelId = channelId;
	}
	$.ajax({
		type : "POST",
		url : "modules/channel/findResourceInChannel",
		data: {channelId: channelId},
		 async: false,
		success : function(data) {
			if(data.response.code == "0000"){
				var resourceList = data.response.data;
				createResource(resourceList);
			}
			
		}
	});
}


$(function() {
	//查询渠道下的菜单
	
	
	//绑定渠道选中的事件
	$("#channel-elements").on("click", ".channel-checked", function(){
		var channelId = $(this).prop("id");
		findResourceInChannel(channelId);
		window.location.href="channelIndex.html";
	});
	
	$("#channel-elements").on("click", "#sys-channel", function(){
		var channelId = $(this).prop("id");
		findResourceInChannel(channelId);
	});
	
	//请求用户拥有的渠道
	$.ajax({
		type : "POST",
		url : "modules/channel/findChannelByUserId",
		success : function(data) {
			if(data.response.code == "0000"){
                var channelElements = "";
                //如果有系统渠道显示系统渠道
                var sysChannel = data.response.data.sysChannel;
                if(sysChannel){
                    channelElements += '<div class="col-md-3 col-sm-4" id="sys-channel">'+
                    '	<div class="panel panel-stat1 channelBox topLineBlue ">'+
                    '		<div class="panel-body">'+
                    '			<div class="value">'+ sysChannel.channelName +
                    '			</div>'+
                    '		</div>'+
                    '	</div>'+
                    '</div>';
                }

                //用户的所有渠道
                var userChannels = data.response.data.userChannels;
                if(userChannels && userChannels.length ==1 && !sysChannel){
                	findResourceInChannel(userChannels[0].id);
            		window.location.href="channelIndex.html";
                	return ;
                }
                $.each(userChannels, function(i, channel){

                    channelElements += '<div class="col-md-3 col-sm-4 channel-checked" id="' + channel.id + '">'+
                    '	<div class="panel panel-stat1 channelBox topLineBlue ">'+
                    '		<div class="panel-body">'+
                    '			<div class="value">'+ channel.channelName +
                    '			</div>'+
                    '		</div>'+
                    '	</div>'+
                    '</div>';
                });

                $("#channel-elements").html(channelElements);


                //如果用户刷新页面前选择
				var userResourceList = data.response.data.userResourceList;
				if(userResourceList){
					createResource(userResourceList);
				}
			}
		}
	});
	
});


