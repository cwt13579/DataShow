$(function(){

    /******* 一级菜单加点击事件   **********/
    $("#addNavBtn").click(function(){
        addNav('f','navList','',0);
    });
    
    //添加修改目录
    $("#saveNavBtn").click(function(){
    	
    	var data = {};
        var navType = $(this).attr("data-nav");
        var type = $(this).attr("data-type");
        if(type==0){
    		$("#nAddress").val("--");
    	} 
        var navName = $("#nName").val();
        var navAddress = $("#nAddress").val();
        var id = $(this).attr("data-navId");
        var pid = $(this).attr("data-navPid");
        
        if(navName==null || navName ==''){
        	$("#nNameMsg").html("请填写页面名称!");
        	return false;
        }else{
        	$("#nNameMsg").html("");
        }
        if(navAddress == null || navAddress ==''){
        	$("#nAddressMsg").html("请填写页面地址!");
        	return false;
        }else{
        	$("#nAddressMsg").html("");
        }
        
        data.resourceName = navName;
        data.url = navAddress;
        data.type = type;
        if(navType == 'revise'){
        	data.id = id;
        	var resultJson = ajaxRequest("updateResource",null,data,null);
        	if(resultJson == null || resultJson.head.resCode != '0000' || resultJson.response.code != '0000'){
        		alert("修改失败");
        	}else{
        		   $("#"+id).find('.navName').html(navName);
        		   $("#"+id).find('.navAddress').html(navAddress);
        	}
        }else{
        	data.parentId = pid;
        	var resultJson = ajaxRequest("addResource",null,data,null);
        	if(resultJson == null || resultJson.head.resCode != '0000' || resultJson.response.code != '0000'){
        		return ;
        	}
        	var resData = resultJson.response.data;
            //新添目录
            var navId = $(this).attr("data-navId");
            var id = resData.id;
            var html = '';
            if(navType == 'f'){
                //一级添加
                html = '<div id="'+ id+'">'+
                '<div  class="form-group firstNav">'+
                '<div class=" row">'+
                '<div class="col-sm-1 text-center">1</div>'+
                '<div class="col-sm-1 showHand" onclick="showToggle(this)" ><i class="fa fa-plus"></i></div>'+
                '<div class="col-sm-2 navName showHand" onclick="showToggle(this)">'+ navName +'</div>'+
                '<div class="col-sm-4 navAddress">'+ navAddress +'</div>'+
                '<div class="col-sm-4">'+
                '<button class="btn btn-link btn-sm" onclick="addNav(\'s\',\''+ id +'\',\''+id+'\','+resData.type+')">添加二级目录</button> |'+
                '<a class="btn btn-link btn-sm" onclick="addNav(\'s\',\''+ id +'\',\''+resData.parentId+'\',1)">添加二级菜单</a> |'+
                '<a class=" btn btn-link btn-sm" onclick=reviseNav(this,\''+resData.id+'\',"'+resData.type+'");>修改</a> |'+
                '<a class="btn btn-link btn-sm" onclick="deleteNav(\''+  id +'\')">删除</a>'+
                '</div> </div> </div>'+
                '<div class="navShow"></div></div>';
                $("#"+ navId + "").append(html);
            }else if(navType == 's'){
                //二级添加
                html = '<div id="'+ id+'" >'+
                '<div class="form-group secondNav">'+
                '<div class="row">'+
                '<div class="col-sm-1 text-center">1.1</div>'+
                '<div class="col-sm-1 showHand"  onclick="showToggle(this)"><i class="fa fa-plus"></i></div>'+
                '<div class="col-sm-2 navName showHand" onclick="showToggle(this)">'+ navName +'</div>'+
                '<div class="col-sm-4 navAddress">'+ navAddress +'</div>'+
                '<div class="col-sm-4">';
                if(type==0){
                	html += '<a class="btn btn-link btn-sm" onclick="addNav(\'t\',\''+ id +'\',\''+id+'\',1)">添加三级菜单</a> |';
                }
                html += '<a class=" btn btn-link btn-sm" onclick=reviseNav(this,\''+resData.id+'\',"'+resData.type+'");>修改</a> |'+
                '<a class="btn btn-link btn-sm" onclick="deleteNav(\''+  id +'\')">删除</a>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '<div class="navShow"></div></div>';
                $("#"+ navId + "").children('.navShow').append(html);
            }else if(navType == 't'){
                html = '<div class="form-group thirdNav">'+
                '<div class="row">'+
                '<div class="col-sm-1 text-center">1.1.2</div>'+
                '<div class="col-sm-1">&nbsp;</div>'+
                '<div class="col-sm-2 navName">'+ navName +'</div>'+
                '<div class="col-sm-4 navAddress">'+ navAddress +'</div>'+
                '<div class="col-sm-4 text-center">'+
                '<a class=" btn btn-link btn-sm" onclick=reviseNav(this,\''+resData.id+'\',"'+resData.type+'")>修改</a> |'+
                '<a class="btn btn-link btn-sm" onclick="deleteThirdNav(\''+  id +'\')">删除</a>'+
                '</div>'+
                '</div>'+
                '</div>';
                console.log( $("#"+ navId + "").children('.navShow'));
                $("#"+ navId + "").children('.navShow').append(html);
            }
        }
        $("#addNavBox").modal('hide');
    });
    /*******  资源管理页面的js   **********/
    
    
    //页面加载完成,获取数据
	var resultJson = ajaxRequest("findResourceList",null,null,null);
	if(resultJson != null && resultJson.head.resCode == '0000' && resultJson.response.code == '0000' && resultJson.response.data != null){
		var first = resultJson.response.data;
		for(var i=0; i< first.length; i++){
			//一级菜单
			 var html = '<div id="'+ first[i].id+'">'+
             '<div  class="form-group firstNav">'+
             '<div class=" row">'+
             '<div class="col-sm-1 text-center">'+(i+1)+'</div>'+
             '<div class="col-sm-1 showHand" onclick="showToggle(this)" ><i class="fa fa-plus"></i></div>'+
             '<div class="col-sm-2 navName showHand" onclick="showToggle(this)">'+ first[i].resourceName +'</div>'+
             '<div class="col-sm-4 navAddress">'+ first[i].url +'</div>'+
             '<div class="col-sm-4">'+
             '<button class="btn btn-link btn-sm" onclick="addNav(\'s\',\''+ first[i].id +'\',\''+first[i].id+'\','+first[i].type+')">添加二级目录</button> |'+
             '<a class="btn btn-link btn-sm" onclick="addNav(\'s\',\''+ first[i].id +'\',\''+first[i].id+'\',1)">添加二级菜单</a> |'+
             '<a class=" btn btn-link btn-sm" onclick=reviseNav(this,\''+first[i].id+'\',"'+first[i].type+'");>修改</a> |'+
             '<a class="btn btn-link btn-sm" onclick="deleteNav(\''+  first[i].id +'\')">删除</a>'+
             '</div> </div> </div>'+
             '<div class="navShow"></div></div>';
             $("#navList").append(html);
			var second = first[i].list;
			for(var j=0; j< second.length; j++){
				//二级菜单
				var  html = '<div id="'+ second[j].id+'" >'+
	                '<div class="form-group secondNav">'+
	                '<div class="row">'+
	                '<div class="col-sm-1 text-center">'+(i+1)+'--'+j+'</div>'+
	                '<div class="col-sm-1 showHand"  onclick="showToggle(this)"><i class="fa fa-plus"></i></div>'+
	                '<div class="col-sm-2 navName showHand" onclick="showToggle(this)">'+  second[j].resourceName +'</div>'+
	                '<div class="col-sm-4 navAddress">'+ second[j].url +'</div>'+
	                '<div class="col-sm-4">';
					if(second[j].type==0){
						html += '<a class="btn btn-link btn-sm" onclick="addNav(\'t\',\''+ second[j].id +'\',\''+second[j].id+'\',1)">添加三级菜单</a> |';
					}
					html += '<a class=" btn btn-link btn-sm" onclick=reviseNav(this,\''+second[j].id+'\',"'+second[j].type+'");>修改</a> |'+
	                '<a class="btn btn-link btn-sm" onclick="deleteNav(\''+  second[j].id +'\')">删除</a>'+
	                '</div>'+
	                '</div>'+
	                '</div>'+
	                '<div class="navShow"></div></div>';
	                $("#"+first[i].id).children('.navShow').append(html);
				var third = second[j].list;
				for(var k=0; k< third.length; k++){
					var html = '<div class="form-group thirdNav" id="'+ third[k].id+'">'+
	                '<div class="row">'+
	                '<div class="col-sm-1 text-center">'+(i+1)+'--'+j+'--'+k+'</div>'+
	                '<div class="col-sm-1">&nbsp;</div>'+
	                '<div class="col-sm-2 navName">'+ third[k].resourceName +'</div>'+
	                '<div class="col-sm-4 navAddress">'+ third[k].url  +'</div>'+
	                '<div class="col-sm-4 text-center">'+
	                '<a class=" btn btn-link btn-sm" onclick=reviseNav(this,\''+third[k].id+'\',"'+third[k].type+'");>修改</a> |'+
	                '<a class="btn btn-link btn-sm" onclick="deleteThirdNav(this,\''+third[k].id+'\')">删除</a>'+
	                '</div>'+
	                '</div>'+
	                '</div>';
	                $("#"+ second[j].id + "").children('.navShow').append(html);
				}
			}
		}
	}
});

