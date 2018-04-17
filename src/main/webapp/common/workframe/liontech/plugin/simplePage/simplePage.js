/**
 * 创建于:2014-5-21<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 简单页面插件
 * @author chender
 * @version 1.0.0
 */
LT.requireLTPlugin(["form","dataTable"]);
LT.loadCss(LT.getBasePath()+"/common/workframe/liontech/plugin/simplePage/simplePage.css");
LT.SimplePage=new function(){
	/**
	 * 参数是三个div，分别放form表单，操作区域，和表格
	 */
	this.create=function(formElement,toolBarElement,dataTableElement){
		var me={maxAdd:false,maxEdit:false};
		if(formElement==null){
			createArea(me);
		}else{
			me.formElement=formElement;
			me.toolBarElement=toolBarElement;
			me.dataTableElement=dataTableElement;			
		}
		me.build=function(setting){
			build(this,setting)
			return this;
		}
		me.refresh=function(){
			me.dataTable.refresh();
		}
		me.fireQuery=function(){
			var errNum=me.form.validity();
			if(errNum>0){
				LT.infomation({content:"存在"+errNum+"个不合法的输入项目"});
			}else{
				var values=me.form.getValues();
				if(me.setting.beforeQuery){
					me.setting.beforeQuery(values);
				}
				me.dataTable.query({queryJson:LT.toString(values)});
			}
		}
		me.addRecord=function(){
			addRecord(me);
		}
		me.editSelectedRecord=function(){
			editRecord(me);
		}
		me.deleteSelectedRecord=function(){
			deleteRecord(me);
		}
		me.justifySize=function(){
			justifySize(me);
		}
		return me;
	}
	
	function createArea(me){
		var root=$("<div></div>").css({position:"absolute",left:0,top:0,right:0,bottom:0,position:"absolute",overflow:"hidden"});
		me.root=root;
		me.topArea=$("<fieldset class='topArea'><legend>查询条件</legend></fieldset>").css({position:"absolute",left:2,right:2}).appendTo(root);
		me.topInner=$("<div></div>").css({position:"relative"}).appendTo(me.topArea)
		me.formElement=$("<div class='lt_simplePage_form'></div>").css({borderWidth:0,position:"absolute",left:0,right:0}).appendTo(me.topInner);
		me.toolBarElement=$("<div class='lt_simplePage_oper'></div>").css({position:"absolute",left:0,right:0}).appendTo(me.topInner).hide();
		me.dataTableElement=$("<div class='lt_simplePage_table'></div>").css({position:"absolute",bottom:0,left:0,right:0}).appendTo(root);
		root.appendTo(document.body);
		me.topArea.puifieldset({toggleable: true,afterToggle:function(){
		if(me.topArea.puifieldset("isCollapsed")){
			justifySize(me);
			me.toolBarElement.css("top","47px").insertAfter(me.topArea);			
		}else{
			me.toolBarElement.css("top","47px").insertAfter(me.formElement);
			justifySize(me);
		}
		},toggleSpeed:0});
	}
	
	function justifySize(me){
		if(!me.topArea){
			return;
		}
		var fh=me.formElement.find(".lt_form_body")[0].scrollHeight;
		me.formElement.css({height:fh,top:2});
		me.toolBarElement.css({top:fh+2,height:35,borderWidth:0}).show();
		me.topArea.css("padding","0.4em").find(">.pui-fieldset-content").height(fh+40);			
		me.topInner.css("height","100%");
		me.toolBarElement.find("input").css({width:"140px",height:"32px",float:"right",marginLeft:0});
		me.dataTableElement.css({top:fh+88});
		$(window).resize();
	}
	
	function build(me,setting){
		var defaultSetting={
				url:null,
			}
		me.setting=$.extend(defaultSetting,setting);
		var pro=LT.startProgress({message:"正在初始化界面"});
		LT.asynPost(me.setting.modelUrl||(me.setting.url+"_simplePage.action"),{},function(model){
			me.model=model;
			createForm(me)
			createToolBar(me);			
			createDataTable(me);
			pro.stopProgress(true);
			if(setting.finish){//加载完毕后告知调用的界面
				setting.finish();
			}
			setTimeout(function(){				
				justifySize(me);
			}, 0);
		});	
	}
	
	/**
	 * 创建表单
	 */
	function createForm(me){
		var formModel=me.model.form;
		formModel.mapping=me.model.mapping;
		formModel.trees=me.model.trees;
		me.formElement.addClass("ui-widget-content ui-corner-all");
		me.form=LT.Form.create({model:formModel,parent:me.formElement});
		me.form.build();
	}
	
	function createToolBar(me){
		var toolBarModel=me.model.toolBar;
		var buttons=toolBarModel.buttons;
		for(var i=0;i<buttons.length;i++){
			var b=buttons[i];
			var button=LT.createButton(b.width,b.height,b.style,b.name).addClass("lt_simplePage_toolbar_button").appendTo(me.toolBarElement);
			bindButton(me,b,button);
		}	
		me.toolBarElement.addClass("ui-widget-content ui-corner-all");
		function bindButton(me,model,button){
			var type=model.type;
			if(type==="query"){
				me.queryButton=button;
				button.click(function(){
					me.fireQuery();
				});
			}else if(type==="add"){
				button.click(function(){
					addRecord(me);
				});
			}else if(type==="resetQuery"){
				button.click(function(){
					me.form.clear();
					me.dataTable.query({queryJson:LT.toString(me.form.getValues())});
				});
			}else if(type==="exportData"){
				button.click(function(){
					LT.asynPost(me.setting.url+"_checkDownload.action",{},function(data){
						if(data=="success"){
							var colWidthes=LT.toString(me.dataTable.getAllColWidth());
							LT.download(me.setting.url+"_fireExportData.action?colWidthes="+colWidthes);
						}else{
							LT.infomation({content:data});
						}
					});
				});
			}else if(type==="importData"){
				button.click(function(){
				  var items=[];
				  items.push({label:"",name:"file",type:"uploadFile",validity:"require",thumb:"true",customUpName:"importDataFile",noBorder:true,layoutData:{height:"200px",width:"200px"}});
				  LT.openForm({maxable:false,minable:false,title:"请选择需要导入的文件",ok:"导入",width:240,height:285},
						  {model:{formItems:items,fileUploadUrl:me.setting.url+"_fireImportData.action"}},function(data){
					  LT.infomation({content:"导入完毕"});
					  if(me.form.afterImport){
						  me.form.afterImport();
					  }
				  });
				});
			}else if(type==="custom"){
				if(me.customButton==null){
					me.customButton={};
				}
				me.customButton[model.name]=button;//暴露访问的接口，让开发者自己绑定事件
			}
		}
	}
	
	/**
	 * 创建数据表格
	 */
	function createDataTable(me){
		var tableModel=me.model.dataTable;
		tableModel.mapping=me.model.mapping;
		var setting=$.extend({},me.setting.tableParam);		
		setting.url=me.setting.queryUrl||(me.setting.url+"_queryData.action");
		me.dataTable=LT.DataTable.create(me.dataTableElement,{model:tableModel});
		me.dataTable.condition({queryJson:LT.toString(me.form.getValues())});
		me.dataTable.build(setting);		
		bindTableMenu(me);
	}
	
	function bindTableMenu(me){
		var menus=[];
		me.menus={};
		if(me.model.addable){
			var addItems={name:"新增",icon:LT.getBasePath()+"/common/images/tool/add.png",action:function(){
				addRecord(me);
			}};
			menus.push(addItems);
			me.menus.add=addItems;
		}
		if(me.model.editable){
			var editItem={name:"编辑",icon:LT.getBasePath()+"/common/images/tool/edit.png",action:function(){
				editRecord(me);
			}};
			menus.push(editItem);
			me.menus.edit=editItem;
		}
		if(me.model.deletable){
			var deleteItem={name:"删除",icon:LT.getBasePath()+"/common/images/tool/delete.png",action:function(){
				deleteRecord(me);
			}};
			menus.push(deleteItem);
			me.menus.del=deleteItem;
		}
		if(me.model.refreshable){
			var refreshItem={name:"刷新",icon:LT.getBasePath()+"/common/images/tool/refresh.png",action:function(){
				me.refresh();
			}};
			menus.push(refreshItem);
		}
		if(me.setting.menu){//自定义的菜单选项
			for(var i=0;i<me.setting.menu.length;i++){			
				menus.push(me.setting.menu[i]);
			}
		}
		if(menus.length!=0){
			me.dataTable.contextMenu({items:menus});
		}
	}
	
	function addRecord(me){
		var pro=LT.startProgress({message:"正在初始化"});
		LT.asynPost(me.setting.url+"_fireInitAdd.action",{},function(model){
			pro.stopProgress(true);
			model.mapping=model.mapping==null?{}:model.mapping;
			model.trees=model.trees==null?{}:model.trees;
			if(me.model.mapping!=null){
				for(var i in me.model.mapping){
					if(model.mapping[i]==null){
						model.mapping[i]=me.model.mapping[i];
					}
				}
			}
			if(me.model.trees!=null){
				for(var i in me.model.trees){
					if(model.trees[i]==null){
						model.trees[i]=me.model.trees[i];
					}
				}
			}
			var width=me.model.operWidth?me.model.operWidth:750;
			var height=me.model.operHeight?me.model.operHeight:400;
			var form=LT.openForm({title:"新增",ok:"确定",pos:"center",width:width,height:height,max:me.maxAdd},{model:model},function(data){
				if(form.beforeAddCommit){
					if(form.beforeAddCommit(data)===false){
						return false;
					}
				}
				pro=LT.startProgress({message:"正在提交数据"});
				LT.asynPost(me.setting.url+"_fireAdd.action",{addJson:LT.toString(data)},function(back){
					pro.stopProgress(true);
					if(back=="success"){
						LT.infomation({content:"新增成功"});
						form.closeFormDialog();
						me.refresh();
					}else{
						LT.infomation({content:"新增失败:"+back,block:true,sticky:true,type:"error"});
					}
				})
				return false;
			});
			if(window.simplePageAdd){
				window.simplePageAdd(form);
			}
		});
	}
	
	function editRecord(me){
		var selectedRow=me.dataTable.getSelectedRowDatas();
		if(selectedRow==null||selectedRow.length==0){
			selectedRow=me.dataTable.getSelectedRowData();
		}else if(selectedRow.length>1){
			LT.infomation({content:"多条记录被选中,目前暂不支持批量编辑"});
			return;
		}else{			
			selectedRow=selectedRow[0];
		}
		if(selectedRow==null){			
			LT.infomation({content:"请选择需要编辑的记录"});
			return;
		}
		var pk=me.model.dataTable.pk;
		if(pk==null||pk==""){
			LT.infomation({content:"未设置主键属性,无法进行编辑",type:"error",sticky:true,block:true});
			return;
		}
		var pkValue=selectedRow[pk];
		if(pkValue==null){
			LT.infomation({content:"主键列不存在或值为空,无法进行编辑",type:"error",sticky:true,block:true});
			return;
		}
		var param={};
		param[pk]=pkValue;
		var pro=LT.startProgress({message:"正在初始化"});
		LT.asynPost(me.setting.url+"_fireInitEdit.action",param,function(model){
			pro.stopProgress(true);
			if(typeof model == "string"){
				LT.infomation({content:model,type:"error",sticky:true,block:true})
				return;
			}
			model.mapping=model.mapping==null?{}:model.mapping;		
			model.trees=model.trees==null?{}:model.trees;
			if(me.model.mapping!=null){
				for(var i in me.model.mapping){
					if(model.mapping[i]==null){
						model.mapping[i]=me.model.mapping[i];
					}
				}
			}
			if(me.model.trees!=null){
				for(var i in me.model.trees){
					if(model.trees[i]==null){
						model.trees[i]=me.model.trees[i];
					}
				}
			}
			var width=me.model.operWidth?me.model.operWidth:750;
			var height=me.model.operHeight?me.model.operHeight:400;
			var form=LT.openForm({title:"编辑",ok:"确定",pos:"center",width:width,height:height,max:me.maxEdit},{model:model},function(data){
				if(form.beforeEditCommit){
					if(form.beforeEditCommit(data)===false){
						return false;
					}
				}
				pro=LT.startProgress({message:"正在提交数据"});
				data[pk]=pkValue;
				LT.asynPost(me.setting.url+"_fireEdit.action",{editJson:LT.toString(data)},function(back){
					pro.stopProgress(true);
					if(back=="success"){
						LT.infomation({content:"编辑成功"});
						form.closeFormDialog();
						me.refresh();
					}else{
						LT.infomation({content:"编辑失败:"+back,block:true,sticky:true,type:"error"});
					}
				})
				return false;
			});
			if(window.simplePageEdit){
				window.simplePageEdit(form);
			}
		});
	}
	
	function deleteRecord(me){
		var selectedRow=me.dataTable.getSelectedRowDatas();
		if(selectedRow==null||selectedRow.length==0){
			selectedRow=me.dataTable.getSelectedRowData();
		} else if(selectedRow.length>1){
			LT.infomation({content:"多条记录被选中,目前暂不支持批量删除"});
			return;
		}else{
			selectedRow=selectedRow[0];
		}
		if(selectedRow==null){
			LT.infomation({content:"请选择需要删除的记录"});
			return;
		}
		var pk=me.model.dataTable.pk;
		var pkValue=selectedRow[pk];
		if(pkValue==null){
			LT.infomation({content:"未获取到需要删除的行数据"});
			return;
		}
		var param={};
		param[pk]=pkValue;
		LT.dialog({title:"删除确认",message:"你确定删除该条记录吗?",buttons:["确认","取消"]},function(choice){
			if(choice=="确认"){
				var pro=LT.startProgress({message:"正在请求"});
				LT.asynPost(me.setting.url+"_fireDelete.action",param,function(result){
					pro.stopProgress(true);
					if(result=="success"){
						LT.infomation({content:"删除成功"});
						me.refresh();
					}else{
						LT.infomation({content:result,type:"error",sticky:true,block:true});
					}
				});
			}
		});
		
	}
}