var dataTable;
$(function() {
	LT.requireLTPlugin([ "dataTable" ]).requirePrimeUi();
	$(document).ready(function() {
		createTable();
	});

	function createTable() {
		dataTable = LT.DataTable.create($("#tbody"), {
			url : "tableModel"
		});
		dataTable.smart();
		dataTable.build({
			url : "roleList"
		});
	}
	window.formatOper = function(value, obj) {
		var html = "<a class='table-oper text-edit'  onclick=editRole('" + obj.id	+ "') do-edit='" + obj.id + "'>编辑</a>";
		html += "<a class='table-oper text-dangerEdit' onclick=deleteRole('" + obj.id+ "\') status-normal='" + obj.id + "' >删除</a>";
		return html;
	}

});



var editRole = function(id) {
	$(window.parent.document).find("#iframe").attr("src","modules/role/editRoleManage.html?" + id);
}


var deleteRole = function(id) {
	var role = {};
	role.roleId = id;
	var resultJson = ajaxRequest("deleteRole", null, role, null);
	if(resultJson.response.code =='0000'){
		LT.infomation({
			content : "已删除"
		});
		dataTable.query();
	}else{
		LT.infomation({
			content : resultJson.response.desc
		});
	}
	
}