var addNav = function(s,id,pid,type){
	
	$("#nNameMsg").html("");
	$("#myModalLabel").html("添加");
	if(type==0){
		$("#address").hide();
		$("#nAddress").val("--");
	}else{
		$("#address").show();
		$("#nAddress").val("");
	}
	
	
    //显示modal，并清空输入项
    $("#addNavBox").modal('show');
    $("#nName").val("");
    $("#nAddress").val("");
    $("#saveNavBtn").attr("data-navId",id);
    $("#saveNavBtn").attr("data-navPid",pid);
    $("#saveNavBtn").attr("data-type",type);
    $("#saveNavBtn").attr("data-nav",s);
};


var showToggle = function(th){
    var isShow = $(th).parent('.row').parent('.form-group').next('.navShow').css('display');
    if($(th).hasClass('navName')){
        if(isShow){
            if(isShow == 'none'){
                $(th).prev('.showHand').html('<i class="fa fa-minus"></i>');
            }else{
                $(th).prev('.showHand').html('<i class="fa fa-plus"></i>');
            }
        }
    }else{
        if(isShow){
            if(isShow == 'none'){
                $(th).html('<i class="fa fa-minus"></i>');
            }else{
                $(th).html('<i class="fa fa-plus"></i>');
            }
        }
    }
    $(th).parent('.row').parent('.form-group').next('.navShow').toggle();

};


