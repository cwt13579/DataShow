$(function(){
	//validator.focusOutF('#editRoleDiv');
	var src = $(window.parent.document).find("#iframe").attr("src");
	var roleId =  src.split("?")[1];
	var data = {};
	data.roleId = roleId;
	var resultJson = ajaxRequest("findRole",null,data,null);
	var role = resultJson.response.data;
	$("#roleName").val(role.roleName);
	$("#description").val(role.description);
	$("#rid").val(role.id);
	
	var resultJson = ajaxRequest("findResourceList", null, null, null);
	var list1 = resultJson.response.data;

	var html='<ul class="list-group">';
	html +='<li class="list-group-item first-tree">';
	html +='	<span class="tree-active tree-icon"><i class="fa fa-minus"></i></span>';
	html +='	<div class="checkbox checkbox-inline">';
	html +='		<label class="label-checkbox">';
	html +='			<input type="checkbox" id="selectAll" onclick=check("all",this) value="" name="all" data-child-name="first-tree">';
	html +='			<span class="custom-checkbox"></span>全部';
	html +='		</label>';
	html +='	</div>';
	html +='</li>';

	var resourceIdList = [];
	for (var jj = 0; jj < role.roleResourceList.length; jj++) {
		var roleResource = role.roleResourceList[jj];
		resourceIdList[jj]=roleResource.resourceId;
	}
	for (var i = 0; i < list1.length; i++) {
		var r1 = list1[i];
		html +='<li class="list-group-item second-tree" >';
		html +='	<span class="tree-active tree-icon"><i class=" fa fa-minus"></i></span>';
		html +='	<div class="checkbox checkbox-inline">';
		html +='     <label class="label-checkbox">';
		
		//判断是否选中
		if(resourceIdList.indexOf(r1.id) >= 0){
			html +='         <input type="checkbox" itemBox="true" onclick=check("sencond-tree'+i+'",this)   checked="checked" value="'+r1.id+'" name="first-tree" data-child-name="sencond-tree'+i+'">';
		}else{
			html +='         <input type="checkbox" itemBox="true" onclick=check("sencond-tree'+i+'",this)  value="'+r1.id+'" name="first-tree" data-child-name="sencond-tree'+i+'">';
		}
		
		html +='         <span class="custom-checkbox"></span>'+r1.resourceName;
		html +='     </label>';
		html +=' 	</div>';
		html +='</li>';
		
		var list2 = r1.list;
		//有二级菜单
		if(list2.length > 0){
			for (var j = 0; j < list2.length; j++) {
				var r2 = list2[j];
				html +='<li class="list-group-item third-tree"  >';
				html +='<span class="tree-active tree-icon"><i class=" fa fa-minus"></i></span>';
				html +='<div class="checkbox checkbox-inline">';
				html +='    <label class="label-checkbox">';
				if(resourceIdList.indexOf(r2.id) >= 0){
					html +='        <input type="checkbox" itemBox="true" onclick=check("thrid-tree'+j+'",this) checked="checked" value="'+r2.id+'" name="sencond-tree'+i+'" data-child-name="thrid-tree'+j+'">';
				}else{
					html +='        <input type="checkbox" itemBox="true" onclick=check("thrid-tree'+j+'",this) value="'+r2.id+'" name="sencond-tree'+i+'" data-child-name="thrid-tree'+j+'">';
				}
				
				html +='        <span class="custom-checkbox"></span>'+r2.resourceName;
				html +='    </label>';
				html +='</div>';
				html +='</li>';
				
				//三级菜单
				var list3 = r2.list;
				for (var k = 0; k < list3.length; k++) {
					var r3 = list3[k];
					html +='<li class="list-group-item four-tree"  >';
					html +='<span class="tree-active tree-icon"><i class=""></i></span>';
					html +='<div class="checkbox checkbox-inline">';
					html +='    <label class="label-checkbox">';
					
					if(resourceIdList.indexOf(r3.id) >= 0){
						html +='        <input type="checkbox" itemBox="true" onclick=check("",this) checked="checked" value="'+r3.id+'" name="thrid-tree'+j+'" data-child-name="">';
					}else{
						html +='        <input type="checkbox" itemBox="true" onclick=check("",this) value="'+r3.id+'" name="thrid-tree'+j+'" data-child-name="">';
					}
					
					html +='        <span class="custom-checkbox"></span>'+r3.resourceName;
					html +='    </label>';
					html +='</div>';
					html +='</li>';
				}
			}
		}
	}
	html += '</ul>';
	$("#treeview-checkable").html(html);
	checkSelectAll();
	
});

