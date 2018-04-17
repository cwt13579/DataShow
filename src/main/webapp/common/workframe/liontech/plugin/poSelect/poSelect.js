/**
 * 创建于:2014-8-12<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 机构人员选择插件
 * @author chender
 * @version 1.0.0
 */
LT.requireLTPlugin(["simplePage"]).requirePrimeUi(["radiobutton"]);
LT.loadCss(LT.getBasePath()+"/common/workframe/liontech/plugin/poSelect/poSelect.css");
LT.POSelect=new function(){
	this.show=function(setting){
		var s={selectFinish:null};
		$.extend(s,setting);
		if($(".poSelect_selecting").length!=0){
			LT.infomation({content:"请勿重复打开该窗口"});
			return;
		}
		var wd=LT.createWindow({minable:false,resizable:false,pos:"center",block:true,width:900,height:520},function(){
			if(s.selectFinish){
				if(s.selectFinish(null)===false){
					return false;
				}else{
					return true;
				}
			}
		});
		var selectedPeoples={};
		var selecting=$("<div class='poSelect_selecting'></div>");
		var left=$("<div class='poSelect_left ui-widget-content ztree'><ul></ul></div>").appendTo(selecting);
		var right=$("<div class='poSelect_right ui-widget-content'></div>").appendTo(selecting);
		
		var selected=$("<div class='poSelect_selected ui-widget-content'></div>");
		var selectedOper=$("<div class='poSelect_selectedOper ui-widget-content'></div>").appendTo(selected);
		var peopleList=$("<div class='poSelect_selectedPeopleList'></div>").appendTo(selected);
		var back=$("<img></img>").attr("title","返回选择界面").attr("src",LT.getBasePath()+"/common/images/tool/backward.png").click(function(){
			selecting.show();
			selected.hide();
		}).appendTo($("<div class='poSelect_operItem'></div>").appendTo(selectedOper));
		var empty=$("<img></img>").attr("title","清空已选人员").attr("src",LT.getBasePath()+"/common/images/tool/empty.png").click(function(){
			if(peopleList.children().length==0){
				return;
			}
			peopleList.empty();
			selectedPeoples={};
			simplePage.dataTable.table.resetSelection();//全不选
		}).appendTo($("<div class='poSelect_operItem'></div>").appendTo(selectedOper));
		
		LT.hoverBigger({element:back,change:[5,5]});
		LT.hoverBigger({element:empty,change:[5,5]});
		
		
		var simplePageDiv=$("<div class='poSelected_sp'><div class='poSelected_sp_form'></div><div class='poSelected_sp_oper'></div><div class='poSelected_sp_table'></div></div>").appendTo(right);
		wd.addContent(selecting);
		wd.addContent(selected);
		wd.setTitle("人员选择");
		wd.contextMenu({}).css({position:"fixed",minWidth:880,minHeight:450}).appendTo(document.body);
		var orgParam={};
		var orgTree=createOrgTree(function(event,treeId,treeNode){
			if(treeNode==null||(event.button!=1&&event.button!=0)){ 
				return;
			}
			simplePage.dataTable.setCaption(treeNode.orgName);
			orgParam={orgSid:treeNode.sid,orgPath:treeNode.orgPath};
			simplePage.fireQuery();
		});
		var tableParam={};
		tableParam.onSelectRow=function(rowid,status){
			var people=simplePage.dataTable.table.getRowData(rowid);
			status?addSelectedPeople(people):deleteSelectedPeople(people);			
		}
		tableParam.onSelectAll=function(aRowIds,status){
			if(aRowIds!=null&&aRowIds.length!=0){
				for(var i=0;i<aRowIds.length;i++){
					var people=simplePage.dataTable.table.getRowData(i+1);
					status?addSelectedPeople(people):deleteSelectedPeople(people);			
				}
			}
		}
		tableParam.gridComplete=function(){
			var allRows=simplePage.dataTable.table.getRowData();
			if(allRows!=null&&allRows.length!=0){
				for(var i=0;i<allRows.length;i++){
					if(selectedPeoples[allRows[i].code]){						
						simplePage.dataTable.table.setSelection(i+1,false);
					}
				}
			}
		}
		
		var simplePage=createSimplePage(beforeQuery,buildFinish,tableParam);
		
		function beforeQuery(values){
			$.extend(values,orgParam);
		}
		
		function addSelectedPeople(people){
			if(selectedPeoples[people.code]){
				return;
			}
			var peopleRoot=$("<div class='poSelect_peopleItem ui-widget-content ui-state-default'></div>").attr("id","poSelect_peopleItem_"+people.code);
			peopleRoot.data("peopleData",{code:people.code,name:people.name,orgName:people.orgName});
			var nameCode=$("<div class='poSelect_peopleItem_nameCode'></div>").append("<a style='float:left' class='ui-icon ui-icon-person'></a>")
			.append("<a>"+people.name+"("+people.code+")</a>").appendTo(peopleRoot);
			var orgName=$("<div class='poSelect_peopleItem_orgName'></div>").append("<a style='float:left' class='ui-icon ui-icon-home'></a>")
			.append("<a>"+people.orgName+")</a>").appendTo(peopleRoot);
			peopleRoot.hover(function(){
				$(this).toggleClass("ui-state-hover");
			});
			$("<a class='poSelect_peopleItem_del ui-icon ui-icon-trash'></a>").appendTo(peopleRoot).click(function(){
				$(this).remove();
				peopleRoot.animate({width:0},function(){
					var allRows=simplePage.dataTable.table.getRowData();
					if(allRows!=null&&allRows.length!=0){//取消选中当前table上的对应的记录（如果存在）
						for(var i=0;i<allRows.length;i++){
							if(allRows[i].code==people.code){						
								simplePage.dataTable.table.setSelection(i+1,false);
								break;
							}
						}
					}			
					peopleRoot.remove();
					selectedPeoples[people.code]=null;
				});
			});
			peopleRoot.appendTo(peopleList);
			selectedPeoples[people.code]=peopleRoot;
		}
		
		function deleteSelectedPeople(people){
			if(selectedPeoples[people.code]){
				selectedPeoples[people.code].remove();
				selectedPeoples[people.code]=null;
			}
		}
		
		function buildFinish(){	
			var form=simplePage.form;
			var cs=form.getElement("containsSub");
			var ul=form.getElement("useLike");
			cs.event.change=function(el,checked){
				simplePage.fireQuery();
			};
			ul.event.change=function(el,checked){
				simplePage.fireQuery();
			};
			LT.keyListener(simplePage.form.getElement("peopleName").content,13,function(){
				  simplePage.fireQuery();
				});
			LT.keyListener(simplePage.form.getElement("peopleCode").content,13,function(){
				  simplePage.fireQuery();
				});
			simplePage.dataTable.setCaption(orgTree.treeModel[0].orgName);
			orgParam={orgSid:orgTree.treeModel[0].sid,orgPath:orgTree.treeModel[0].orgPath};
			simplePage.customButton["查看已选人员"].click(function(){
				selecting.hide();
				selected.show();
			});
			simplePage.customButton["选择完毕"].click(function(){
				if(s.selectFinish){
					var selected=[];
					var items=peopleList.find(">.poSelect_peopleItem");
					for(var i=0;i<items.length;i++){
						selected.push($(items[i]).data("peopleData"));
					}
					if(s.selectFinish(selected)!==false){
						wd.close();
					}
				}
			});
		}
	}
	
	function createOrgTree(clickTree){
		var treeModel=LT.synPost(LT.getBasePath()+"/liontech/poSelectAction_orgModel.action",{});
		  var setting = {
				     callback: {
					        onClick: clickTree
				        }
			        };
		var orgTree = $.fn.zTree.init($(".poSelect_left>ul"), setting, treeModel);
		orgTree.treeModel=treeModel;
		return orgTree;
	}
	
	function createSimplePage(beforeQuery,finish,tableParam){
		var pro = LT.startProgress({message:"正在初始化"});
		var simplePage=LT.SimplePage.create($(".poSelected_sp_form"),$(".poSelected_sp_oper"),$(".poSelected_sp_table"));
		pro.stopProgress(true);
		var param={url:LT.getBasePath()+"/liontech/poSelectAction",finish:function(){
			finish();
		}};
		param.tableParam=tableParam;
		param.beforeQuery=beforeQuery;
		simplePage.build(param);
		return simplePage;
	}
}