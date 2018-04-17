/**
 * 创建于:2014-2-18<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * Liontech前端基础js服务
 * 
 * @author chender
 * @version 1.0.0
 */
if(!top){
	top={};
	top.SF={desktop:{},devMode:true};
	top.theme=window.theme||"ui-bootstrap";
}
if(!top.SF){
	top.SF={desktop:{},devMode:true};
}
LT=new function() {
	var version = "1.0.0";
	var timeOut = 0;
	var comErr;
	var responseFormatBad = null;
	var dealException = null;
	
	var ltInfomation=null;

	var instance = this;
	
	var loadedJs={};
	
	var loadedCss={};
	
	var jsResourceMap={};
	
	var listeners={};
	// 所有的资源请求的时间戳参数，既能保证版本更新时能取到最新的资源，又能做相同的资源请求不会重复的被发送到后台(因为在刷新主界面之前该参数始终保持不变)
	this.timeTag=new Date().getTime();
	
	this.simpleStyle=true;// 简单生活
	
	var urlParams={};
	
	buildUrlParam();
	/**
	 * url 访问的url
	 * par json对象，可不传  
	 */
	this.downcsv=function(url,par){
		var form=$("<form>");//定义一个form表单
		form.attr("style","display:none");
		form.attr("target","");
		form.attr("method","post");
		form.attr("action",url);
		
		if (par){ 
			for (var k in par){
			var  input1=$("<input>");
			input1.attr("type","hidden");
			input1.attr("name",k);
			input1.attr("value",par[k]);
			form.append(input1);
			}
			$("body").append(form);//将表单放置在web中
		}
		form.submit();//表单提交
	}
	function buildUrlParam(){
		var str=location.href;
		if(str.indexOf("?")>0){
			str=str.substring(str.indexOf("?")+1,str.length);
			var array=str.split("&");
			for(var i=0;i<array.length;i++){
				if(array[i]==null||array[i]==""){
					continue;
				}
				var kv=array[i].split("=");
				if(kv.length==2){
					urlParams[kv[0]]=kv[1];
				}
			}
		}
	}
	
	this.getUrlParam=function(key){
		return urlParams[key];
	}
	var shell=null;
	this.msCmd=function(cmd){
		if(!$.browser.msie){
			return;
		}
		if(shell==null){
			shell=new ActiveXObject("WScript.shell");
		}
		shell.run(cmd);
	}

	/**
	 * 同步post请求
	 */
	this.synPost = function(url, paramJson,noPackage,noJson) {
		return ajax(url, false, "post", paramJson,null,noPackage,noJson);
	};
	/**
	 * 异步post请求
	 */
	this.asynPost = function(url, paramJson, callBack,noPackage,noJson) {
		return ajax(url, true, "post", paramJson, callBack,noPackage,noJson);
	};
	/**
	 * 同步get请求
	 */
	this.synGet = function(url, paramJson,noPackage,noJson) {
		return ajax(url, false, "get", paramJson,null,noPackage,noJson);
	};
	/**
	 * 异步get请求
	 */
	this.asynGet = function(url, paramJson, callBack,noPackage,noJson) {
		return ajax(url, true, "get", paramJson, callBack,noPackage,noJson);
	};
	/**
	 * 获取context路径
	 */
	this.getContextPath = function() {
		return window.location.pathname.split("/")[1];
	};
	/**
	 * 获取basePath路径
	 */
	this.getBasePath = function() {
		var bp=LT.basePath;
		if(bp==null){
			 bp=window.location.protocol + "//" + window.location.host + "/"
				+ this.getContextPath();		
		}
		return bp;
	};
	this.getCurPath=function(){
		return LT.curPath==null?(LT.curPath=location.href.substring(0,location.href.lastIndexOf("/"))):LT.curPath;
	}
	
	this.urlParamToMap=function(up){
		var a=up.split("&");
		var p={};
		for(var i in a){
			var b=a[i].split("=");
			if(b.length==2){
				p[b[0]]=b[1];
			}
		}
		return p;
	}
	
	/**
	 * 页面跳转
	 * 
	 * @param 目标url
	 */
	this.changeUrl = function(url) {
		location.href = url;
	};

	this.reload = function() {
		LT.changeUrl(location.href);
	};
	/**
	 * 将字符串转为json
	 */
	this.toJson = function(string) {
		try{
			if(string==null){
				return null;
			}
			if (typeof JSON == 'undefined') {
				return eval('(' + string + ')');
			}
			return JSON.parse(string);
		}catch (e) {
			throw new Error("错误的格式:"+string);
		}
		
	};
	
	this.openApp=function(key){
		top.SF.openApp(key);
	}
	
	this.closeApp=function(key){
		top.SF.closeApp(key);
	}

	this.toString=function(json){
		return JSON.stringify(json);
	}
	
	this.browseBack = function(step) {
		history.go(step);
	};
	
	this.isIe8=function(){
		return $.browser.msie&&$.browser.version=="8.0";
	}

	
	/**
	 * 依赖jquery
	 */
	this.theme="default";
	this.requireJquery = function(noJqueryUi) {
		loadJs(LT.getBasePath()+"/common/workframe/jquery/jquery.min.js");
		loadJs(LT.getBasePath()+"/common/workframe/jquery/jqurey-migrate.js");
		loadJs(LT.getBasePath()+"/common/workframe/jquery/jqueryRotate.min.js");
		if(!noJqueryUi){
			if(window.attachEvent){// ie下使用1.11版本的jqueryui有bug,用1.9.0的版本
				loadJs(LT.getBasePath()+"/common/workframe/jquery/jquery-ui.ie.js");
			}else{				
				loadJs(LT.getBasePath()+"/common/workframe/jquery/jquery-ui.min.js");
			}
		}
		try {
			top.LT;
		} catch (e) {// 跨域
			top={};
		}
		if((LT!=top.LT&&top.SF)||top.theme){// 模块页面或自定义theme
			var theme=top.SF.desktop.theme||top.theme ||window.theme ;
			if(!theme){
				theme="ui-bootstrap";
			}
			loadCss(LT.getBasePath()+"/common/workframe/jquery/themes/"+theme+"/jquery-ui.min.css");
		}
		return instance;
	};
	
	this.loadTheme=function(theme){
		loadTheme(LT.getBasePath()+"/common/workframe/jquery/themes/"+theme+"/jquery-ui.min.css");
		return this;
	};
	
	/**
	 * 依赖primeui
	 */
	this.requirePrimeUi=function(widgets){
		if(widgets==null){
			widgets=["growl","button"];
		}else{
			widgets.push("growl");
			widgets.push("button");
		}
		loadJs(LT.getBasePath()+"/common/workframe/primeui/js/core.js");
		loadJs(LT.getBasePath()+"/common/workframe/primeui/js/sh.js");
		/*loadCss(LT.getBasePath()+"/common/workframe/primeui/css/all.css");*/
		loadCss(LT.getBasePath()+"/common/workframe/primeui/css/sh.css");
		loadCss(LT.getBasePath()+"/common/workframe/primeui/css/core.css");
		for ( var index in widgets) {
			if(widgets[index]=="calendar"||widgets[index]=="date"){
				loadJs(LT.getBasePath()+"/common/workframe/primeui/js/datepicker.min.js");
				continue;
			}
			loadJs(LT.getBasePath()+"/common/workframe/primeui/js/" + widgets[index] + ".js");
			loadCss(LT.getBasePath()+"/common/workframe/primeui/css/" + widgets[index] + ".css");
		}
		return instance;
	};
	
	this.requireChart=function(subPlugins){
		loadJs(LT.getBasePath()+"/common/workframe/chart/highcharts.js");
		loadJs(LT.getBasePath()+"/common/workframe/chart/highcharts-more.js");
		loadJs(LT.getBasePath()+"/common/workframe/chart/highcharts-3d.js");		
		loadJs(LT.getBasePath()+"/common/workframe/chart/themes/sand-signika.js");
		if(subPlugins&&subPlugins.length>0){
			for(var i=0;i<subPlugins.length;i++){
				loadJs(LT.getBasePath()+"/common/workframe/chart/lt_plugin/"+subPlugins+".js");
			}
		}
		return this;
	};
	
	
	this.requireContextMenu=function(){
		loadJs(LT.getBasePath()+"/common/workframe/contextMenu/contextMenu.js");
		loadCss(LT.getBasePath()+"/common/workframe/contextMenu/contextMenu.css");
		return this;
	}
	
	/**
	 * 依赖jqgrid数据表格
	 */
	this.requireJqGrid=function(){
		loadJs(LT.getBasePath()+"/common/workframe/jqgrid/grid.locale-cn.js");
		loadJs(LT.getBasePath()+"/common/workframe/jqgrid/jquery.jqGrid.js");
		loadCss(LT.getBasePath()+"/common/workframe/jqgrid/ui.jqgrid-t.css");
		return instance;
	};
	
	this.requireLTPlugin=function(pluginNames){
		for(var i=0;i<pluginNames.length;i++){
			if(pluginNames[i]=="tree"){
				this.requireZtree();
				continue;
			}
			loadJs(LT.getBasePath()+"/common/workframe/liontech/plugin/"+pluginNames[i]+"/"+pluginNames[i]+".js");
		}
		return this;
	}
	
	this.requireScrollBar=function(){
		loadCss(LT.getBasePath()+"/common/workframe/scrollBar/scrollBar.css");
		return this;
	}
	

	/**
	 * 依赖ztree
	 */
	this.requireZtree = function() {
		loadJs(LT.getBasePath()+"/common/workframe/ztree/jquery.ztree.core-3.5.min.js");
		loadJs(LT.getBasePath()+"/common/workframe/ztree/jquery.ztree.exhide-3.5.min.js");
		loadJs(LT.getBasePath()+"/common/workframe/ztree/jquery.ztree.excheck-3.5.min.js");
		loadJs(LT.getBasePath()+"/common/workframe/ztree/jquery.ztree.exedit-3.5.min.js");
		loadCss(LT.getBasePath()+"/common/workframe/ztree/zTreeStyle.css");
		return instance;
	};

	/**
	 * 依赖bootstrap
	 */
	this.requireBootstrap = function() {
		loadJs(LT.getBasePath()+"/common/workframe/bootstrap/js/bootstrap.min.js");
		loadCss(LT.getBasePath()+"/common/workframe/bootstrap/css/bootstrap.min.css");
		loadCss(LT.getBasePath()+"/common/workframe/bootstrap/css/bootstrap-theme.min.css");
		return instance;
	};
	
	this.error=function(message){
		return this.infomation({content:message,sticky:true,block:true,type:"error"});
	}
	
	this.imageShow=function(thumbImages,images,imageNames,curIndex,extra){
	  var imageShow=top.SF.getApp("imageShow");
	  if(extra&&extra.max){
		  imageShow.max=true;
	  }
	  top.SF.openApp(imageShow);	
	  if(extra&&extra.max){
		  imageShow.max=false;
	  }
	  imageShow.setImages(thumbImages,images,imageNames,curIndex,extra);
	}
	
	/**
	 * 显示提示消息
	 */
	this.infomation=function(message,param) {
		var setting={type:"info",block:false,title:"提示",time:2000,width:300,sticky:false,pos:null,parent:document.body,element:null,location:"auto",animateTime:"nomal"}
		$.extend($.extend(setting,message),param);
		var pw=$(setting.parent)[0].clientWidth;
		var ph=$(setting.parent)[0].clientHeight;
		var result={};
		var ltInfomation=null;
		if((ltInfomation=($(setting.parent).find(">#lt-infomation"))).length==0){
			ltInfomation=$("<div id='lt-infomation'></div>").css("position","absolute");
			if(!ltInfomation.puigrowl){
				alert(message.content);
				return;
			}
			ltInfomation.appendTo($(setting.parent));
			ltInfomation.puigrowl({
				sticky : false,
				life : 1500,
				parent:setting.parent
			});
		}
		if($(setting.parent)[0]==document.body){
			ltInfomation.css("position","fixed");
			pw=$(window).width();
			ph=$(window).height();
		}else{
			ltInfomation.css("position","absolute");
		}
		ltInfomation.close=function(){
			ltInfomation.puigrowl("close");
		}
		ltInfomation.puigrowl("setWidth",setting.width);
		ltInfomation.puigrowl("setBlock",setting.block);
		ltInfomation.puigrowl("setLife",setting.time);
		ltInfomation.puigrowl("setSticky",setting.sticky);
		ltInfomation.puigrowl("setAnimateTime",setting.animateTime);
		ltInfomation.puigrowl('show', [ {
			severity : setting.type,
			summary : setting.title,
			detail : setting.content
		} ]);
		var tag=new Date().getTime();
		ltInfomation.data("lt-infomation-tag",tag);
		result.tag=tag;
		result.close=function(a){
			if(this.tag!=ltInfomation.data("lt-infomation-tag")){// 已被别人占用，不用关了
				return;
			}
			ltInfomation.close(a);
		}
		if(setting.pos){
			ltInfomation.css(setting.pos);
			return result;
		}
		if(setting.element){// 显示在某个元素附近
			setting.element=$(setting.element);
			if(setting.location==null){
				setting.location="auto"; // 自适应
			}
			var p=setting.element.offset();
			var left=p.left,top=p.top;
			if(setting.location=="auto"){
				top=top-ltInfomation.height();
				left=left-(ltInfomation.width()-setting.element.width())/2;
				if(top<0){// 到下边
					top=p.top+setting.element.height()+5;
				}
				if(left<0){// 到右边
					top=p.top-(ltInfomation.height()-setting.element.height())/2;
					left=p.left+setting.element.width()+3;
				}else if(left+ltInfomation.width()>$(setting.parent).width()){
					left=p.left-ltInfomation.width()-3;
					top=p.top-(ltInfomation.height()-setting.element.height())/2;
				}
			}else if(setting.location=="up"){
				top=top-ltInfomation.height()+5;
				left=left-(ltInfomation.width()-setting.element.width())/2;
			}else if(setting.location=="right"){
				left=left+setting.element.width();
				top=top-(ltInfomation.height()-setting.element.height())/2;
			}else if(setting.location=="left"){
				left=left-ltInfomation.width();
				top=top-(ltInfomation.height()-setting.element.height())/2;
			}else{// 默认down
				top=top+setting.element.height()+10;
				left=left-(ltInfomation.width()-setting.element.width())/2;
			}
			left=left<0?0:left;
			top=top<0?0:top;
			if(left+ltInfomation.width()>$(setting.parent).width()){
				left=$(setting.parent).width()-ltInfomation.width()-5;
			}
			ltInfomation.css({left:left,top:top});
			return result;
		}
		var pos={};
		if(setting.location){
			if(setting.location=="auto"){
				pos.left=(pw-ltInfomation.width())/2;
				pos.top=(ph-ltInfomation.height())/2;
			}
		}
		pos.left=pos.left<0?0:pos.left;
		pos.left=pos.left>pw-ltInfomation.width()?pw-ltInfomation.width():pos.left;
		pos.top=pos.top<0?0:pos.top;
		pos.top=pos.top>ph-ltInfomation.height()?ph-ltInfomation.height():pos.top;
		ltInfomation.css(pos);
		return result;
	};
	
	this.getImage=function(path){
		return LT.getBasePath()+"/common/images/"+path;
	}
	
	var runingCompute=0;
	var preBg=null;
	var preRoot=null;
	var preContent;
	var progressParam={expectTime:1000,timeOut:10000,message:"正在努力加载",really:false,showPercent:false,bgOpacity:0.15,opacity:0.35};
	this.setProgressParam=function(param){
		$.extend(progressParam,param);
	}
	this.startProgress=function(param){
		function Progress(param){
			var runningNum=runingCompute;
			var atLeft=(runningNum%2==0);// 在左侧显示
			var fix=atLeft?-155*parseInt(runningNum/2):155*parseInt((runningNum+1)/2);
			var key=new Date().getTime();
			var p=$.extend({},progressParam);
			p.parent=document.body;
			$.extend(p,param);
			if(p.expectTime>p.timeOut-5000){
				p.timeOut=p.expectTime+5000;
			}
			if(runingCompute==0){
				preRoot=$("<div style='text-align:center;position:absolute;width:100%;height:100%;top:0px;left:0px;z-index:9998'></div>").appendTo(p.parent);
				preBg=$("<div style='text-align:center;color:blue;z-index:9999;position:absolute;width:100%;height:100%;top:0px;left:0px'></div>").appendTo(p.parent).contextMenu({});
				preContent=$("<div style='position:relative;top:37%;height:132px;overflow-y:hidden'></div>").appendTo(preBg);
				if($(p.parent)[0]==document.body){
					preRoot.css("position","fixed");
					preBg.css("position","fixed");
				}
				if(!($.browser.msie&&($.browser.version == "8.0"))){
					preRoot.addClass("ui-widget-overlay").css("opacity",p.bgOpacity);
				}
			}
			var blockBg=$("<div  style='height:132px;width:150px;margin-left:"
					+fix+"px;left:40%;border-radius:15px;position:absolute;background-color:white'></div>").appendTo(preContent);
			if(!($.browser.msie&&($.browser.version == "8.0"))){
				preRoot.css("opacity",p.opacity);
			}
			var block=$("<div style='height:132px;width:150px;left:40%;position:absolute;margin-left:"+fix+"px;border-radius:15px;'></div>").appendTo(preContent);
			var imgSrc=getResource("common/images/progress/progress_5.gif");
			var timeOutSrc=getResource("common/images/progress/timeOut.png");
			var cancelSrc=getResource("common/images/progress/exit.png");
			var img=$("<img style='position:relative;height:96px;width:96px;left:0px;top:5px' />").attr("src",imgSrc).appendTo(block);
			var timeOutImg=$("<img style='position:relative;height:96px;width:96px;left:0px;top:-182px;'/>").attr("src",timeOutSrc).css("opacity",0).appendTo(block);
			var cancel=$("<img style='cursor:pointer;top:2px;right:2px;position:absolute' />").attr("src",cancelSrc).click(function(){
				stopProgress(true);
			}).appendTo(block).hide();
			var timeLabel=$("<div style='font-size:16px;color:blue;position:absolute;font-weight:bold;width:20px;height:20px;top:2px;right:2px'></div>").appendTo(block);
			var tempMessage=p.message;
			if(tempMessage.length>8){
				tempMessage=tempMessage.substring(0,8)+"..";
			}
			var message=$("<div style='top:100px;left:10px;right:10px;color:blue;font-weight:bold;font-size:12px;position:absolute;'></div>").html(tempMessage).attr("title",p.message).appendTo(block);
			var dot=$("<a style='color:blue'></a>").html(".").appendTo(message);
			var percentArea=null;
				percentArea=$("<div style='font-size:25px;position:relative;left:0px;top:-162px'>0%</div>").appendTo(block);
			if(!p.showPercent){
				percentArea.hide();
			}
			
			var timeOutArea=$("<div style='font-size:13px;position:absolute;font-weight:bold;top:100px;left:10px'>时间有点长了,但你可以尝试继续等待<div>");
			
			var processTime=0;
			var percent=0;
			var stop=false;
			var $this=this;
			runingCompute++;;
// if(p.showPercent){
				window.setTimeout(animate, 50);
// }
			var number=1;
			function animate(){
				if(!stop){
					timeLabel.html(parseInt(processTime/1000));
					processTime+=50;
					
					var percent=parseInt(processTime/p.expectTime*100);
					
// var plus=parseInt((100-percent)/10);
// plus=plus==0?1:plus;
// percent=percent+plus;
					percent=percent>99?99:percent;
					percentArea.html(percent+"%");	
					number=processTime%1600;
					
					if(number>1200){
						dot.html("........");
					}else if(number>800){					
						dot.html("......&nbsp&nbsp");
					}else if(number>400){
						dot.html("....&nbsp&nbsp&nbsp&nbsp");
					}else{				
						dot.html("..&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp");
					}
					if(processTime>p.timeOut){
						timeOut();
					}else{
						window.setTimeout(animate, 50);
					}
					
				}
			}
			
			function timeOut(){
				percentArea.hide();
				timeLabel.hide();
				message.remove();
				img.animate({top:101,opacity:0});
				timeOutImg.animate({top:-92,opacity:1},function(){
					block.append(timeOutArea);
					cancel.show();
				});		
			}
			
			this.setPercent=function(percent){
				if(!p.really){
					return;
				}
				percentArea.html(percent+"%");
			};
			
			this.stopProgress=function(ime){
				stopProgress(ime);
			};
			
			this.changeMessage=function(msg){
				message.html(msg);
			};
			
			function stopProgress(ime){
				if(ime){
					stop=true;
					blockBg.remove();
					block.remove();
					if(runingCompute==1){
						preContent.remove();
						preBg.remove();
						preRoot.remove();
					}
					runingCompute--;
				}else{
				setTimeout(function(){
					stop=true;
					blockBg.remove();
					block.remove();
					if(runingCompute==1){
						preContent.remove();
						preBg.remove();
						preRoot.remove();
					}
					runingCompute--;
				}, 300);
			}
			}
		}
		return new Progress(param);
	};
	
	
	this.dialog=function(param,callback,close){
		var p={title:"提示",message:"确定要进行该操作吗?",buttons:["是","否"],parent:document.body,value:null,block:true,animate:true,closable:true,width:500,height:240};
		$.extend(p,param);
		p.parent=$(p.parent);
		var w=p.width;
		var h=p.height;
		var clicked=false;
		var left=(p.parent.width()-w)/2-50;// 默认居中偏左上一点点
		var top=(p.parent.height()-h)/2-50;	
		if($(p.parent)[0]==document.body){
			left=($(window).width()-w)/2-50;
			top=($(window).height()-h)/2-50;	
		}
		if(param.pos=="center"){
			left+=50;
			top+=50;
		}
		left=left<0?0:left;
		top=top<0?0:top;
		var ltWindow=this.createWindow({parent:p.parent,block:p.block,width:w,height:h,left:left,top:top,closable:p.closable,minable:false},function(){
			if(close){
				close();
			}
		}).setTitle(p.title);
		if($(p.parent)[0]==document.body){
			ltWindow.css("position","fixed");
		}
		var content=$("<div style='position:relative;width:100%;height:100%'></div>");
		ltWindow.addContent(content).appendTo(p.parent);
		var infoImage=$("<img />").attr("src",getResource("common/workframe/liontech/img/selectWindow.png"))
		.css({position:"absolute",borderRadius:"15px",top:20,left:35}).height(h-90);
		infoImage.appendTo(content);
		var messageDiv=$("<div class='lt_theme_word_md' style='position:absolute;top:20px;right:20px;bottom:55px;word'></div>")
		.css("word-break", "break-all").css("left",(h-90)+60).html(p.message).appendTo(content);
		var buttonArea=$("<div style='position:absolute;left:0px;bottom:0px;width:100%;height:45px;'></div>").appendTo(content);
		var buttonWidth=(w-10)/p.buttons.length-10;
		buttonWidth=buttonWidth>120?120:buttonWidth;
		for(var i=p.buttons.length-1;i>=0;i--){			
			var bt=this.createButton(buttonWidth, 35, "005", p.buttons[i]).css({float:"right",marginRight:10}).appendTo(buttonArea)
			.click(function(){
				if(clicked){
					return;
				}
				clicked=true;
				var text=$(this).text()||$(this).val();
				if(p.animate){
					ltWindow.fadeOut(250,function(){
						ltWindow.close();
					});
				}else{
					ltWindow.close();
				}
				if(callback){					
					callback(text);
				}
			});
			if(i==p.buttons.length-1){
				bt.focus();
			}
		}
		if(p.animate){
			ltWindow.hide();
			ltWindow.fadeIn(250);
		}
	}
	
	/**
	 * 弹出确认框(尽量不要使用该方法)
	 */
	this.confirm=function(param,callback){
		var p={title:"确认该操作",yes:"是",no:"否",parent:document.body};
		$.extend(p,param);
		var id="confirm_"+new Date().getTime();
		var dia=$("<div></div>").attr("id",id).attr("title",p.title).appendTo(p.parent);
		var clicked=false;
		dia.puidialog({  
		        showEffect: 'fade',  
		        hideEffect: 'fade',  
		        minimizable: false,  
		        maximizable: false,  
		        resizable:false,
		        modal: true,  
		        buttonRTL:true,
		        effectSpeed:"fast",
		        buttons: [  
		               {  
		                text: p.no,  
		                icon: 'ui-icon-close',  
		                click: function() {  
		                	if(clicked){
		                		return;
		                	}
		                	callback("no");  
		                	$('#'+id).puidialog("hide");
		                	clicked=true;
		                }  
		            },
		            {  
		                text: p.yes,  
		                icon: 'ui-icon-check',  
		                click: function() {  
		                	if(clicked){
		                		return;
		                	}
		                	callback("yes"); 
		                	$('#'+id).puidialog("hide");
		                	clicked=true;
		                }  
		            },
		        ],
		        onClose:function(){
		        	if(clicked){
		        		return;
		        	}
		        	if(callback){
		        		callback("cancel");
		        	} 	
	            	clicked=true;
	            },
		        afterHide:function(){
		        	$('#'+id).remove();
                	$('#'+id+"_modal").remove();
		        }
		    });  
		dia.puidialog('show');  
	};
	
	this.download=function(url){
		var temp=window["lt-base-download-iframe"];
		if(temp==null){
			temp=window["lt-base-download-iframe"]={curIndex:0};
		}
		if(temp.curIndex==3){// 达到最大值
			temp["index_1"].close();
			temp["index_1"]=temp["index_2"];
			temp["index_2"]=temp["index_3"];
		}else{
			temp.curIndex++;
		}
		var pro=LT.startProgress({message:"正在请求"});
		var win=this.showPage({url:url,width:0,height:0,block:false},function(url,html){
			var infoUrl="common/jsp/upload/infomation.html?message=";
			var message=null;
			url=url==null?url:unescape(url);
			if(url!=null&&url.indexOf(infoUrl)>0){
				message=url.substring(url.indexOf(infoUrl)+infoUrl.length);
			}else{
				message=html;
			}
			try {
				var response=LT.toJson(message);
				if(response.status===1&&response.body){
					LT.infomation({content:response.body});						
					return;
				}else if(response.status===0&&response.errMessage){
					LT.error("错误码:"+response.errCode+"</br>错误描述:"+response.errMessage);	
					return;
				}
			} catch (e) {
				
			}
			LT.infomation({type:"error",content:"下载文件出现异常:"+message,sticky:true,block:true});
		});
		win.css("display","none");
		temp["index_"+temp.curIndex]=win;
		pro.stopProgress(false);
	}
	this.doSelect=function(url,callback,param){
		param=param||{};
		var p={url:url,width:param.w||800,height:param.h||500};
		var page=this.showPage(p,function(url,html,win){
			win["ber_select_cb"]=function(data){
				callback(data);
				page.close();
			}
		});
	}
	
	this.showPage=function(setting,loaded){
		var p={block:true,parent:document.body,draggable:false,minable:false,width:500,height:230}
		p=$.extend(p,setting);
		var win=this.createWindow({block:p.block,resizable:p.resizable,maxable:p.maxable,max:p.max,minable:p.minable,draggable:p.draggable,width:p.width,height:p.height},function(){
			if(p.close){
				return p.close();
			}
		})
		var iframe=$("<iframe  frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='yes' allowtransparency='yes'></iframe>");
		iframe.css({width:"100%",height:"100%"});
		win.addContent(iframe);
		win.setTitle(p.title);
		win.appendTo(p.parent);
		win.changeUrl=function(newUrl){
			iframe.attr("src",newUrl)
		}
		iframe.attr("src",p.url);
		var left=($(p.parent).width()-p.width)/2;
		var top=($(p.parent).height()-p.height)/2;
		win.css({left:left,top:top});
		iframe.load(function(){
			try {
				iframe[0].contentWindow.closeShowPage=function(){
					win.close();
				}
			} catch (e) {
				
			}	
			if(loaded!=null){
			var url=null;
			var html=null;
			try {
				url=iframe[0].contentWindow.location.href;
				html=$(iframe[0].contentWindow.document.body).html();
			} catch (e) {
				
			}
			loaded(url,html,iframe[0].contentWindow);
			}
		})
		return win;
	}
	
	this.createWindow=function(param,closed){
		var p={parent:document.body,headHeight:56,draggable:true,block:false,resizable:false,pos:null,width:500,height:250,left:0,top:0,closable:true,maxable:false,minable:true,max:false};
		$.extend(p,param);
		if(p.pos=="center"){
			p.left=$(window).width()/2-p.width/2;
			p.top=$(window).height()/2-p.height/2;
		}
		var root=$("<div class='lt_windowShadow' style='position:absolute;z-index:1001;background-color:white;border-radius: 5px 5px 0px 0px'></div>").data("state","l-m");
		root.css({width:p.width,height:p.height,left:p.left,top:p.top});
		if($.browser.msie&&$.browser.version == "8.0"){
			root.css("border","1px solid black").css("filter","none");
		}
		var bg=null;
		if(p.block){
			bg=$("<div class='ui-widget-overlay lt_window_block_bg'></div>")
			.appendTo(p.parent).click(function(){
				LT.lookAtMe(root,"shake");
			});
			if($.browser.msie&&($.browser.version == "8.0")){
				bg.css({backgroundImage:'url("data:image/gif; base64,AAAA")'}).removeClass("ui-widget-overlay");
			}
		}
		var topArea=$("<div class='lt_windowTop ui-widget-header' style='cursor:pointer;position:absolute;width:100%;height:"+p.headHeight+"px;border-radius:5px 5px 0px 0px;'></div>").appendTo(root);
		topArea.css("bolder-radius",5);
		var title=$("<div class='lt_theme_word_sm' style='float:left;margin-left:10px;font-size: 18px;color: #777;'></div>").appendTo(topArea);
		var oper=$("<div style='position:absolute;right:3px;width:auto'></div>").appendTo(topArea);
		var contentArea=$("<div style='border-width:0px !important;position:absolute;top:"+p.headHeight+"px;bottom:0px;display:block;width:100%' class='ui-widget-content'></div>").appendTo(root);
		contentArea.css("overflow","hidden")	
		root.setTitle=function(text){
			title.html(text);
			return root;
		}		
		root.contentArea=contentArea;
		root.addContent=function(content){
			contentArea.append(content);
			return root;
		}
		root.preAddContent=function(content){
			contentArea.prepend(content);
			return root;
		}	
		root.close=function(fireCloseEvent){
			if(fireCloseEvent&&closed&&closed()===false){
				return;
			}
			root.remove();
			if(bg!=null){
				bg.remove();
			}
		}	
		if(p.closable){
			$("<a class='lt_oper_close'></a>").click(function(){
				root.close(true);
			}).appendTo(oper);
		}
		var maxButton=null;
		if(p.maxable){
			 maxButton=$("<a class='lt_oper_max'></a>").click(function(){
				 changeSize();
			}).appendTo(oper);
		}
		topArea.dblclick(function(){
			 changeSize();
		});
		
		function changeSize(){
			if(root.data("min-pos")){
				root.animate(root.data("min-pos")).data("min-pos",null);
			}else if(root.data("max-pos")){
				root.animate(root.data("max-pos")).data("max-pos",null);
				if(maxButton){
					maxButton.attr("class","lt_oper_max");
				}	
			}else if(p.maxable){
				var max={left:0,top:0,width:"100%",height:"100%"};
				var pre={left:root.position().left,top:root.position().top,width:root.width(),height:root.height()}
				if(!root.data("max-pos")){
					root.data("max-pos",pre)
				}
				root.animate(max);
				if(maxButton){
					maxButton.attr("class","lt_oper_recover");
				}			
			}
		}
		if(p.minable){
			$("<a class='lt_oper_min'></a>").click(function(){
				if(root.data("min-pos")){
					return;
				}
				var pre={left:root.offset().left,top:root.offset().top,width:root.width(),height:root.height()};
				root.data("min-pos",pre).animate({left:pre.left,top:pre.top,width:230,height:23});
				if(maxButton){
					maxButton.attr("class","lt_oper_max");
				}	
			}).appendTo(oper);
		}
		if(p.draggable){
			root.draggable({
				distance:5,
				scroll:false,
				containment:"parent",
				handle:".lt_windowTop",
				start:function(){
					if(root.data("max-pos")&&!root.data("min-pos")){// 最大化
						return false;
					}
					LT.showDragFixDiv();
				},
				stop:function(){
					LT.hideDragFixDiv();
				}
			});
		}
		if(p.resizable){
// var
// operedDiv=$("<div></div>").css({position:"absolute",top:0,left:0,width:"100%",height:"100%",opacity:0.001,zIndex:9999,display:"none"});
			root.resizable({
				start:function(){
					LT.showDragFixDiv();
					if(root.data("pos")==null){
						return false;
					}
// operedDiv.show();
				},
				stop:function(){
// operedDiv.hide();
					LT.hideDragFixDiv();
					if(p.sizeChange){
						p.sizeChange();
					}
				}
			});
		}
		var evt=window.event;
		if(evt&&evt.srcElement){
			$(evt.srcElement).blur()
		}
		if(p.max){
			setTimeout(function(){
				changeSize();
			});
		}
		return root;
	}
	
	this.showDragFixDiv=function(){
		LT.dragFixedDiv=$("#dragFixedDiv");
		if(LT.dragFixedDiv.length==0){
			LT.dragFixedDiv=$("<div id='dragFixedDiv'><div>").appendTo(document.body);
			if($.browser.msie&&$.browser.version == "8.0"){
				LT.dragFixedDiv.css({backgroundImage:'url("data:image/gif; base64,AAAA")'});
			}
		}
		LT.dragFixedDiv.show();
	}
	
	this.hideDragFixDiv=function(){
		LT.dragFixedDiv.hide();
	}
	
	this.input=function(param,callback){
		var p={title:"请输入",ok:"确认",parent:document.body,value:null,check:null,block:true,width:330,height:130};
		$.extend(p,param);
		p.parent=$(p.parent);
		var w=p.width;
		var h=p.height;
		var clicked=false;
		var left=(p.parent.width()-w)/2-50;// 默认居中偏左上一点点
		var top=(p.parent.height()-h)/2-50;	
		if($(p.parent)[0]==document.body){
			left=($(window).width()-w)/2-50;
			top=($(window).height()-h)/2-50;	
		}
		left=left<0?0:left;
		top=top<0?0:top;
		var bg=null;
		var ltWindow=this.createWindow({width:w,height:h,left:left,top:top,minable:false},function(){
			if(bg){
				bg.remove();
			}
		}).setTitle(p.title);
		if(p.block){
			bg=$("<div class='ui-widget-overlay'></div>").css("z-index",1000).css({position:"fixed",width:"100%",height:"100%",top:0,left:0}).appendTo(p.parent).click(function(){
				LT.lookAtMe(ltWindow,"shake");
			});
		}
		if($(p.parent)[0]==document.body){
			ltWindow.css("position","fixed");
		}
		var content=$("<div style='position:relative;width:100%;height:100%'></div>");
		ltWindow.addContent(content).appendTo(p.parent);
		var inputDiv=$("<div class='lt_theme_word_md' style='position:absolute;top:20px;right:20px;bottom:55px'></div>")
		.css("left",10).appendTo(content);
		var inputElement=$("<textArea></textArea>").puiinputtextarea().appendTo(inputDiv)
		.css({position:"absolute",width:"100%",top:0,bottom:0}).val(p.value).select();
		var buttonArea=$("<div style='position:absolute;left:0px;bottom:0px;width:100%;height:45px;'></div>").appendTo(content);	
		this.createButton(100, 35, "004", p.ok).css({float:"right",marginRight:10}).appendTo(buttonArea)
			.click(function(){
				if(clicked){
					return;
				}
				var value=inputElement.val();
				if(p.check){
					var err=p.check(value)
					if(err!=null){
						LT.infomation({content:err},{element:inputElement});
						return;
					}
				};
				clicked=true;
				if(p.animate){
					ltWindow.fadeOut(250,function(){
						ltWindow.close();
					});
				}else{
					ltWindow.close(true);
				}
				callback(value);
			});
		if(p.animate){
			ltWindow.hide();
			ltWindow.fadeIn(250);
		}
	}
	
	this.openForm=function(windowParam,formParam,callback){
		var p={title:"表单",ok:"确认",parent:document.body,block:true,width:550,height:300,minable:true,resizable:true,maxable:true,max:false};
		var fp={containsEmpty:false};
		$.extend(p,windowParam);
		$.extend(fp,formParam);
		p.parent=$(p.parent);
		var block=null;
		var w=p.width;
		var h=p.height;
		var clicked=false;
		var left=(p.parent.width()-w)/2;
		var top=(p.parent.height()-h)/2;	
		if($(p.parent)[0]==document.body){
			left=($(window).width()-w)/2-50;
			top=($(window).height()-h)/2-50;
			if(p.pos=="center"){
				left+=50;
				top+=50;
			}
		}
		left=left<0?0:left;
		top=top<0?0:top;
		var ltWindow=this.createWindow({parent:p.parent,width:w,height:h,left:left,top:top,block:p.block,minable:p.minable,resizable:p.resizable,maxable:p.maxable,max:p.max},function(){
			if(p.close){
				return p.close();
			}
		}).setTitle(p.title);
		if($(p.parent)[0]==document.body){
			ltWindow.css("position","fixed");
		}
		var content=$("<div style='position:relative;width:100%;height:100%'></div>");
		var formArea=$("<div style='position:absolute;left:0px;right:0px;top:0px;bottom:43px;overflow:auto'></div>")
		.css("overflow-x","hidden").appendTo(content);
		ltWindow.addContent(content).appendTo(p.parent);
		fp.parent=formArea;
		if(fp.specialCss){
			fp.specialCss.paddingBottom=0;
		}else{
			fp.specialCss={paddingBottom:0};			
		}
		var buttonArea=null
		var operAreaFlag=false;
		if(fp.operArea===true){
			fp.operArea=buttonArea=$("<div></div>");
			operAreaFlag=true;
		}else{
			buttonArea=$("<div class='ui-state-default ui-corner-all' style='border-width:0px;position:absolute;left:0px;bottom:0px;padding-bottom:2px;right:2px;height:40px;'></div>");	
		}
		buttonArea.appendTo(content);
		var form=LT.Form.create(fp);
		form.wrapper=formArea;
		if(!fp.url){
			form.build();
		}
		var okBt=this.createButton(70, 30, null, p.ok).appendTo(buttonArea);
		okBt.css({float:"right"});
		form.addButton=function(btName){
			var newBt= LT.createButton(70, 30, null, btName).css({float:"right"}).css("margin-right","8px").appendTo(buttonArea);
			if(!operAreaFlag){
				newBt.css({marginTop:4})
			}
			return newBt;
		}
		if(!operAreaFlag){
			okBt.css({marginTop:4})
		}
		okBt.click(function(){
				if(clicked){
					return;
				}
				if(form.isNeedUploadFile()){
					form.uploadFiles(function(){
						dealClick();
					});		
				}else{
					dealClick();
				}
				
				function dealClick(){
					var errCount=form.validity();
					if(errCount!=0){
						LT.infomation({content:"存在"+errCount+"个不合法的输入项"});
						return;
					}
					var values=form.getValues(fp.containsEmpty);
					if(callback(values)===false){// 不允许关闭
						return;
					}
					clicked=true;
					if(p.animate){
						ltWindow.fadeOut(250,function(){
							ltWindow.close();
						});
					}else{
						ltWindow.close();
					}
				}
			});
		if(p.animate){
			ltWindow.hide();
			ltWindow.fadeIn(250);
		}
		form.closeFormDialog=function(){
			clicked=true;
			if(p.animate){
				ltWindow.fadeOut(250,function(){
					ltWindow.close();
				});
			}else{
				ltWindow.close();
			}
		}
		form.ltWindow=ltWindow;
		return form;
	}
	
	this.createButton=function(w,h,style,text){
		if(style==null||style==""){
			style="005";
		}
		if(w==null||w==""){
			w=130;
		}
		if(h==null||h==""){
			h=32;
		}
		return $("<input type='button'>").val(text)
		.css({width:w,height:h,position:"relative",fontSize:h/4+4<14?12:h/4+4}).puibutton();
// var
// root=$("<div></div>").width(w).height(h).css({overflow:"visible",position:"relative",cursor:"pointer"})
// .css("text-align","center").css("line-height",h+"px").css("font-size",h-8+"px");
// var
// img=$("<img></img>").attr("src",getResource("common/workframe/liontech/img/buttonBg/"+this.theme+".png"))
// .css("opacity",0.8).appendTo(root).css({position:"absolute",left:0,top:0,width:"100%",height:"100%"});
// var
// name=$("<div></div>").html(text).appendTo(root).css({position:"absolute",left:0,top:0,width:"100%",height:"100%",overflow:"hidden"});
// root.mouseover(function(){
// img.css({opacity:1});
// }).mouseout(function(){
// img.css({opacity:0.8});
// });
// return root;
	}
	
	this.isImg=function(src){
		var imgs={jpg:1,png:1,jpeg:1,gif:1,ico:1,bpm:1};
		var arr=src.split(".");
		if(arr.length<=1){
			return false;
		}
		return !!imgs[arr[arr.length-1]];
	}
	
	 this.getLocalFileUrl=function(sourceId) { 
		var url; 
		if (navigator.userAgent.indexOf("MSIE")>=1) { // IE
		   url = document.getElementById(sourceId).value; 
		} else if(navigator.userAgent.indexOf("Firefox")>0) { // Firefox
		   url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0)); 
		} else if(navigator.userAgent.indexOf("Chrome")>0) { // Chrome
		  url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0)); 
		} 
		return url; 
	} 
	
	this.lookAtMe=function(el,type,lasting){
		if(el.data("lookAtMe")){
			return;
		}
		lasting=lasting?lasting:1;
		el.data("lookAtMe",true);
		if(type=="shake"){
			positionChange(6*lasting);
		}else{
			animateChange(4*lasting);
		}
		
		function animateChange(count){
			if(count==0){
				el.data("lookAtMe",null);
				return;
			}
			el.animate({opacity:count%2==0?0.9:1},100,function(){
				animateChange(--count);
			})
		}
		
		function positionChange(count){
			if(count==0){
				el.data("lookAtMe",null);
				return;
			}
			var left=parseInt(el.css("left"));
			el.animate({left:count%2==0?left-5:left+5},60,function(){
				positionChange(--count);
			})
		}
	}

	/**
	 * hover时变大(暂时只支持absolute的element)
	 */
	this.hoverBigger=function(p,callback,start){	
		var setting={element:null,change:[30,30],time:200,wonder:false};
		$.extend(setting,p);
		var small={},big={};
		var el=$(setting.element);
		var first=true;
		el.hover(function(event){
			if(first){// 第一次触发事件的时候才设置这些数据,只有这样才能保证拿到的是真实的宽高，而不是0
				big.width=(small.width=el.width())+setting.change[0];
				big.height=(small.height=el.height())+setting.change[1];
				big.left=(small.left=parseInt(el.css("left")))-setting.change[0]/2;
				big.top=(small.top=parseInt(el.css("top")))-setting.change[1]/2;
				first=false;
			}
			if(event.type=="mouseenter"){
				bigging();
			}else{
				smalling();
			}
		});
		
		function bigging(){
			if(setting.wonder&&el.data("hoverChangeState")=="bigging"){// 正在变大
				return;
			}
			if(setting.wonder){
				el.data("hoverChangeState","bigging");
			}
			el.stop().animate(big,setting.time,function(){
				if(setting.wonder&&el.data("hoverChangeState")=="beSmall"){// 放大完后缩小
					smalling();
				}else{
					if(setting.wonder){
						el.data("hoverChangeState",null);
					}			
					if(callback){
						callback("big");
					}
				}
			});
			if(start){
				start("big");
			}
		}
		
		function smalling(){
			var el=$(setting.element);
			if(setting.wonder&&el.data("hoverChangeState")=="bigging"){// 正在放大
				el.data("hoverChangeState","beSmall");
				return;
			}
			if(setting.wonder){
				el.data("hoverChangeState","smalling");
			}	
			el.stop().animate(small,setting.time,function(){			
				if(callback){
					callback("small");
				}
				if(setting.wonder){
					el.data("hoverChangeState",null);
				}			
			});
			if(start){
				start("small");
			}
		}
	};
	
	this.noticable=function(selector,title){
		var elements=$(selector);
		elements.each(function(index){
			if($(this).data("lt_noticable_message")){
				return;
			}
			$(this).data("lt_noticable_message",$(this).attr("title"));
			$(this).attr("title",null);
		});
		elements.hover(function(evt){
			evt=evt||window.event;
			var el=$(this);
			if(evt.type=="mouseenter"){
				var to=window.setTimeout(function(){
					var p={content:el.data("lt_noticable_message"),sticky:true};
					if(title){
						p.title=title;
					}
					var infomation=LT.infomation(p,{element:el});
					el.data("lt_noticable",null).data("lt_infomation",infomation);
				}, 300);
				el.data("lt_noticable",to);
			}else{
				var to=el.data("lt_noticable");
				if(to!=null){
					window.clearTimeout(to);
				}else{
					$(this).data("lt_infomation").close();
				}
			}		
		});
	}
	
	
	/**
	 * @description 将long类型的时间转换为类似"今天 12:00:00"这样的格式
	 * @param {Number} time=[] 需要转换时间
	 * @param {String} format_date=[] 转换的日期格式,如:yyyy年MM月dd日
	 * @param {String} format_time=[] 转换的时间格式,如:HH:mm:ss
	 * @return {String} 转换后的字符串
	 */
	this.parseTime = function(time, format_date, format_time) {
		format_date = format_date || "yyyy年MM月dd日";
		format_time = format_time || "HH:mm:ss";
		var date = new Date(time);
		var y = date.getFullYear();
		var m = date.getMonth();
		var d = date.getDate();
		var now = new Date();
		if(y == now.getFullYear() && m == now.getMonth() && d == now.getDate()) {
			return "今天 " + this.dateFormat(date, format_time);
		}
		now.setDate(now.getDate() - 1);
		if(y == now.getFullYear() && m == now.getMonth() && d == now.getDate()) {
			return "昨天 " + this.dateFormat(date, format_time);
		}
		now.setDate(now.getDate() - 1);
		if(y == now.getFullYear() && m == now.getMonth() && d == now.getDate()) {
			return "前天 " + this.dateFormat(date, format_time);
		}
		return this.dateFormat(date, format_date)
	};

	/**
	 * @description 日期格式化
	 * @param {Date} date=[] 需要转换的date对象
	 * @param {String} format=[] 转换的格式,如:yyyy年MM月dd日 HH:mm:ss
	 * @return {String} 转换后的字符串
	 */
	this.dateFormat = function(date, format) {
		format = format.replace("yyyy", date.getFullYear());
		format = format.replace("MM", date.getMonth() + 1 > 9 ? date.getMonth() + 1 : ("0" + (date.getMonth() + 1)));
		format = format.replace("dd", date.getDate() > 9 ? date.getDate() : ("0" + date.getDate()));
		format = format.replace("HH", date.getHours() > 9 ? date.getHours() : ("0" + date.getHours()));
		format = format.replace("mm", date.getMinutes() > 9 ? date.getMinutes() : ("0" + date.getMinutes()));
		format = format.replace("ss", date.getSeconds() > 9 ? date.getSeconds() : ("0" + date.getSeconds()));
		return format;
	};
	
	
	 var orgTreeSetting = {
			 check: {
					enable: true,
					chkStyle: "radio",
					radioType:"all"
				},
				view: {
					dblClickExpand: false
				},
				callback: {
				 
				},
				view:{
					fontCss:null
				}
		};
	this.createInputTree=function(orgTree,value,input,simpleValue,autoSearch){
		input=input?input:$("<input></input>").puiinputtext();
		var readOnly=!!input.attr("readonly");
		if(value!=null&&value!=""){
			if(simpleValue){
				value={value:value,sub:true}
			}else{				
				value=LT.toJson(value);
			}
			input.data("lt_tree_value",value);
		}	
		var setting;
		var treeRoot;
		var notice;
		var ul;
		var tree;
		setTimeout(function(){// 树形结构比较耗时，采用异步加载的方案
			var time=new Date().getTime();
			treeRoot=$("<div style='position:absolute;display:none;max-height:250px;min-height:20px;overflow:hidden; z-index:2001' class='lt_orgSelection_root lt_windowShadow lt_scrollbar'></div>")
			.addClass("ui-widget-content ui-corner-all");
			var html="<div class='lt_inputTree_notice' style='position:relative;display:none;text-align:center;margin-top:10px;height:20px;font-size:18px;'></div>"
				     +"<ul class='ztree' id='"+time+"' style='margin-top:0;'></ul>"
			treeRoot.html(html);
			notice=treeRoot.find(">.lt_inputTree_notice");
			ul=treeRoot.find(">.ztree");
			setting=$.extend({},orgTreeSetting);
			setting.view.fontCss=specialFont;
			if(simpleValue){
				setting.check.enable=false;
			}
			bindEvent();
			tree=$.fn.zTree.init(ul, setting, orgTree);
			treeRoot.appendTo(document.body);
			if(value!=null&&value!=""){
				input.val(value.value);
				doFilter();
				if(input.data("equalNumber")==1){// 唯一记录
					tree.checkNode(input.data("lastEqNode"),!(value.sub));
					input.data("checkedNode",input.data("lastEqNode"));
					input.data("lt_tree_value",value);
					input.val(input.data("lastEqNode").name)
				}else{
					input.blur();					
				}
			}else{
// doFilter();
			}
			setTimeout(justifySize, 0);
			if(!readOnly){	
				LT.keyListener(input,27,function(){
					input.val(null);
					input.data("lt_tree_value",null);
					doFilter();
				})
			}
			treeRoot.hide();
		}, 0);
		
		function bindEvent(){
			setting.callback.onExpand=function(event,treeId,node){
				justifySize();
			}
			setting.callback.onCollapse=function(event,treeId,node){
				justifySize();
			}
			treeRoot.mouseover(function(){
				treeRoot.css("overflow","auto");
			});
			treeRoot.mouseout(function(){
				treeRoot.css("overflow","hidden");
			});
			setting.callback.onMouseUp=function(event, treeId, treeNode){
				if(treeNode==null||(event.button!=1&&event.button!=0)){  // 若点击复选框时treeNode为null
					input.data("doNotHide",true);// 防止input在blur的时候隐藏掉
					return;
				}
				if(treeNode.unSelectable){
					setTimeout(function(){
						tree.cancelSelectedNode(treeNode);
					});
					return;
				}
				if(!treeNode.checked&&input.data("checkedNode")!=null){// 点的是未勾选的节点
					tree.checkNode(input.data("checkedNode"),false);
				}
				treeRoot.fadeOut("fast");  
				input.data("forceHide",true);
				if(!readOnly){	
					input.val(treeNode.name);
// input[0].value="1";
// alert(1)
					input.data("lt_tree_value",{value:treeNode.code,sub:!treeNode.checked});			
				}
				input.change();
			}
			setting.callback.onCheck=function(event, treeId, treeNode){
				if(treeNode.checked){
					input.data("checkedNode",treeNode);
				}
			};
			treeRoot.mousedown(function(evt){
				input.data("doNotHide",!input.data("forceHide")&&true);
				if(!input.data("forceHide")){
					setTimeout(function(){
						input.focus();
					}, 0);
				}				
			});	
			if(autoSearch){
				input.keyup(function(){
					doFilter();
				});
			}else{
				LT.keyListener(input,13,function(evt){
					doFilter();
				});
			}
			input.focus(function(){
				treeRoot.fadeIn("fast")
				doFilter();
				justifySize();
			});
			input.blur(function(){
				if(!autoSearch){
					doFilter();
				}
				var cv=checkValue();
				input.change();
				setTimeout(function(){
				  if(!input.data("doNotHide")){
					  if(input.data("forceHide")||readOnly||cv){
						  input.data("forceHide",false);
						  treeRoot.fadeOut("fast");  
					  }		  
				  }else{
					  input.data("doNotHide",false);
				  }				 	
				}, 0);
			});
			function checkValue(){
				if(input.val()!=null&&input.val()!=""){
					var fitNumber=input.data("fitFilterNumber");
					var equalNumber=input.data("equalNumber");
					var lastEqNode=input.data("lastEqNode");
					if(fitNumber==0||(equalNumber==1&&lastEqNode.unSelectable)){
						notice.html("无结果").show();
						LT.lookAtMe(treeRoot,"shake");
						input.data("lt_tree_value",null);
						return false;
					}else if(equalNumber==1){
						input.val(lastEqNode.name);
						input.data("lt_tree_value",{value:lastEqNode.code,sub:!lastEqNode.checked});
						return true;
					}else{
						notice.html("非唯一的结果").show();
						var sto=setTimeout(function(){
							notice.animate({height:0,marginTop:0},"fast",function(){
								notice.hide().css({height:20,marginTop:10})
							});
						}, 1000);
						notice.data("delayHide",sto);
						LT.lookAtMe(treeRoot,"shake");
						input.data("lt_tree_value",null);
						return false;
					}
				}else{
					input.val(null);
					input.data("lt_tree_value",null);
				}
				return true;
			};
		}
		function doFilter(){
			clearTimeout(notice.data("delayHide"))
			var value=input.val();
			if(input.data("preFilterValue")==value){
				return;
			}else{
				input.data("preFilterValue",value);
			}
			var nodes=tree.getNodes();		
			var fitNumber=0;
			var equalNumber=0;
			input.data("lastEqNode",null);
			var willExpandNode=[];
			dealSub(nodes,value);
			if(willExpandNode.length!=0){
				for(var i=1;i<willExpandNode.length;i++){// 展开最后一个节点的时候触发onexpand事件,因为触发onexpand事件的时候会justifysize（只想做一次）
					tree.expandNode(willExpandNode[i],true,false,false,false);
				}
				tree.expandNode(willExpandNode[0],true,false,false,true);
			}else{
				justifySize();
			}	
			
			if(value==null||value==""){
				input.data("lastEqNode",null);
				var last=null;
				var isExpand=true;
				var shouldClose=tree.getNodesByParam("open_",false);// 关闭需要关闭的节点
				if(shouldClose!=null&&shouldClose.length!=0){
					last=shouldClose[0];
					isExpand=false;
					for(var i=1;i<shouldClose.length;i++){
						tree.expandNode(shouldClose[i],false,false,false,false);
					}
				}
				var shouldOpen=tree.getNodesByParam("open_",true);// open_是后台设置的标识，代表这个节点初始化时是否展开
				if(shouldOpen!=null&&shouldOpen.length!=0){
					var index=0;
					if(last==null){
						last=shouldOpen[i];
						index=1;
					}
					for(var i=index;i<shouldOpen.length;i++){
						tree.expandNode(shouldOpen[i],true,false,false,false);
					}
					tree.expandNode(last,!isExpand,false,false,false)
					tree.expandNode(last,isExpand,false,false,true);
				}
			}else{
				input.data("fitFilterNumber",fitNumber).data("equalNumber",equalNumber);
// justifySize();
			}	
			if(fitNumber==0){
				notice.html("无结果").show();
			}else{
				notice.hide();
				if(fitNumber>1&&input.data("checkedNode")!=null){
					tree.checkNode(input.data("checkedNode"),false);
					input.data("checkedNode",null);
				}
			}
			function dealSub(nodes,value){
				var childrenFit=false;// 当前嵌套层的节点有无匹配
				for(var i=0;i<nodes.length;i++){
					var childrenFit_sub=false;// 本次循环中的节点的子节点是否匹配
					var node =nodes[i];
					var preFit=!!node.fitFilter;
					var children=node.children;	
					if(node.name.indexOf(value)>=0||(node.code&&node.code.indexOf(value)>=0)){// 自己匹配
						childrenFit=true;// 当前层有一个节点匹配则当前层也匹配
						node.fitFilter=true;
// tree.showNode(node);
						fitNumber++;
						var lastEqNode=input.data("lastEqNode");
						if(lastEqNode!=null&&lastEqNode.code!=node.code){
							equalNumber++;
						}else{
							equalNumber=1;
						}
						input.data("lastEqNode",node);
					}else{
						node.fitFilter=false;
					}
					if(children!=null&&children.length!=0){
						childrenFit_sub=dealSub(children,value)
					}
					if(childrenFit_sub){// 子匹配
						childrenFit=true;// 当前层有一个节点的子节点匹配,则当前层也匹配
						if(!node.fitFilter){// 父未匹配
// tree.showNode(node);
							if(!node.open){
								willExpandNode.push(node);
							}
						}					
					}else if(!node.fitFilter){// 父子都未匹配
// tree.hideNode(node);
					}
					if(value==null||value==""){// 没输入条件时,去除匹配标志
						node.fitFilter=false;
					}
					if(preFit!=node.fitFilter){
						tree.updateNode(node);
					}
				}
				return childrenFit;
			}
		}
		function justifySize(){
			if(input.data("inJustifySize")){
				return;
			}				
			input.data("inJustifySize",true);
			var pos=input.offset();
			var inputWidth=input.width();
			var left=pos.left;
			var preWidth=treeRoot.width();
			var preLeft=treeRoot.css("left");
			treeRoot.css({left:left,top:pos.top+input.height()+5,width:inputWidth+8});
			if(treeRoot.width()<treeRoot[0].scrollWidth){// 有滚动条
				var treeWidth=treeRoot[0].scrollWidth+20;
				var left=pos.left-(treeWidth-inputWidth)/2;
				if(left<5){
					left=5;
				}
				if(left+treeWidth>$(window).width()-5){
					left=$(window).width()-5-treeWidth;
				}
				if(preWidth==treeWidth){// 无变化
					treeRoot.css({width:treeWidth,left:left});
					input.data("inJustifySize",false);
				}else{	
					treeRoot.css({width:preWidth,left:preLeft}).animate({left:left,top:pos.top+input.height()+5,width:treeWidth},100,function(){				
						input.data("inJustifySize",false);
					});
				}
			}else{
				input.data("preScrollWidth",treeRoot[0].scrollWidth);
				input.data("inJustifySize",false);
			}
		}
		function specialFont(treeId, treeNode) {
			if(treeNode.fitFilter){
				var a=ul.find("#"+treeNode.tId+"_a");
				if(a.length==0){
					setTimeout(function(){
						ul.find("#"+treeNode.tId+"_a").addClass("ui-state-highlight");					
					});					
				}else{
					a.addClass("ui-state-highlight");					
				}
			}else{
				ul.find("#"+treeNode.tId+"_a").removeClass("ui-state-highlight");
			}
			return {};
// return treeNode.fitFilter ? {"font-weight":"bold","background-color":"blue"}
// : {"font-weight":"normal","background-color":"transparent"};
		}
		return input;
	}
	
	this.keyUp=this.keyListener=function(element,keyCode,callback){
		$(element).keyup(function(evt){
			evt=evt||window.event;
			if(evt.keyCode==keyCode){
				var v=callback.call(element,evt);
				if(v===false){
					return false;
				}
			}
		});
		return this;
	}
	
	this.keyDown=function(element,keyCode,callback){
		$(element).keydown(function(evt){
			evt=evt||window.event;
			if(evt.keyCode==keyCode){
				var v=callback.call(element,evt);
				if(v===false){
					return false;
				}
			}
		});
		return this;
	}
	
	this.webPrint=function(param){
		var url=param.url;
		url=url+(url.indexOf("?")>0?"&":"?")+"lt_web_print=1";
		window.open(url);
	}
	
	function getResource(src){
		return LT.getBasePath()+"/"+src;
	}
	
	this.createBg=function(zIndex){
		return $("<div class='ui-widget-overlay' style='position:fixed;width:100%;height:100%;display:block;top:0px;left:0px'></div>").css("z-index",zIndex);
	}
	
	this.newOperAuth=function(){
		return new function(){


			this.authSuccess = null;

			this.operType = null;

			var tempAuthSuccess = null;

			this.auth = function() {
				tempAuthSuccess = this.authSuccess;
				$.post(LT.getBasePath()+"/liontech/auth/operAuth_isNeedAuth.action", "operType=" + this.operType,
						function(result) {
							if (result == "false") { // 不需要授权
								tempAuthSuccess.call();
							} else { // 弹出授权框
								operAuth();
							}
						});
			};

			/**
			 * 打开授权框
			 */
			function operAuth() {
				var bgDiv = document.createElement("div");
				bgDiv.setAttribute('id', 'auth_bgDiv');
				bgDiv.style.position = "absolute";
				bgDiv.style.top = "0px";
				bgDiv.style.left = "0px";
				bgDiv.style.width = "100%";
				bgDiv.style.height = "100%";
				bgDiv.style.background = "#777";
				bgDiv.style.zIndex = "10032";
				bgDiv.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
				bgDiv.style.opacity = "0.6";
				document.body.appendChild(bgDiv);
				openAuthPage();
			}

			function openAuthPage() {
				var strTitle = "请输入授权人员用户名和密码";
				var msgw, msgh, bordercolor;
				msgw = 250;// 提示窗口的宽度
				msgh = 110;// 提示窗口的高度
				titleheight = 25; // 提示窗口标题高度
				bordercolor = "#DDDDDD";// 提示窗口的边框颜色
				titlecolor = "#99CCFF";// 提示窗口的标题颜色
				var authDiv = document.createElement("div");
				authDiv.setAttribute("id", "authDiv");
				authDiv.setAttribute("align", "center");
				authDiv.style.background = "white";
				authDiv.style.border = "1px solid " + bordercolor;
				authDiv.style.position = "absolute";
				authDiv.style.left = "55%";
				authDiv.style.top = "50%";
				authDiv.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
				authDiv.style.marginLeft = "-225px";
				authDiv.style.marginTop = -75 + document.documentElement.scrollTop
						+ "px";
				authDiv.style.width = msgw + "px";
				authDiv.style.height = msgh + "px";
				authDiv.style.textAlign = "center";
				authDiv.style.lineHeight = "25px";
				authDiv.style.zIndex = "10033";
				var title = document.createElement("h4");
				title.setAttribute("id", "authTitle");
				title.setAttribute("align", "right");
				title.style.margin = "0";
				title.style.padding = "3px";
				title.style.background = "#DDDDDD repeat scroll 0 0 transparent";
				title.style.filter = "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
				title.style.opacity = "0.75";
				title.style.border = "1px solid " + bordercolor;
				title.style.height = "18px";
				title.style.font = "12px Verdana, Geneva, Arial, Helvetica, sans-serif";
				title.style.color = "#000000";
				title.style.cursor = "pointer";
				title.title = "点击关闭";
				title.innerHTML = "<table border='0' width='250px' style='vertical-align:top'><tr style='vertical-align:top'><td align='left'><b>"
						+ strTitle
						+ "</b></td><td align='right'><input type='button' id='closeButton_auth'value='关闭'  style='margin-top:-3px'/></td></tr></table></div>";
				var input = document.createElement("div");
				input.style.marginTop = "6px";
				input.innerHTML = "用户名:<input style='width:120px' type='text' id='authName' name='authName'>"
						+ "<br>"
						+ "密&nbsp; &nbsp;码:<input style='width:120px' type='password' id='authPassword' name='authPassword'>"
						+ "<br>"
						+ "<input type='button' value='授权' style='margin-left:155px' id='authButton'/>";

				document.body.appendChild(authDiv);
				authDiv.appendChild(title);
				authDiv.appendChild(input);
				document.getElementById("authDiv").onkeyup = function() {
					authKeyDown();
				};
				document.getElementById("closeButton_auth").onclick = function() {
					closeOperAuth();
				};
				document.getElementById("authButton").onclick = function() {
					document.getElementById("authButton").disabled = "true";
					var userName = document.getElementById("authName").value;
					var password = document.getElementById("authPassword").value;
					if (userName == null || userName.length == 0) {
						ltAlert("请输入用户名");
						document.getElementById("authButton").disabled = "";
						return;
					}
					if (password == null || password.length == 0) {
						LT.infomation({content:"请输入密码"});
						document.getElementById("authButton").disabled = "";
						return;
					}
					$.post("operAuth_auth.action", "userName=" + userName
							+ "&password=" + password, function(result) {
						if (result == "true") {
							document.getElementById("authButton").disabled = "";
							closeOperAuth();
							tempAuthSuccess.call();
						} else {
							LT.infomation({content:"result"});
							document.getElementById("authButton").disabled = "";
						}
					});
				};
			}

			function closeOperAuth() {
				var auth_bgDiv = document.getElementById("auth_bgDiv");
				var authDiv = document.getElementById("authDiv");
				document.body.removeChild(authDiv);
				document.body.removeChild(auth_bgDiv);
			}
			
			function authKeyDown(evt){
				if(evt==null){
					evt=window.event;
				}
				if(evt.keyCode==13){
				document.getElementById("authButton").click();
				}
			}
		}
	}
	
	 this.stopEvent=function(evt) {
		evt = evt || window.event;
		evt.stopPropagation ? evt.stopPropagation() : (evt.cancelBubble = true);
	}

	/**
	 * 依赖指定js
	 */
	this.loadJs = function(src) {
		loadJs(src);
		return instance;
	};

	this.loadCss = function(href) {
		loadCss(href);
		return instance;
	};
	
	this.setCookie=function(name, value, seconds,doc) {    
		 seconds = seconds || 0; 
		 var expires = "";    
		 if (seconds != 0 ) {  
		 var date = new Date();    
		 date.setTime(date.getTime()+(seconds*1000));    
		 expires = ";expires="+date.toGMTString();    
		 }    
		 doc.cookie = name+"="+escape(value)+expires+"; path=/";
		} 
	
	this.exitNotice=function(enable){
		if(enable){
			window.onbeforeunload = function(evt) {
				  evt=window.event||evt;
				  var msg="你确定要离开该页面吗?";
				  return msg;
			  }
		}else{
			window.onbeforeunload=null;
		}	
	}
	this.createToolBar=function(param){
		var p={element:null,animate:true,toolBars:null,itemWidth:90,itemHeight:90,animateLevel:1};
		$.extend(p,param);
		var al=p.animateLevel;
		var root=$("<div class='ui-widget-content ui-corner-all'></div>").css({position:"absolute",top:0,left:0,right:0,bottom:p.itemWidth,overflow:"hidden"})
				.css("border-width",0).appendTo(p.element);
		var el=$("<div></div>").css({position:"absolute",top:0,left:0,right:0,bottom:0,overflow:"hidden"})
				.css("border-width",0).appendTo(root);
		el.bind("mousewheel",function(evt, delta){
			evt=evt.sourceEvent||window.event;
			var dir=evt.wheelDelta||evt.detail;
			if(dir<0){
				toolBarScroll(1);
			}else{// 放大
				toolBarScroll(-1);
			}
		});
		var pre=$("<img class='ui-corner-top' />").attr("src",LT.getBasePath()+"/common/images/tool/scrollUp.png").css({position:"absolute",top:0,width:p.itemWidth-6,height:0,cursor:"pointer",borderWidth:0}).appendTo(root);
		var next=$("<img class='ui-corner-bottom' />").attr("src",LT.getBasePath()+"/common/images/tool/scrollDown.png").css({bottom:0,position:"absolute",width:p.itemWidth-6,height:0,cursor:"pointer",borderWidth:0}).appendTo(root);
		pre.hide().hover(function(){
			pre.toggleClass("ui-state-hover");
		}).click(function(){
			toolBarScroll(1);
		});
		next.hide().hover(function(){
			next.toggleClass("ui-state-hover");
		}).click(function(){
			toolBarScroll(-1);
		});
		var bottom=$("<div></div>").css({position:"absolute",left:0,right:0,bottom:0,height:p.itemWidth-2,cursor:"pointer"}).appendTo(p.element);
		var back=$("<img/>").attr("src","img/toolbarBack.png").css({position:"absolute",left:8,top:8,width:p.itemWidth-24,height:p.itemWidth-24})
				.hide().appendTo(bottom);
		LT.hoverBigger({element:back,change:[10,10],wonder:true});
		back.click(function(){
			var context=el.data("toolbarContext");
			el.data("toolbarContext",context.parent);
			fillToolBar(context.backItems,context.backLevel);
		});
		var items=p.toolBars.items;
		fillToolBar(items,1);
		function fillToolBar(items,level){
			back.hide();
			var preItems=el.find(".lt_toolbarItem");
			if(preItems.length!=0){
				for(var i=0;i<preItems.length;i++){
					if(i<preItems.length-1){
						animateHide($(preItems[i]),i)						
					}else{
						animateHide($(preItems[i]),i,function(){
							preItems.remove();
							createNew();
						});
					}
				}
			}else{
				createNew();
			}
			function createNew(){
				for(var i=0;i<items.length;i++){
					var it=items[i];
					if(it==null){
						continue;
					}
					var newItem=createOne(it,level,el,items).css({opacity:0}).appendTo(el);
					if(i<items.length-1){						
						animateShow(newItem,i);
					}else{
						animateShow(newItem,i,function(){
							if(level>1){
								back.show();
							}
							if(el[0].scrollHeight>el.height()){
								el.animate({top:20,bottom:20});
								pre.show().animate({height:20});
								next.show().animate({height:20});
							}else{
								el.animate({top:0,bottom:0});
								pre.css({height:0}).hide();
								next.css({height:0}).hide();
							}
						});
					}
				}		
			}
		}
		
		function toolBarScroll(mul){
			var maxSt=el[0].scrollHeight-el.height();
			var curSt=el.scrollTop();
			if((curSt<=0&&mul<0)||(curSt>=maxSt&&mul>0)||mul==0){
				return;
			}
			if(el.data("scrolling")){
				return;
			}
			var st=el.scrollTop()+mul*p.itemHeight;
			st=st<0?0:st;
			st=st>maxSt?maxSt:st;
			var tst=el.data("targetSt");
			tst=tst?tst:0;
			el.data("scrolling",true);
			el.stop().animate({scrollTop:st},al*100,function(){
				el.data("scrolling",false);
			});
			el.data("targetSt",st);
		}
		
		
		function animateHide(it,index,callback){
			setTimeout(function(){
				it.animate({opacity:0},al*100,function(){
					if(callback){
						callback();
					}
				});
			},index*al*50);
		}
		
		function animateShow(it,index,callback){
			setTimeout(function(){
				it.animate({opacity:1},al*100,function(){
					if(callback){
						callback();
					}
				});
			},index*50);
		}
		
		function createOne(it,level,el,backItems){			
			var itemRoot=$("<div style='text-align:center;border-width:0px;border-bottom-width:1px;cursor:pointer' class='ui-state-default lt_toolbarItem'></div>").css("float","left").css({position:"relative",width:p.itemWidth,height:p.itemHeight});
			itemRoot.hover(function(){
				$(this).toggleClass("ui-state-highlight");
			});
			var itemContent=$("<div style='position:absolute;bottom:2px;left:0px;right:7px;font-weight:bold;cursor:pointer'></div>").html(it.name).appendTo(itemRoot);
			if(it.icon){
				var img=$("<img class='ui-corner-all'/>").css({position:"absolute",cursor:"pointer",top:10,left:10,width:p.itemWidth-28,height:p.itemHeight-28}).appendTo(itemRoot);
				img.attr("src",it.icon);			
				LT.hoverBigger({element:img,change:[10,10],wonder:true});
			}else{
				itemRoot.css("height","50px");
				itemContent.css("bottom","10px")
			}
			itemRoot.click(function(){
				if(it.action){
					it.action();		
				}
				if(it.children&&it.children.length!=0){
					fillToolBar(it.children,level+1);
					var context={backItems:backItems,backLevel:level};
					var preContext=el.data("toolbarContext");
					if(preContext!=null){
						context.parent=preContext;
					}
					el.data("toolbarContext",context);
				}
			});
			return itemRoot;
		}
	}
	
	this.replaceAll=function(string, old,replaceWith, ignoreCase) {  
	    if (!RegExp.prototype.isPrototypeOf(old)) {  
	        return string.replace(new RegExp(old, (ignoreCase ? "gi": "g")), replaceWith);  
	    } else {  
	        return string.replace(old, replaceWith);  
	    }  
	}  
	
	this.thousandsFormat=function(num){
		  var value=num+'';
		  var index=value.indexOf(".");
		  if(index<0){
			  value =num.toFixed(2) + '';
			  return value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
		  }else{
			  var pre=value.substring(0, index);
		  	  var suffix=value.substring(index+1,value.length );
		  	  return pre.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')+"."+suffix;
		  }
		
	}
	
	
	this.toLoginPage=function(){
		top.LT.changeUrl(LT.getBasePath()+"/liontech/login/login.jsp");
	}
	
	this.percentToAbs=function(percent,all){// 将百分比转换为数值
		var pl=percent.length;
		if(pl&&percent.indexOf("%")==pl-1){
// alert(all*parseFloat(percent.substring(0,pl-1))/100)
			return all*parseFloat(percent.substring(0,pl-1))/100;
		}else{
			return percent;
		}
	}
	
	
	function loadTheme(href){
		var pre=loadedCss["lt-theme-cur-theme"];
		if(pre){
			$(pre).remove();
		}
		var css = document.createElement("link");
		loadedCss["lt-theme-cur-theme"]=css;
		css.setAttribute("rel", "stylesheet");
		css.setAttribute("type", "text/css");
		css.setAttribute("href", href);
		css.setAttribute("class", ".lt-theme-cur-theme");
		document.getElementsByTagName("head")[0].appendChild(css);
	}

	function loadCss(href) {
		if(loadedCss[href]){
			return;
		}
		var css = document.createElement("link");
		css.setAttribute("rel", "stylesheet");
		css.setAttribute("type", "text/css");
		css.setAttribute("href", href+"?t=1");
// css.setAttribute("href", href+"?t="+top.LT.timeTag);
		document.getElementsByTagName("head")[0].appendChild(css);
		loadedCss[href]=true;
	}
	
	/**
	 * 框架层数据交互方法,请不要在你的代码中调用
	 */
	this.getJsResource=function(src){
		return jsResourceMap[src];
	}
	/**
	 * 框架层数据交互方法,请不要在你的代码中调用
	 */
	this.putJsResource=function(src,script){
		jsResourceMap[src]=script;
	}

	/**
	 * 动态加载js文件
	 */
	function loadJs(src) {
		if(src.indexOf("http:")!=0&&src.indexOf("https:")!=0){
			src=LT.getCurPath()+"/"+src;
		}
		if(loadedJs[src]){
			return;
		}
//		var script=top.LT.getJsResource(src);// 从主框架的缓存中获取
		var script=null;
		if(!script){	// 缓存中不存在从后台获取
			var x = window.ActiveXObject ? new ActiveXObject("MSXML2.XMLHTTP")
			: new XMLHttpRequest();
// x.open("GET", src+"?t="+top.LT.timeTag, false);
			x.open("GET", src+"?t=1", false);
			x.send(null);
			script = x.responseText;
		}
		
		try {
			window.execScript(script);
			loadedJs[src]=true;
//			top.LT.putJsResource(src,script);// 存入主界面的缓存中
		} catch (ex) {
			try{
				window.eval(script);
				loadedJs[src]=true;
//				top.LT.putJsResource(src,script);
			}catch(exception){
				alert("加载文件"+src+"出现错误");
				throw exception;
			}
		}
		;
	}
	;
	
	this.runJs=function(js){
		try {
			return window.execScript(js);
		} catch (e) {
			return window.eval(js);
		}
	}

	/**
	 * 内部方法，ajax请求
	 * 
	 * @param url
	 *            地址
	 * @param isAsyn
	 *            是否异步
	 * @param requestType
	 *            请求类型
	 * @param paramJson
	 *            参数对象
	 * @param callBack
	 *            回调函数
	 * @returns 同步调用时有返回值
	 */
	function ajax(url, isAsyn, requestType, paramJson, callBack,noPackage,noJson) {
		var result = null;
		var error = null;
		var pro=null;
		$
				.ajax({
					type : requestType,
					async : isAsyn,
					timeout : timeOut,
					url : url.indexOf("?") > 0 ? (url + "&time=" + new Date()
							.getTime()) : (url + "?time=" + new Date()
							.getTime()),
					data : paramJson == null ? null : $.param(paramJson, true),
					dataType : noJson?"html":"json",
					contentType : "application/x-www-form-urlencoded; charset=utf-8",
					success : function(back) {
						if(noPackage||noJson){
							if (isAsyn) {
								callBack(back);
							} else {
								result=back;
							}	
						}else if (!back || back.status==null) {
							badResponseFormat();
							if (isAsyn) {
// callBack(new AsynException("000", "返回数据格式不正确"));
							} else {
								error = new Error("返回的数据格式不正确");
							}
						} else{
							if (back.status === 1) {
								if (isAsyn) {
									callBack(back.body);
								} else {
									result = back.body;
								}
							} else if (back.status === 0) {
								requestProcessFail(back.errCode,back.errMessage);
								if (isAsyn) {
// callBack(new AsynException("001", "后台出现错误"));
								} else {
									error = new Error("后台出现错误");
								}
							}else {
								unknownResponseStatus(back.status);
								if (isAsyn) {
// callBack(new AsynException("001", "未知的状态码"));
								} else {
									error = new Error("未知的状态码");
								}
							}
						}
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						comErr(XMLHttpRequest, textStatus, errorThrown);
					}
				});
		if(!isAsyn){
			if (error) {
				throw error;
			}
			return result;	
		}	
	}

	/**
	 * 通讯错误默认处理
	 */
	comErr = function(XMLHttpRequest, textStatus, errorThrown) {
		if(XMLHttpRequest.status==0){
			return;
		}
		LT.infomation({content:"程序出现异常，错误码:"+XMLHttpRequest.status,sticky:true,block:true,type:"error"});
	};
	
	/**
	 * 通讯错误默认处理
	 */
	badResponseFormat = function() {
		LT.infomation({content:"返回的数据格式不正确",sticky:true,block:true,type:"error"});
	};

	/**
	 * 处理后台异常的默认方式
	 * 
	 * @param exception
	 *            后台异常信息
	 */
	requestProcessFail = function(errCode,errMessage) {
		if(errCode=="session-expired"){// 会话超时
			var msg="当前会话已超时,可能是该账号已在其他地方进行了登录"
			LT.dialog({title:"警告",message:msg,closable:false,buttons:["重新登录"]},LT.toLoginPage,LT.toLoginPage);
		}else{			
			LT.infomation({content:"操作失败，错误码:"+errCode+",错误描述:"+errMessage,sticky:true,block:true,type:"error"});
		}
	};
	
	unknownResponseStatus=function(state){
		LT.infomation({content:"返回了未知的状态码:"+state,sticky:true,block:true,type:"error"});
	}

} 
//	top.LT=LT;
	LT.requireJquery().requireContextMenu();
	LT.loadCss(LT.getBasePath()+"/common/workframe/liontech/liontech.css");
	LT.requireLTPlugin(["baseFunction"]);
	jQuery.speedProxy=jQuery.speed;
	jQuery.speed=function(a,b,c){
		var opt= jQuery.speedProxy(a,b,c);
		var as=null;
		if(top.SF&&top.SF.desktop){			
			as=top.SF.desktop.animateSpeed;
		}
		as=as==null?2:as;
		if(as==0){// 关闭动画
			opt.duration=0;
		}else{			
			opt.duration=opt.duration/as*2; // 正常速度是2,值越大时间就越短,速度就越快
		}
		return opt;
	}
	$(document).ready(function(){
		$(document.body).keydown(function(evt){
	        evt = evt || window.event; 
	        var el = evt.target || evt.srcElement; 
	        var elt = el.type || el.getAttribute('type');
	        if (evt.keyCode == 8) {
	        	if((elt == "password" || elt == "text" || elt == "textarea")&&!$(el).attr("readonly")){
	        		return true;
	        	}else{
	        		return false;
	        	}
	        }else if(top.SF&&top.SF.devMode){
				if(evt.shiftKey&&evt.ctrlKey&&evt.keyCode==88){// liontech控制台
					var cmd=top.SF.getApp("liontechCmd");
					cmd.setWindow(window);
					top.SF.openApp(cmd);
				}		
				return true;
	        }else{
	        	return true;
	        }
	     
		
	        return true;
		});
	});


function AsynException(errCode, errMessage) {
	this.code = errCode;
	this.message = errMessage;
}