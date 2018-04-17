var activityId=LT.getUrlParam("activityId");
//var activityId =  202;
//alert("活动ID: "+activityId);
var dataTable;
LT.requireLTPlugin([ "dataTable" ]).requirePrimeUi();
$(document).ready(function() {
	createTable();
});

function createTable() {
	dataTable = LT.DataTable.create($("#reportBody"), {
		url : "tableModel"
	});
	dataTable.smart();
	dataTable.build({
		url : "reportList?activityId="+activityId
	});
}

function query(){
	var beginTimeStr = $("#beginTimeStr").val();
	var endTimeStr = $("#endTimeStr").val();
	var query = {};
	query.beginTimeStr = beginTimeStr;
	query.endTimeStr = endTimeStr;
	dataTable.query(query);
}