//删除一级和二级目录
var deleteNav = function(id){
	var resultJson = deleteResource(id);
	if(resultJson != null && resultJson.head.resCode == '0000' && resultJson.response.code == '0000'){
		$("#"+id+"").remove();
	}else{
		alert('删除失败');
	}
};


//删除三级目录
var deleteThirdNav = function(th,id){
	var resultJson = deleteResource(id);
	if(resultJson != null && resultJson.head.resCode == '0000' && resultJson.response.code == '0000'){
		$(th).parent('.col-sm-4').parent('.row').parent('.thirdNav').remove();
	}else{
		alert('删除失败');
	}
};


//修改mul
var reviseNav = function(th,id,type){
	
	if(type==0){
		$("#address").hide();
		$("#nAddress").val("--");
	}else{
		$("#address").show();
		$("#nAddress").val("");
	}
	
	$("#myModalLabel").html("修改");
    var nName = $(th).parent('.col-sm-4').parent('.row').children('.navName').html();
    var nAddress =  $(th).parent('.col-sm-4').parent('.row').children('.navAddress').html();
    $("#nName").val(nName);
    $("#nAddress").val(nAddress);
    $("#saveNavBtn").attr("data-navId",id);
    $("#addNavBox").modal('show');
    $("#saveNavBtn").attr("data-nav",'revise');
};

//删除节点
var deleteResource = function(id){
	var data={};
	data.id=id;
	var resultJson = ajaxRequest("deleteResource",null,data,null);
	return resultJson;
}