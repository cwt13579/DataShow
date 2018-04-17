var num = 0;
var roleList;
var roleNum;
$(function(){
	loadRoleSelect();
	var id = getQueryString("id");
	loadData(id);
	
	/*表单校验*/
	validator.focusOutF('#workflow-form');
	$('#smiteBtn').click(function(){
	    var isTrue = validator.formClick("#workflow-form");
	    console.log(isTrue);
	    if(isTrue){
	    	var flag = validation();
	    	if(!flag){
	    		return;
	    	}
	    	
	    	var arr = new Array();
	    	var data = $("#ul-step").find("li");
	    	for(var i=0;i<data.length;i++){
	    		var obj = new Object();
	    		obj.step = parseInt($(data[i]).find("b").text());
	    		obj.roleId = $(data[i]).find("select").val();
	    		arr[i] = obj;
	    	}
	    	
	    	var param = new Object();
	    	param.name = $("#workflow_name").val();
	    	param.key = $("#workflow_key").val();
	    	param.describe = $("#workflow_describe").val();
	    	param.workflowId = $("#workflowId").val();
	    	param.steps = arr;
	    	
	    	var resultJson = ajaxRequest("../../workflow/update",null,{"param":JSON.stringify(param)},null);
	    	if(resultJson != null && resultJson.head.resCode == '0000' && resultJson.response.code == '0000'){
	    		alertModal({
		            modalType:'modal_true',
		            modalText:'修改成功！'
		         });
	    		//alert("修改成功！");
	    	}
	    }
	});
	
	$("#workflow_key").blur(function(){
		var key = $(this).val();
		var id = $("#workflowId").val();
		var resultJson = ajaxRequest("../../workflow/validionKey",null,{"key":key,"id":id},null);
		if(resultJson != null && resultJson.body.code == '0000'){
			if(resultJson.body.data > 0){
				$(this).val("");
				alertModal({
		            modalType:'modal_false',
		            modalText:'该流程标识已存在,请重新输入!'
		         });
				//alert("该流程标识已存在,请重新输入!");
			}
    	}
		
	});
});

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
} 

function loadData(id){
	var resultJson = ajaxRequest("../../workflow/getById",null,{"id":id},null);
	if(resultJson != null && resultJson.head.resCode == '0000' && resultJson.response.code == '0000' && resultJson.response.data != null){
		var obj = resultJson.response.data;
		$("#workflow_key").val(obj.key);
		$("#workflow_name").val(obj.name);
		$("#workflow_describe").val(obj.describe);
		$("#workflowId").val(obj.workflowId);
		var steps = obj.steps;
		for(var i = 0;i < steps.length;i++){
			num++;
			var html = "";
			html += "<li> 第<b>"+num+"</b>步<select>";
			for(var j=0;j<roleNum;j++){
				if(steps[i].roleId == roleList[j].id){
					html += "<option selected='selected' value="+roleList[j].id+">"+roleList[j].roleName+"</option>";
				}else{
					html += "<option value="+roleList[j].id+">"+roleList[j].roleName+"</option>";
				}
			}
			html += "</select><a onclick='delStep(this)'>删除</a></li>";
			$("#ul-step").append(html);
		}
	}
}


function addStep(){
	var size = parseInt($("#ul-step").find("li").length);
	if(size < roleNum){
		num++;
		var html = "";
		html += "<li> 第<b>"+num+"</b>步<select>";
		for(var i=0;i<roleNum;i++){
			html += "<option value="+roleList[i].id+">"+roleList[i].roleName+"</option>"
		}
		html += "</select><a onclick='delStep(this)'>删除</a></li>";
		$("#ul-step").append(html);
	}else{
		alertModal({
            modalType:'modal_false',
            modalText:'添加步骤数不能超过当前角色数量!'
         });
		//alert("添加步骤数不能超过当前角色数量");
		return;
	}
};

function delStep(obj){
	var tt = parseInt($(obj).parent().find("b").text());
	if(tt == roleNum){
		num--;
	}else if(tt < roleNum){
		var data = $("#ul-step").find("li").find("b");
		for(var i=0;i<data.length;i++){
			var s = parseInt($(data[i]).text());
			if(s > tt){
				$(data[i]).html(s-1);
			}
		}
		num--;
	}
	$(obj).parent().remove();
};

function loadRoleSelect(){
	var resultJson = ajaxRequest("../../workflow/getRoleList",null,null,null);
	if(resultJson != null && resultJson.head.resCode == '0000' && resultJson.response.code == '0000' && resultJson.response.data != null){
		roleList = resultJson.response.data;
		roleNum = roleList.length;
	}
};


function validation(){
	var ary = new Array();
	var data = $("#ul-step").find("li");
	if(data.length == 0){
		alertModal({
            modalType:'modal_false',
            modalText:'必须创建一个流程审核步骤!'
         });
		//alert("必须创建一个流程审核步骤!");
		return false;
	}
	
	for(var i=0;i<data.length;i++){
		ary[i] = $(data[i]).find("select").val();
	}
	
	var nary=ary.sort();
	for(var i=0;i<ary.length;i++){
		if (nary[i]==nary[i+1]){
			alertModal({
	            modalType:'modal_false',
	            modalText:'角色不能重复，请重现选择'
	         });
			//alert("角色不能重复，请重现选择");
			return false;
		}
	}
	
	return true;
}

