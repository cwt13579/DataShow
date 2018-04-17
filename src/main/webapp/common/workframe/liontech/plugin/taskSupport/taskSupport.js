/**
 * 创建于:2014-6-9<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 任务界面插件支持
 * @author chender
 * @version 1.0.0
 */
 LT.TaskSupport=new function(){
	 /**
	  * 第一个参数是当前的任务id，第二个参数表示是否自动获取下一笔任务
	  */
	this.create=function(taskId,nextTask,fromList){
		var me={taskId:taskId,nextTask:nextTask=="true",fromList:fromList};
		me.build=function(rootElement,setting){
			build(this,rootElement,setting)
		}
		me.submitTask=function(data){
			var url=me.setting.url;
			var param=$.extend({taskId:me.taskId},data);
			var pro=LT.startProgress({message:"正在提交任务"});
			LT.asynPost(url+"_fireCommit.action",param,function(result){
				pro.stopProgress(true);
				if(result=="success"){
					if(me.nextTask){
						LT.startProgress({message:"正在获取任务"});
						LT.changeUrl(me.setting.url+"_obtainTask.action");	
						return;
					}
					$("body>*").fadeOut();
					var buttons=["本次是","一直是","休息一会儿"];
					if(me.fromList){
						buttons.push("任务列表");
					}
					LT.dialog({width:555,title:"提示",message:"任务已提交,是否自动获取下一笔?",buttons:buttons,pos:"center",closable:false},function(choice){
						if(choice=="本次是"){
							LT.startProgress({message:"正在获取任务"});
							LT.changeUrl(me.setting.url+"_obtainTask.action");	
						}else if(choice=="一直是"){
							LT.startProgress({message:"正在获取任务"});
							LT.changeUrl(me.setting.url+"_obtainTask.action?nextTask=true");	
						}else if(choice=="休息一会儿"){
							me.rest.stop().show().animate({top:0});
						}else{
							window.TaskListSupport.showTaskList();
						}
					});
					
				}else{
					LT.infomation({content:result});
				}
			});
		}
		me.giveUpTask=function(data){
			var url=me.setting.url;
			var param=$.extend({taskId:me.taskId},data);
			var pro=LT.startProgress({message:"正在放弃任务"});
			LT.asynPost(url+"_fireGiveUp.action",param,function(result){
				pro.stopProgress(true);
				if(result=="success"){
					if(me.nextTask){
						LT.startProgress({message:"正在获取任务"});
						LT.changeUrl(me.setting.url+"_obtainTask.action");	
						return;
					}
					$("body>*").fadeOut();
					var buttons=["本次是","一直是","休息一会儿"];
					if(me.fromList){
						buttons.push("任务列表");
					}
					LT.dialog({width:555,title:"提示",message:"任务已放弃,是否自动获取下一笔?",buttons:buttons,pos:"center",closable:false},function(choice){
						if(choice=="本次是"){
							LT.startProgress({message:"正在获取任务"});
							LT.changeUrl(me.setting.url+"_obtainTask.action");	
						}else if(choice=="一直是"){
							LT.startProgress({message:"正在获取任务"});
							LT.changeUrl(me.setting.url+"_obtainTask.action?nextTask=true");	
						}else if(choice=="休息一会儿"){
							me.rest.stop().show().animate({top:0});
						}else{
							window.TaskListSupport.showTaskList();
						}
					});
					
				}else{
					LT.infomation({content:result});
				}
			});
		}
		return me;
	}
	
	function build(me,rootElement,setting){
		var defaultSetting={submitTask:true,giveUpTask:true,width:120,height:30}
		var s=me.setting=$.extend(defaultSetting,setting);
		if(s.submitTask){
			var submitDiv=$("<div></div>").css({float:"right",marginRight:10,width:s.width,height:s.height}).appendTo(rootElement);
			var submitButton=LT.createButton(s.width,s.height,"005","提交任务").appendTo(submitDiv);
			submitButton.click(function(){
				var param={};
				if(me.setting.beforeSubmit){
					param=me.setting.beforeSubmit();
				}
				me.submitTask(param);
			});
		}
		if(s.giveUpTask){
			var giveUpDiv=$("<div></div>").css({float:"right",marginRight:10,width:s.width,height:s.height}).appendTo(rootElement);
			var giveUpButton=LT.createButton(s.width,s.height,"014","放弃任务").appendTo(giveUpDiv);
			giveUpButton.click(function(){
				var param={};
				if(me.setting.beforeGiveUp){
					param=me.setting.beforeGiveUp();
				}
				me.giveUpTask(param);
			});
		}
		me.rest=$("<div id='lt_task_iWantRest'></div>").css({position:"fixed",width:"100%",height:"100%",top:"-100%",left:0}).hide().appendTo("body");
		var img=$("<img></img>").css({width:"100%",height:"100%"})
		.attr("src",LT.getBasePath()+"/common/images/task/rest.png").appendTo(me.rest);
		var tip=$("<div>休息中...</div>").css({position:"absolute",width:"100%",color:"blue",fontSize:23,textAlign:"center",top:50}).appendTo(me.rest);
		img.attr("title","双击继续进行任务处理");
		img.dblclick(function(){
			LT.startProgress({message:"正在获取任务"});
			me.rest.animate({top:"-100%"},function(){
				LT.changeUrl(me.setting.url+"_obtainTask.action");	
			});			
		});
	}
 }
 