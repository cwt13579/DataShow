var dataTable;
(function(){
	LT.requireLTPlugin(["dataTable","form","fileUpload"]).requirePrimeUi(["inputtext","inputtextarea"]);
	$(document).ready(function(){
		bindEvent();
		createTable();
	});

	function bindEvent(){
		$("#workflowTable").delegate("[do-edit]","click",function(){
			var id=$(this).attr("do-edit");
			updateWorkflow(id);
		}).delegate("[delete-invalid]","click",function(){
			var id=$(this).attr("delete-invalid");
			deleteWorkflow(id);
		});
	}
	
	function createTable(){
		dataTable=LT.DataTable.create($("#workflowTable"),{url:"../../workflow/tableModel"});
		dataTable.smart();
		dataTable.build({url:"../../workflow/findListByPage"});
	}
	window.formatOper=function(value,obj){
		//var html = "<a onclick='updateWorkflow(\""+obj.workflowId+"\");'>修改</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a onclick='deleteWorkflow(\""+obj.workflowId+"\")'>删除</a>";
		var html="<a class='table-oper text-edit' do-edit='"+obj.workflowId+"'>编辑</a>";
			html+="<a class='table-oper text-dangerEdit' delete-invalid='"+obj.workflowId+"'>删除</a>";
		return html;
	}
})()

function updateWorkflow(id){
	var p=LT.startProgress({message:"请稍后"});
	LT.asynPost("../../workflow/check",{id:id},function(r){
		console.log(r);
		p.stopProgress(true);
		if(r != null && r.code == '0000'){
			if(r.data > 0){
				alertModal({
		            modalType:'modal_false',
		            modalText:'该流程正在使用中,不允许修改!'
		         });
				//alert("该流程正在使用中,不允许修改!");
			}else{
				window.location.href = "edit.html?id="+id;
			}
		}else{
			LT.error(r);
		}
	});
};

function deleteWorkflow(id){
	var p=LT.startProgress({message:"请稍后"});
	LT.asynPost("../../workflow/check",{id:id},function(r){
		console.log(r);
		p.stopProgress(true);
		if(r != null && r.code == '0000'){
			if(r.data > 0){
				alertModal({
		            modalType:'modal_false',
		            modalText:'该流程正在使用中,不允许删除!'
		         });
				//alert("该流程正在使用中,不允许删除!");
			}else{
				var t=LT.startProgress({message:"请稍后"});
				LT.asynPost("../../workflow/delete",{id:id},function(r){
					console.log(r);
					t.stopProgress(true);
					if(r != null && r.code == '0000'){
						alertModal({
				            modalType:'modal_true',
				            modalText:'删除成功！'
				         });
						//alert("删除成功！");
						dataTable.query();
					}else{
						LT.error(r);
					}
				});
			}
		}else{
			LT.error(r);
		}
	});
	
};