function checkSelectAll(){
	var isSelectAll = true;
	$('[itemBox="true"]').each(function(i,o){
		if ( !$(o).is(":checked")){
			isSelectAll = false;
		}
	});
	$("#selectAll").attr("checked",isSelectAll); 
}

function checkRoleName(){
	var role={};
	var isExists = false;
	role.roleId = $("#rid").val();
	role.roleName = $("#roleName").val();
	if(role.roleName==''){
		$("#roleName").attr('isExists',false);
		return isExists;
	}
	var resultJson = ajaxRequest("checkRoleExists",null,role,null);
	var data = resultJson.response.data;
	
	if(data.count > 0){
		isExists = true;
		$("#roleNameTips").html("<span class='text-danger'>角色名已存在</span>");
	}else{
		$("#roleNameTips").html("角色名长度为4~30个字符");
	}
	$("#roleName").attr('isExists',isExists);
	return isExists;
} 
 
//修改角色
var updateRole=function(){
	
	var data = {};
	var id = $("#rid").val();
	var roleName = $("#roleName").val();
	
	var description = $("#description").val();
	if(!roleName){
		alert("角色名格式错误");
		return false;
	}
	if(roleName.length<4){
		alert("角色名称至少4个字符");
		return false;
	}
	var isExists = $("#roleName").attr('isExists');//角色名是否存在
	if(isExists==true||isExists=="true"){
		alert("角色名已存在");
		return false;
	}
	
	
	data.roleName = roleName;
	data.id = id;
	data.description = description;
	var resourceStr = "";
	$(".checkbox").find("input[type='checkbox']").each(function(){
		if ($(this).prop("checked")) {
			
			var resource = $(this).val();
			if(resource != null && resource !=''){
				resourceStr += resource +",";
			}
		}
	});
	data.resourceStr =resourceStr;
	var resultJson = ajaxRequest("updateRole",null,data,null);
	$(window.parent.document).find("#iframe").attr("src","modules/role/roleManagement.html");
}



//重置
var  resetAddRole = function(){
	$("#roleName").val("");
	$("#description").val("");
	$(".checkbox").find("input[type='checkbox']").each(function(){
		 $(this).removeAttr("checked");
	});
}



var check  = function(scope ,obj){
	var c = $(obj).prop("checked");
	if(scope=='all'){
		if (c) {
			$(".checkbox").find("input[type='checkbox']").each(function() {
				$(this).prop("checked",true); 
			});
		}else{
			$(".checkbox").find("input[type='checkbox']").each(function() {
				$(this).removeAttr("checked"); 
			});
		}
		
	}else if(scope.indexOf("sencond-tree") >= 0){
		if (c) {
			$(".checkbox").find("input[type='checkbox']").each(function() {
				if($(this).attr("name")==scope){
					$(this).prop("checked",true); 
				}
			});
		}else{
			$(".checkbox").find("input[type='checkbox']").each(function() {
				if($(this).attr("name")==scope){
					$(this).removeAttr("checked"); 
				}
			});
		}
	}else if(scope.indexOf("thrid-tree")>=  0 ){
		if (c) {
			$(".checkbox").find("input[type='checkbox']").each(function() {
				if($(this).attr("name")==scope){
					$(this).prop("checked",true); 
				}
			});
		}else{
			$(".checkbox").find("input[type='checkbox']").each(function() {
				if($(this).attr("name")==scope){
					$(this).removeAttr("checked"); 
				}
			});
		}
	}	
}