/**
 * 创建于:2014-8-19<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 任务日志插件
 * @author chender
 * @version 1.0.0
 */
LT.requireLTPlugin(["dataTable"]).requireChart();
LT.loadCss(LT.getBasePath()+"/common/workframe/liontech/plugin/taskLog/taskLog.css");
LT.TaskLog=new function(){
	var table=null;
	var tableRoot=null;
	var showRoot=null;
	var me=this;
	this.show=function(setting){
		if($("#lt-tasklog-root").length!=0){
			LT.infomation({content:"请不要重复打开该窗口"});
			return;
		}
		var p={rootProcessDefId:null,bizKey:null};
		$.extend(p,setting);

		var wd=LT.createWindow({width:800,height:400,block:true,minable:false,maxable:false,pos:"center"});
		wd.css({left:0,top:0,width:"100%",height:"100%",overflow:"hidden"});
		var root=$("<div style='position:relative;overflow:hidden;' id='lt-tasklog-root'></div>").css({position:"relative",width:"100%",height:"100%"});
		tableRoot=$("<div style='position:absolute;left:0px;bottom:0px;top:0px;right:0px;'></div>").appendTo(root);
		showRoot=$("<div id='taskLog_bpmShow' style='position:absolute;left:0px;top:0px;width:10000px;height:10000px'></div>").appendTo(root);
		wd.setTitle("任务日志列表");
		wd.addContent(root);
		wd.appendTo(document.body);
		table=LT.DataTable.create(tableRoot,{actionName:LT.getBasePath()+"/liontech/taskLogAction"});
		table.condition({queryJson:LT.toString({rootProcessDefId:p.rootProcessDefId,bizKey:p.bizKey})});
		table.build({});
		root.contextMenu({items:[{name:"切换视图",action:function(){
			if(tableRoot.is(":hidden")){
				tableRoot.show();
				showRoot.hide();
			}else{
				tableRoot.hide();
				showRoot.show();
			}
		}}]});
		me.root=showRoot;
		window.tableDataFinish=function(){
			var allData=table.getAllData();
			var sourceNumberMap={};
			for(var i=0;i<allData.length;i++){
				var nn=allData[i]["sourceNodeId"];
				if(sourceNumberMap[nn]==null){
					sourceNumberMap[nn]=1;
				}else{
					sourceNumberMap[nn]=sourceNumberMap[nn]+1;
				}
			}
			me.snm=sourceNumberMap;
			var model=table.getUserData();
			me.elementId="taskLog_bpmShow";
			bpmShow(model);
			window.tableDataFinish=null;
			bindEvent(me);
			showRoot.hide();
		}
	}
	
	me.smaller=function(){
		if(me.scaleNumber<-10){
			LT.infomation({content:"已缩小到最小尺寸"});
			return;
		}
		me.scaleNumber=me.scaleNumber-1;
		me.zoom();
	}
	
	me.bigger=function(){
		if(me.scaleNumber>10){
			LT.infomation({content:"已放大到最大尺寸"});
			return;
		}
		me.scaleNumber=me.scaleNumber+1;
		me.zoom();
	}
	
	function bpmShow(model){
		  var chart = new Highcharts.Chart({
		        chart: {
			   		reflow:true,
		            renderTo: me.elementId,
		            events: {
		                load: function () {
		                	me.pen = this.renderer,
		                	me.maxPoint={x:0,y:0};
		                	drawLines(me,model.lines);
		                	drawShapes(me,model.shapes);		           
		                }
		            }
		        },
		        title: {
		            text: model.name
		        }
		    });
		   initView(me);
	}

	function initView(me){
		me.scaleNumber=0;
		me.offset={left:0,top:0}
		me.svg=$("#"+me.elementId).find("svg");
		me.vml=$("#"+me.elementId).find(">.highcharts-container").children()[0];
		me.draggable=true;
//		me.startRefreshTaskNumber();
		me.justifyView();
	}

	me.justifyView=function(){
		me.zoom();
	}

	me.zoom=function(){
		var svg=me.svg;
		var scaleNumber=me.scaleNumber;
		var offset=me.offset
		var width=me.root.width();
		var height=me.root.height();
		var temp=null;
		if(svg!=null&&svg.length==1){
			temp=Math.pow(1.05,scaleNumber);
			svg[0].setAttribute("viewBox","0 0 "+width/temp+" "+height/temp);
		}else{
			me.scaleNumber=scaleNumber=0;
			temp=Math.pow(1.05,scaleNumber);
		}
		me.absMaxPoint={x:me.maxPoint.x*temp,y:me.maxPoint.y*temp};
		var userNodeRoots=me.root.find(".taskNodeRoot");
		var scalables=me.root.find(".highcharts-scalable");
		for(var i=0;i<userNodeRoots.length;i++){
			var un=$(userNodeRoots[i]);
			var shape=un.data("shape");
			var curW=shape.width*temp;
			var curH=shape.height*temp;
			un.css({width:curW,height:curH});
			var nn=un.find(".nodeName");
			if(shape.type=="userTask"){	
				nn.css({left:(curW-nn.width())/2,top:(curH-nn.height())/2});
			}else{
				nn.css({left:(curW-nn.width())/2,top:curH+8});
			}
		}
		for(var i=0;i<scalables.length;i++){
			var s=$(scalables[i]);
			if(!s.data("pos")){		
				var left=parseInt(s.css("left").replace("px",""));
				var top=parseInt(s.css("top").replace("px",""));
				s.data("pos",{left:left,top:top})
			}
			var pos=s.data("pos");
			s.css({left:pos.left*temp,top:pos.top*temp});
		}
	}
	
	function bindEvent(me){
		me.root=$("#"+me.elementId);
		me.root.bind("mousewheel",function(evt, delta){
			evt=evt.sourceEvent||window.event;
			var dir=evt.wheelDelta||evt.detail;
			if(dir<0){//缩小
				me.smaller();
			}else{//放大
				me.bigger();
			}
		});
		me.root.draggable({
			start:function(){
			 return !!me.draggable;
			},
			drag:function(event,ui){
				if(me.svg!=null&&me.svg.length==1){
					me.offset={left:parseInt(me.svg.css("left").replace("px","")),top:parseInt(me.svg.css("top").replace("px",""))};
				}
				me.justifyView();
			},
			distance:15,
			cursor:"pointer",
			revert:function(){
				var left=parseInt(me.root.css("left").replace("px",""));
				var top=parseInt(me.root.css("top").replace("px",""));
				var animate=null;
				var amb=me.absMaxPoint;
				var maxLeft=me.root.parent().width()-amb.x-100;//100是距离边界的位置
				var maxTop=me.root.parent().height()-amb.y-100;
				maxLeft=maxLeft>0?0:maxLeft;
				maxTop=maxTop>0?0:maxTop;
				if(left>0){
					animate={left:"0px"};
				}else if(left<maxLeft){
					animate={left:maxLeft};
				}
				if(top>0){
					animate=animate?animate:{};
					animate.top="0px";
				}else if(top<maxTop){
					animate=animate?animate:{};
					animate.top=maxTop;
				}
				if(animate){
					me.root.animate(animate);
				}
				return false;
			}
		});
	}

	function drawLines(me,lines){
		for(var i=0;i<lines.length;i++){
			me.pen.path(lines[i].points).attr({'stroke-width': 2, stroke: 'black'}).add();
			var label=lines[i].nameLabel;
			if(label){
				var name="<div class='bpmLabel_"+i+"'>"+label.name+"</div>"
				me.pen.label(name, label.x, label.y,"square",0,0,true,null,"scalable")
		        .css({ color: 'black',  fontWeight: 'bold'})
		        .add();
				var labelElement=$(".bpmLabel_"+i);
				recordMaxPoint(me,label.x+labelElement.width(),label.y+labelElement.height());
			}
		}
	}

	function drawShapes(me,shapes){
		for(var i=0;i<shapes.length;i++){
			var shape=shapes[i];
			var symbol="square";
			var finished=me.snm[shape.name]!=null;
			var fillColor=finished?"#52F3EB":"#BBF7C7";
			var rootString="<div class='nodeName'>"+shape.name+"</div>";
			if(shape.type=="start"||shape.type=="end"){
				symbol="circle";
				if(shape.type=="end"){
					fillColor="#F4553C";	
				}
			}else if(shape.type=="exclusiveGateway"){
				symbol="diamond";
				fillColor="#F4553C";	
			}else if(shape.type=="parallelGateway"){
				symbol="diamond";
				fillColor="#F4553C";	
			}else if(shape.type=="gateway"){//TODO
				symbol="diamond";
				fillColor="#F4553C";	
			}
			rootString="<div class='taskNodeRoot bpmNode_"+i+"'>"+rootString+"</div>";
			var svgItem=me.pen.label(rootString, shape.x, shape.y,symbol,0,0,true,null,"scalable")
			.attr({width:shape.width,height:shape.height,r:shape.width/2,fill:fillColor, stroke: "black",'stroke-width': 1})
	        .css({ color: 'black',  fontWeight: 'bold',cursor:"pointer"})
	        .add();
			recordMaxPoint(me,shape.x+shape.width,shape.y+shape.height);
			var userNodeRoot=$(".bpmNode_"+i);
			userNodeRoot.css({width:shape.width,height:shape.height}).data("shape",shape);
			if(shape.type=="userTask"){				
//				userNodeRoot.append($("<div class='taskNumber'><div class='free'></div><div>/</div><div class='locked'></div></div>").attr("nodeName",shape.name));
//				bindSvgEvent(me,userNodeRoot,shape);
			}
			function bindSvgEvent(me,userNodeRoot,shape){
				userNodeRoot.contextMenu({});
				userNodeRoot.click(function(evt){
					var evt = evt || window.event;
					var s = evt.fromElement ;
					if (this.contains(s)){
						return;
					}				
					var tn=userNodeRoot.data("taskNumber");
					if(tn){
						var content=$("<div></div>");
						content.append($("<div></div>").html("总任务数:"+(tn.free+tn.locked)));
						var free=$("<div></div>").html("空闲任务:"+tn.free);
						var locked=$("<div></div>").html("私有任务:"+tn.locked);
						content.append(free);
						content.append(locked);
					}
				});
			}
		}
	}

	function recordMaxPoint(me,x,y){
		if(x>me.maxPoint.x){
			me.maxPoint.x=x;
		}
		if(y>me.maxPoint.y){
			me.maxPoint.y=y;
		}
	}	
}
