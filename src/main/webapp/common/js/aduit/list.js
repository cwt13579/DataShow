var dataTable;
(function(){
	LT.requireLTPlugin(["dataTable","form","fileUpload"]).requirePrimeUi(["inputtext","inputtextarea"]);
	$(document).ready(function(){
		bindEvent();
		createTable();
	});

	function bindEvent(){
		$("#auditTable").delegate("[do-view]","click",function(){
			var id=$(this).attr("do-edit");
			var type=$(this).attr("type");
			var otherId=$(this).attr("otherid");
			view(id,type,otherId);
		}).delegate("[do-audit]","click",function(){
			var id=$(this).attr("do-audit");
			var sort = 0;
			auditOperate(id,sort);
		}).delegate("[do-return]","click",function(){
			var id=$(this).attr("do-return");
			var sort = 1;
			auditOperate(id,sort);
		});
	}
	
	function createTable(){
		dataTable=LT.DataTable.create($("#auditTable"),{url:"../../audit/tableModel"});
		dataTable.smart();
		dataTable.build({url:"../../audit/findListByPage"});
	}
	
	window.formatOper=function(value,obj){
		var html = '';
		if(obj.status == 0 && obj.flag == true){
			html+="<a class='table-oper text-edit' do-view='"+obj.id+"' type='"+obj.type+"' otherid = '"+obj.otherId+"'>查看</a>";
			html+="<a class='table-oper text-edit' do-audit='"+obj.id+"' type='"+obj.type+"' otherid = '"+obj.otherId+"'>审核</a>";
			html+="<a class='table-oper text-edit' do-return='"+obj.id+"' type='"+obj.type+"' otherid = '"+obj.otherId+"'>退回</a>";
		}else{
			html+="<a class='table-oper text-edit' do-view='"+obj.id+"' type='"+obj.type+"' otherid = '"+obj.otherId+"'>查看</a>";
		}
		return html;
	}
	
})()

function view(id,type,otherId){
	//window.location.href = "view.html?id="+id;
};

function auditOperate(id,sort){
	var p=LT.startProgress({message:"请稍后"});
	LT.asynPost("../../audit/auditOperate",{"id":id,"sort":sort},function(r){
		console.log(r);
		p.stopProgress(true);
		if(r != null && r.code == '0000'){
			alertModal({
	            modalType:'modal_true',
	            modalText:'操作成功！'
	         });
			//alert("操作成功！");
			dataTable.query();
		}else{
			LT.error(r);
		}
	});
	
};

function queryBtn(){
	var type = $("#audit_type").val();
	var status = $("#audit_status").val();
	var title = $("#audit_title").val();
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	dataTable.query({"type":type,"status":status,"title":title,"startTime":startTime,"endTime":endTime});
}

