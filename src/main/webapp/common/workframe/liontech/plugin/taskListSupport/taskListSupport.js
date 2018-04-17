/**
 * 创建于:2014-7-1<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 任务列表插件
 * @author chender
 * @version 1.0.0&appParam={abc:asda}
 */
 LT.requireLTPlugin(["simplePage"]).requirePrimeUi(["fieldset"]);
 LT.TaskListSupport=new function(){
	this.create=function(){
		var me={};
		me.build=function(root,setting){
			if(root){//兼容之前的业务模块
				root.remove();
			}
			me.root=root;
			$(document.body).css("overflow","hidden");
			build(this,setting)
		}	
		return me;
	}
	
	function build(me,setting){
		me.setting=setting;
		var set={url:null,model:null};
		set=$.extend(set,setting);
		set.modelUrl=setting.url+"_pageModel.action";
		set.queryUrl=setting.url+"_getTaskList.action";
		set.finish=function(){
			me.dataTable=me.page.dataTable;
			me.initListMode=me.dataTable.getExtendData()["listMode"];
			var title="<div>"+me.dataTable.getInitCaption()+"</div><div>(</div><div class='free'>空闲</div><div>/</div><div class='owned'>私有</div><div>)</div>";
			var tid="tlsh_"+new Date().getTime();
			me.dataTable.setCaption("<div id='"+tid+"'>"+title+"</div>");
			me.tableHeadDiv=$("#"+tid);
			me.tableHeadDiv.find(">div").css("float","left").css("cursor","pointer");me.taskNumbers
			var free=me.tableHeadDiv.find(".free");
			var owned=me.tableHeadDiv.find(".owned");
			if(me.initListMode=="free"){
				free.css("color","yellow");
				me.showMode="free";
			}else{
				owned.css("color","yellow");
				me.showMode="owned";
			}
			free.click(function(){
				me.freeItem.action();
				free.css("color","yellow");
				owned.css("color","white");
				me.showMode="free";
			});
			owned.click(function(){
				me.ownedItem.action();
				free.css("color","white");
				owned.css("color","yellow");
				me.showMode="owned";
			});
			me.dataTable.condition({listMode:me.initListMode});
			bindContextMenu(me);
			me.root=me.page.root;
			me.taskDealIframe=$("<iframe  frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='yes' allowtransparency='yes'></iframe>");
			me.taskDealIframe.css({width:"100%",height:"100%"}).hide().appendTo(document.body);
			me.taskDealIframe.load(function(){
				if(!me.progress){
					return;
				}
				me.progress.stopProgress(true);
				var errMsg=me.taskDealIframe[0].contentWindow.errMsg;
				if(errMsg){
					LT.infomation({title:"获取指定任务出现错误",content:errMsg,sticky:true,block:true});
					return;
				}
				me.root.animate({height:0},function(){
					me.root.hide();
					me.taskDealIframe.show();
				});
				me.taskDealIframe[0].contentWindow.TaskListSupport=new function(){
					this.showTaskList=function(){
						me.taskDealIframe.hide();
						me.root.show().animate({height:"100%"},function(){
							$(window).resize();
						});
						me.dataTable.refresh();
					}
				}
			});
			if(setting.finish){
				setting.finish();
			}
		}
		
		me.page=LT.SimplePage.create();
		me.page.build(set);
		window.tableDataFinish=function(){
			var taskNumber=LT.synPost(setting.url+"_getTaskNumber.action",{});
				me.tableHeadDiv.find(".free").html("空闲"+taskNumber[0]+"笔");
				me.tableHeadDiv.find(".owned").html("私有"+taskNumber[1]+"笔");				
		}
//		set.url=setting.url+"_getTaskList.action";//查询数据的url
//		me.dataTable=LT.DataTable.create(me.root,{url:setting.url+"_tableModel.action"});//获取模型的url
//		me.dataTable.build(set);
//		me.initListMode=me.dataTable.getExtendData()["listMode"];
//		me.dataTable.setCaption(me.dataTable.getInitCaption()+(me.initListMode=="free"?" (空闲)":" (私有)"));
//		me.dataTable.condition({listMode:me.initListMode});
//		bindContextMenu(me);
//		me.taskDealIframe=$("<iframe  frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='yes' allowtransparency='yes'></iframe>");
//		me.taskDealIframe.css({width:"100%",height:"100%"}).hide().appendTo(document.body);
//		me.taskDealIframe.load(function(){
//			if(!me.progress){
//				return;
//			}
//			me.progress.stopProgress(true);
//			var errMsg=me.taskDealIframe[0].contentWindow.errMsg;
//			if(errMsg){
//				LT.infomation({title:"获取指定任务出现错误",content:errMsg,sticky:true,block:true});
//				return;
//			}
//			me.root.animate({height:0},function(){
//				me.root.hide();
//				me.taskDealIframe.show();
//			});
//			me.taskDealIframe[0].contentWindow.TaskListSupport=new function(){
//				this.showTaskList=function(){
//					me.taskDealIframe.hide();
//					me.root.show().animate({height:"100%"},function(){
//						$(window).resize();
//					});
//					me.dataTable.refresh();
//				}
//			}
//		});
	}
	function bindContextMenu(me){
		var menus=[];
		var dealTask={name:"处理该笔任务",icon:LT.getBasePath()+"/common/images/task/dealTask.png",action:function(){
			var data=me.dataTable.getSelectedRowDatas();
			if(data==null||data.length==0){
				data=me.dataTable.getSelectedRowData();				
			}else if(data.length>1){
				LT.infomation({content:"暂不支持通过此方法处理多笔任务"});
				return;				
			}else{
				data=data[0];
			}
			if(!data||!data.taskId){
				LT.infomation({content:"请选择一条需要处理的任务"});
				return;
			}
			me.progress=LT.startProgress({message:"努力加载中"});
			me.taskDealIframe.attr("src",me.setting.url+"_getTaskById.action?taskId="+data.taskId);
		}};
		var refresh={name:"刷新任务列表",icon:LT.getBasePath()+"/common/images/tool/refresh.png",action:function(){
			me.dataTable.refresh();
		}};
		var children=[];
		var selectedIcon=LT.getBasePath()+"/common/images/tool/selected.png";
		var free={name:"空闲任务",icon:me.initListMode=="free"?selectedIcon:null,action:function(){
			me.dataTable.query({listMode:"free"});
			free.icon=selectedIcon;
			owned.icon=null;
//			me.dataTable.setCaption(me.dataTable.getInitCaption()+" (空闲)");
		}};
		me.freeItem=free;
		var owned={name:"私有的任务",icon:me.initListMode=="owned"?selectedIcon:null,action:function(){
			me.dataTable.query({listMode:"owned"});
			owned.icon=selectedIcon;
			free.icon=null;
//			me.dataTable.setCaption(me.dataTable.getInitCaption()+" (私有)");
		}};
		me.ownedItem=owned;
		var showType={name:"显示类型",children:[free,owned]};
		menus.push(dealTask);
		menus.push(refresh);
		menus.push(null);
		menus.push(showType);
		if(me.setting.menu){
			menus.push(null);
			for(var i=0;i<me.setting.menu.length;i++){
				menus.push(me.setting.menu[i]);
			}
		}
		me.dataTable.contextMenu({items:menus});
	}

 }
 