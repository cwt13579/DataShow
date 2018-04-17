var dataTable;
$(function(){
	 
    /*表单校验*/
    validator.focusOutF('#addUserDiv');
    validator.focusOutF('#updateUserDiv');
     
	    
	LT.requireLTPlugin(["dataTable"]);
	$(document).ready(function(){
		createTable();
	});
	
	function createTable(){
		dataTable=LT.DataTable.create($("#tbody"),{url:"tableModel"});
		dataTable.smart();
		dataTable.build({url:"findUserList"});
	}
	window.formatOper = function(value,obj){
		var html="<a class='table-oper text-edit'  onclick=edit('"+obj.id+"') do-edit='"+obj.id+"'>编辑</a>";
		if(obj.validStatus=="禁用"){
			html+="<a class='table-oper text-edit' onclick=disableUser('"+obj.id+"') status-invalid='"+obj.id+"' >启用</a>";
		}else if(obj.validStatus=="正常"){
			html+="<a class='table-oper text-edit' onclick=disableUser('"+obj.id+"\') status-normal='"+obj.id+"' >禁用</a>";
		}
		html+="<a class='table-oper text-edit' onclick=resetPassword('"+obj.id+"\') status-normal='"+obj.id+"' >重置密码</a>";
		return html;
	}
	//加载渠道
	var resultJson = ajaxRequest("findChannelList",null,null,null);
	var data = resultJson.response.data;
	var channel="";
	//渠道查询下啦
	var channellist=' <li><a href="#"  onclick=clickC(this,"qChannelId","qChannel");  qid="">请选择</a></li> ';
	for (var i = 0; i < data.length; i++) {
		var c = data[i];
		channel +='<div class="form-group">';
		channel +='<div class="checkBox"> <div class="checkbox"><label class="label-checkbox"><span class="custom-checkbox"></span>'+c.channelName+'</label></div></div>';
		channel +='<div class="checkList">';
		var rList = c.roleList;
		if(c.roleList.length > 0){
			for (var k = 0; k < rList.length; k++) {
				var r = rList[k];
				channel +='	<div class="checkbox" ><label class="label-checkbox"><input  sid="'+r.id+'" value="'+r.id+'" type="checkbox" name="q" ><span class="custom-checkbox"></span>'+r.roleName+'</label></div>';
			}
		}
		channel +='</div>';
		channel +='</div>';
		channellist +=' <li><a href="#"  onclick=clickC(this,"qChannelId","qChannel");  qid='+c.id+'>'+c.channelName+'</a></li> ';
	} 
	
	$("#addChannelRole").html(channel);
	$("#updateChannelRole").html(channel);
	//查询的渠道输入框,chanel 大于0,说明是admin,进入全渠道用户管理
	$("#qChannelList").html(channellist);
});	 
	
	//修改
	var edit = 	function(id){
		
		$(".cms-check-icon").each(function(){
			$(this).hide();
	    });
		
		
		var user={};
		user.userId=id;
		var resultJson = ajaxRequest("findUser",null,user,null);
		var data = resultJson.response.data;
		$("#eId").val(data.id);
		$("#eDeptId").val(data.deptId);
		$("#eFullName").val(data.fullName);
		//回显角色选择
		var roleList = data.roleList;
		
		if(roleList.length > 0){
			for (var i = 0; i < roleList.length; i++) {
				var r = roleList[i];
				$("#updateChannelRole").find("input[type='checkbox']").each(function(){
					if ($(this).attr("sid")  == r.roleId  ) {
						$(this).attr("checked","true");
					}
				});
			}
		}else{
			$("#updateChannelRole").find("input[type='checkbox']").each(function(){
				$(this).removeAttr("checked");
			});
		}
		
		$("#updateUserDiv").modal('show');
	}
	
	//启停用户
	var disableUser = 	function(id){
		var user={};
		user.userId=id;
		var resultJson = ajaxRequest("disableUser",null,user,null);
		dataTable.query();
	}
	
	//重置密码
	var resetPassword = function(id){
		
		var c = confirm("重置密码为'000000'?");
		if(c){
			var user={};
			user.userId=id;
			var resultJson = ajaxRequest("resetPassword",null,user,null);
			LT.infomation({content:"已重置密码为'000000'!"});
		}
		
	}
	
	//点击添加按钮
	var addUserDiv = function(){
		
		$("#addUserDiv").modal('show');
	}
	
	//添加用户
	var addUser = function(){
		
		var userName = $("#userName").val();
		var password = $("#password").val();
		var rpassword = $("#rpassword").val();
		var fullName = $("#fullName").val();
		var deptId = $("#deptId").val();
		
		var user ={};
		user.userName = userName;
		user.password = password;
		user.fullName = fullName;
		user.deptId = deptId;
		
		var userRoleStr = "";
		var  isTrue = validator.formClick("#addUserDiv");
		if(!isTrue){
			return false;
		}
		$("#addChannelRole").find("input[type='checkbox']").each(function(){
			if ($(this).prop("checked")) {
				
				var roleId = $(this).val();
				if(roleId != null && roleId !=''){
					userRoleStr += roleId +",";
				}
			}
		});
		if (!userRoleStr){
			 alert("用户必须拥有至少一个角色");
			return false;
		}
		user.userRoleStr =userRoleStr;
		var resultJson = ajaxRequest("addUser",null,user,null);
		dataTable.query();
		$("#addUserDiv").modal('hide');
		
		//去掉以前的值
		 $("#userName").val("");
		 $("#password").val("");
		 $("#rpassword").val("");
		 $("#fullName").val("");
		 $("#deptId").val("");
		 $(".cms-check-icon").each(function(){
				$(this).hide();
		  });
	}
	
	var updateUser = function(){
	
		var id = $("#eId").val();
		var deptId = $("#eDeptId").val();
		var fullName = $("#eFullName").val();
		
		var user ={};
		user.id=id;
		user.deptId = deptId;
		user.fullName = fullName;
		
		var  isTrue = validator.formClick("#updateUserDiv");
		if(!isTrue){
			return false;
		}
		
		var userRoleStr = "";
		$("#updateChannelRole").find("input[type='checkbox']").each(function(){
			if ($(this).prop("checked")) {
				
				var roleId = $(this).val();
				if(roleId != null && roleId !=''){
					userRoleStr += roleId +",";
				}
			}
		});
		if (!userRoleStr){
			 alert("用户必须拥有至少一个角色");
			return false;
		}
		user.userRoleStr =userRoleStr;
		var resultJson = ajaxRequest("updateUser",null,user,null);
		
		if(resultJson.response.code =='0000'){
			LT.infomation({
				content : "修改成功"
			});
			dataTable.query();
		}else{
			LT.infomation({
				content : resultJson.response.desc
			});
		}
		
		dataTable.query();
		$("#updateUserDiv").modal('hide');
		
	}
	
	
	//查询用户
	var queryUser=function(){
		var  qUser = {};
		var  qUsername = $("#qUsername").val();
		var  qChannelId = $("#qChannelId").val();
		var  qRoleId = $("#qRoleId").val();
		var  QValidStatus = $("#validStatus").val();
		qUser.username= qUsername;
		qUser.channelId= qChannelId;
		qUser.roleId= qRoleId;
		qUser.validStatus = QValidStatus;
		dataTable.query(qUser);
	}
	
	//参数2  需要给隐藏域设值得id,参数3 需要给input value设置的值
	var clickC = function(obj,id,value){
		var qid = $(obj).attr("qid");
		$("#"+id).val(qid);
		$("#"+value).val($(obj).html());
		//根据选择的渠道,查询渠道下面
		var channel={};
		channel.id=qid;
		var resultJson = ajaxRequest("findRoleByChannelId",null,channel,null);
		
		var data = resultJson.response.data;
		//渠道查询下啦
		var roleHtml=' <li><a href="#"  onclick=clickR(this,"qRoleId","qRole");  qid="">请选择</a></li> ';
		for (var i = 0; i < data.length; i++) {
			var c = data[i];
			roleHtml +=' <li><a href="#"  onclick=clickR(this,"qRoleId","qRole");  qid='+c.id+'>'+c.roleName+'</a></li>';
		}
		$("#qRoleList").html(roleHtml);
		$("#qRoleId").val("");
		$("#qRole").val("");
	}
	
	
	//参数2  需要给隐藏域设值得id,参数3 需要给input value设置的值
	var clickR = function(obj,id,value){
		var qid = $(obj).attr("qid");
		$("#"+id).val(qid);
		$("#"+value).val($(obj).html());
		//根据选择的渠道,查询渠道下面
		var channel={};
		channel.id=qid;
	}
	
	//点击禁用
	var clickValidStatus = function(obj){
		if($(obj).prop("checked")){
			$(obj).val("1"); 
		}else{
			$(obj).val(""); 
		}
	}
	
	function checkUserName(){
		var user={}
		var username = $("#userName").val();
		user.userName = username;
		var resultJson = ajaxRequest("checkUserName",null,user,null);
		var data = resultJson.response.data;
		msg={};
		if(data.count > 0){
			msg.msg="用户名已存!";
			msg.flag=false;
		}else{
			msg.flag=true;
		}
		return msg;
	}
