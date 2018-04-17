/**
 * 创建于:2014-5-6<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 表单控件
 * @author chender
 * @version 1.0.0
 */
LT.loadCss(LT.getBasePath()+"/common/workframe/liontech/plugin/form/form.css");
LT.requireLTPlugin(["validity"]);
LT.Form=new function(){
	this.create=function(param){
		var p={formClass:"lt_form_root",specialCss:{}};
		$.extend(p,param);
		var form={elements:{}};
		form.root=$('<div class="ui-widget-content"></div>').addClass(p.formClass).css(p.specialCss);
		form.head=$('<div class="lt_form_head ui-widget-content"></div>');
		form.body=$('<div class="lt_form_body"></div>');
		form.root.append([form.head,form.body])
		form.setting=p;
		if(p.url){//通过url地址获取表单模型
			createFromRemote(form,p.url);
			form.build=function(){//如果外部调用者在有url的情况下调用了build方法将会报错，所以这里写一个空的build方法				
			}
		}else{
			form.model=p.model;
			form.userData=p.model?p.model.userData:null;
			form.model=form.model?form.model:{};
			form.model.formItems=form.model.formItems?form.model.formItems:[];
			checkData(form.model);
			/**
			 * 添加一个表单项，该方法必须在build方法之前使用
			 * @param item
			 */
			form.addItem=function(item){			
				form.model.formItems.push(item);
			}
			/**
			 * 添加一组表单项，该方法必须在build方法之前使用
			 * @param item
			 */
			form.addItems=function(items){
				form.model.formItems.push(items);
			}
			
			form.build=function(){
				return build(this);
			}
		}
		
		form.getFormItems=function(){
			var doms=form.root.find(".lt_form_item_element");
			var items=[];
			for(var i=0;i<doms.length;i++){
				items.push($(doms[i]).data("item"));
			}
			return items;
		}
		
		/**
		 * 通过key值获取表单项
		 * @param key
		 * @returns
		 */
		form.getElement=function(key){
			return this.elements[key];
		}
		
		form.getElementValue=function(element){
			return getElementValue(element, false);
		}
		
		form.getViewGroup=function(category){
			return form.body.find(".viewGroup_"+category);
		}
		
		form.hideViewGroup=function(category){
			var vg= form.body.find(".viewGroup_"+category);
			vg.find(">.lt_form_viewGroup").removeClass("lt_form_show");
			vg.hide();
			form.head.find(".lt_form_tabItem_"+category).hide();
		}
		
		form.showViewGroup=function(category){
			var vg= form.body.find(".viewGroup_"+category);
			vg.find(">.lt_form_viewGroup").addClass("lt_form_show");
			vg.show();
			form.head.find(".lt_form_tabItem_"+category).show();
		}
		
		/**
		 * 在某个表单项后边添加一个图标
		 * @param key 表单项key值
		 * @param iconElement
		 */
		form.addIcon=function(key,iconElement){
			var element=form.elements[key];
			if(element==null){
				var err="没有找到key值为["+key+"]的表单项";
				LT.infomation({content:err,type:"error",block:true,sticky:true});
				throw new Error(err);
			}
			addIconElement(element, iconElement);
		}
		
		form.insertAfter=function(pre,itemModels){
			for(var i=itemModels.length-1;i>=0;i--){	//因为是用的after进行添加，所以最后添加的会在最前面
				var element=addItem(this, itemModels[i]);
				if(pre!=null){
					pre.root.after(element.root);
				}else{//加在最后
					form.body.append(element.root);
				}
			}
		}
		
		form.insertBefore=function(pre,itemModels){
			for(var i=itemModels.length-1;i>=0;i--){	//因为是用的after进行添加，所以最后添加的会在最前面
				var element=addItem(this, itemModels[i]);
				if(pre!=null){
					pre.root.before(element.root);
				}else{//加在最后
					form.body.append(element.root);
				}
			}
		}
		
		
		form.insertIntoGroup=function(groupKey,itemModels){
			var baseDom=form.getViewGroup(groupKey).find(".lt_form_viewGroup>.basedom");//第一个自带基础元素之前添加
			if(baseDom==null||baseDom.length==0){
				var errMsg="未找到指定的视图分组:"+groupKey;
				LT.error(errMsg);
				throw new Error(errMsg);
			}
			baseDom=$(baseDom[0]);
			for(var i=0;i<itemModels.length;i++){
				var element=addItem(this, itemModels[i]);
				baseDom.before(element.root);
			}
		}
		
		form.layout=function(){
		 layout(this);	
		}
		
		form.validity=function(category){
			if(!category){//校验全部
				return validForm(form)				
			}else{//校验某一类别
				return validForm(form,category);
			}
		}
		form.setValidity=function(key,validity){
			var element=form.getElement(key);
			if(element==null){
				LT.infomation({content:"未找到key值为"+key+"的表单项",type:"error",sticky:true,block:true});
				return;
			}
			changeValidity(element,validity)
		}
		
		
		form.clear=function(){//TODO 单选框，复选框，文件类型的重置
			var elements=form.body.find(".lt_form_item_element");
			for(var i=0;i<elements.length;i++){
				var item=$(elements[i]).data("item");
				if(item.type=="uploadFile"||item.type=="downloadFile"){
					continue;
				}else{//TODO 		
					var valueElement=$(elements[i]).data("valueElement");
					if(valueElement){
						valueElement.val(null).change();
					}else{
						$(elements[i]).val(null).change();						
					}
				}
			}
		}
		form.uploadFiles=function(callback){
			var filesElements=[];
			var elements=form.body.find(".lt_form_show .lt_form_item_element");
			var filesNumber=0;
			for(var i=0;i<elements.length;i++){
				var item=$(elements[i]).data("item");
				if(item.type=="uploadFile"){
					if(item.updateNotValidity){
						LT.infomation({content:item.updateNotValidity});
						return;
					}
					filesNumber++;
					var localPath=$(elements[i]).data("hiddenFile").val();
					if(localPath!=null&&localPath!=""){
						filesElements.push($(elements[i]));
					}
				}
			}
			if(filesNumber==0){
				LT.infomation({content:"该表单中没有文件输入项",type:"error",sticky:true,block:true});
				throw new Error("该表单中没有文件输入项");
			}
			var samePath={};
			var hiddenFile=null;
			var webPath=null;
			var localPath=null;
			var suffix="";
			var files=[];
			for(var i=0;i<filesElements.length;i++){//检查是否有重复的网络路径
				hiddenFile=filesElements[i].data("hiddenFile");
				if(hiddenFile.data("uploaded")){//已经上传
					continue;
				}
				localPath=hiddenFile.val();
				var li=localPath.lastIndexOf(".");
				if(li>=0){
					suffix=localPath.substring(li+1);
				}
				var upItem=filesElements[i].data("item");
				webPath=filesElements[i].data("subWebPath");
				webPath=webPath==null?"":webPath;
				webPath=webPath+upItem.filePreName+"."+suffix;
				filesElements[i].data("lt_file_webPath_temp",webPath);
				if(samePath[webPath]){
					var msg="出现网络路径相同的文件,该现象不被允许,请联系相关开发人员";
					LT.infomation({content:msg,type:"error",sticky:true,block:true});
					throw new Error(msg);
				}
				var uploadUrl=this.model.fileUploadUrl;
				if(this.model.cloudStoreToken){
					uploadUrl+=uploadUrl.indexOf("?")>0?"&":"?";
					uploadUrl+="token="+this.model.cloudStoreToken+"&accesspointtype=LIONTECH";
				}
				var param={path:webPath,customUpName:upItem.customUpName};
				if(upItem.extParam){
					param=$.extend(param,upItem.extParam);
				}
				if(param.returnUrl&&param.returnUrl.indexOf("http")==-1){//相对路径
					param.returnUrl=location.protocol +"//"+location.host+"/"+LT.getContextPath()+"/"+param.returnUrl;
				}
				files.push({label:upItem.label,url:uploadUrl,element:hiddenFile,param:param});
				samePath[webPath]=true;
			}
			if(files.length==0){
//				LT.infomation({content:"文件已全部上传完毕"});
				if(callback){					
					callback(0);
				}
				return;
			}
			if(!this.model.fileUploadUrl){
				var msg="未获取到文件服务器的地址";
				LT.infomation({content:msg,type:"error",sticky:true,block:true});
				throw new Error(msg);
			}
			var setting={files:files};
			setting.onSuccess=function(file,val){
				file.element.data("uploaded",true);
//				file.element.css("display","none");
				var element=file.element.data("element");
				element.data("lt_file_webPath",val||element.data("lt_file_webPath_temp"));
				var eb=file.element.data("emptyButton");
				if(eb){
					eb.hide();
				}
				validOneValidityItem(element.parent().parent());
			};
			setting.onFail=function(file){
//				alert("上传失败:"+file.element.attr("name"));
			}
			setting.onFinish=function(number,hasFail){
				if(callback&&!hasFail){					
					callback(number);
				}
			}
			LT.FileUpload.uploadOneByOne(setting);//一个一个上传
		}
		
		form.isNeedUploadFile=function(){
			return form.needUploadFile;
		}
		
		form.getNavSwitch=function(){
			return form.head.find(".form-switch-item.active").html();
		}
		
		form.getValues=function(containsEmpty,category){
			var result={};
			var elements=null;
			if(!category){//获取所有
				elements=form.body.find(".lt_form_show .lt_form_item_element");
			}else{//获取某类视图分组中的值
				var viewGroup=form.body.find(".viewGroup_"+category)
				if(viewGroup.length==0){
					var msg="不存在的分组类别:"+category
					LT.infomation({content:msg,type:"error",sticky:true,block:true});
					throw new Error(msg);
				}
				elements=viewGroup.find(".lt_form_item_element");
			}
			var groupMap={};
			var groupIndexOrder={};
			for(var i=0;i<elements.length;i++){
				if($(elements[i]).attr("disabled")){
					continue;
				}
				var value=getElementValue($(elements[i]));
				var item=$(elements[i]).data("item");		
				if(item.type=="word"||item.type=="downloadFile"){
					continue;
				}
				if((value==null||value=="")&&!containsEmpty){
					continue;
				}
				var name=item.name;
				if(name==null){
					continue;
				}
				var group=item.group;
				if(group!=null){//集合
					var groupName=group.name;
					var groupIndex=group.index;
					if(result[groupName]==null){
						result[groupName]=[];
						groupMap[groupName]=result[groupName];
						groupIndexOrder[groupName]=[];
					}
					if(groupIndexOrder[groupName].indexOf(groupIndex)==-1){
						groupIndexOrder[groupName].push(groupIndex);
					}
					if(result[groupName][groupIndex]==null){//集合中的某元素的第一个属性
						result[groupName][groupIndex]={};	
					}
					result[groupName][groupIndex][name]=value;
				}else{
					if(result[name]==null){//该值第一次
						result[name]=value;
					}else{
						if(!isArray(result[name])){//第二次
							result[name]=[result[name]];//第二次	
						}
						result[name].push(value);						
					}
				}
			}	
			for(var group in groupMap){//压缩组，去除为null的下标
				var itemList=groupMap[group];
				var deal=[];
				for(var i=0;i<groupIndexOrder[group].length;i++){//以group中元素第一次出现的顺序进行排列
					deal.push(itemList[groupIndexOrder[group][i]]);
				}
//				for(var i=0;i<itemList.length;i++){
//					if(itemList[i]!=null){
//						deal.push(itemList[i]);
//					}
//				}			
				result[group]=deal;
			}
			return result;
		}
		return form;
	}
	
	function changeValidity(element,validity){
		var itemDiv=element.root;
		var itemElement=element.contentElement;
		var item=itemElement.data("item");
		item.validity=validity;
		if(!itemElement.attr("validity")){//之前没有校验规则
			itemElement.attr("validity",validity);
			bindOneValidityItem(itemDiv);
		}else{
			itemElement.attr("validity",validity);
		}	
		itemElement.data("lt_validity_hasValid",false);
		validOneValidityItem(itemDiv);
	}
	
	function isArray(array) {
	    return Object.prototype.toString.call(array) === "[object Array]";
	}
	
	function addIconElement(element,iconElements){
		var elementDiv=element.contentElement.parent();
		var length=iconElements.length;
		for(var i=0;i<length;i++){
			iconElement=$(iconElements[i]);
			iconElement.css("cursor","pointer").addClass("lt_form_customIcon");
			iconElement.css({position:"absolute",right:3+23*i,top:"50%",marginTop:"-12px",width:23,height:23})
			LT.hoverBigger({element:iconElement,change:[2,2],time:50});
		}
		setTimeout(function(){
			elementDiv.css("right",24*length+elementDiv.data("right"));
		});
		element.root.append(iconElements);
	}
	
	function build(form){
		window.formStartTime=new Date().getTime();
		form.body.empty();
		var time=new Date().getTime();
		var formItem=null;
		var element=null;
		var fieldSet=null;
		var normalGroup=null;
		for(var i=0;i<form.model.formItems.length;i++){
			formItem=form.model.formItems[i];
			var entity=form.model.entity?form.model.entity:{};
			if(entity[formItem.name]!=null){
				formItem.value=entity[formItem.name];
			}
			if(formItem.viewGroup){//开始新的视图分组
				if(fieldSet!=null){
					if(!form.model.noBorder){
						fieldSet.append("<div class='ui-widget-content lt_form_borderDiv basedom'></div>");						
					}
					fieldSet.append("<div style='clear:both' class='basedom'></div>");
				}
				fieldSet=createNewFieldSet(formItem.viewGroup);
				form.body.append(fieldSet.parent());
				if(normalGroup!=null){
					var willAppend="";
					if(!form.model.noBorder){
						willAppend="<div class='ui-widget-content lt_form_borderDiv basedom'></div>";
					}
					willAppend+="<div style='clear:both' class='basedom'></div>";
					normalGroup.append(willAppend);
					normalGroup=null;
					fieldSet.css("margin-top","8px");
				}
			}else if(fieldSet==null&&normalGroup==null){
				normalGroup=$("<div class='ui-widget-content lt_form_viewGroup lt_form_show' style='margin-top:5px;margin-bottom:5px;border-bottom-width:0px'></div>");
				form.body.append(normalGroup);
			}
			if(formItem.type!='empty'){
				element=addItem(form, formItem);				
				if(fieldSet!=null){
					fieldSet.append(element.root);
				}else{
					normalGroup.append(element.root);
				}	
			}
			if(formItem.viewGroupEnd){//结束视图分组
				var willAppend="";
				if(!form.model.noBorder){
					willAppend="<div class='ui-widget-content lt_form_borderDiv basedom'></div>";
				}
				willAppend+="<div style='clear:both' class='basedom'></div>";
				fieldSet.append(willAppend);
				fieldSet=null;
				normalGroup=null;
			}
			
			function createNewFieldSet(viewGroup){
				var fieldSet=$("<fieldset></fieldset>");
				if(viewGroup.category){
					fieldSet.addClass("viewGroup_"+viewGroup.category);
				}
				fieldSet.puifieldset({buildModel:{title:viewGroup.name},toggleable: true,collapsed:viewGroup.collapsed,toggleable:viewGroup.toggleable});
				fieldSet=fieldSet.find(">.pui-fieldset-content").addClass("lt_form_fieldset").data("viewGroup",viewGroup);
				if(!form.model.noBorder){
					fieldSet.addClass("ui-widget-content lt_form_viewGroup lt_form_show").css("border-bottom-width","0px");						
				}
				return fieldSet;
			}
		}
		if(normalGroup!=null){
			var willAppend="";
			if(!form.model.noBorder){
				willAppend="<div class='ui-widget-content lt_form_borderDiv basedom'></div>";
			}
			willAppend+="<div style='clear:both' class='basedom'></div>";
			normalGroup.append(willAppend);
		}
		if(fieldSet!=null){
			var willAppend="";
			if(!form.model.noBorder){
				willAppend="<div class='ui-widget-content lt_form_borderDiv basedom'></div>";
			}
			willAppend+="<div style='clear:both' class='basedom'></div>";
			fieldSet.append(willAppend);
		}
		buildHead(form);//表单头
		layout(form);
		if(form.setting.parent){
			form.root.appendTo(form.setting.parent);
			form.setting.parent.css("overflow-y","auto");
		}
		var checks=$(".lt_form_checkbox");
		if(checks.length!=0){
			checks.puicheckbox();	
		}
		var radioes=$(".lt_form_radio");
		if(radioes.length!=0){
			radioes.puiradiobutton();	
		}
		if(top.SF&&top.SF.devMode){
//			LT.infomation({content:"渲染表单耗时:"+(new Date().getTime()-time)+"ms"});
		}
		if(form.setting.finish){
			form.setting.finish(form);
		}
		return form.root;
	}
	
	function buildHead(form){
		if(form.isHeadInit){
			return;
		}
		if(form.model.navSwitch&&form.model.navSwitch.length!=0){
			buildNavSwitch(form);
			return;
		}
		var operArea=form.setting.operArea;
		if(operArea==null||operArea.length==0){
			form.head.hide();
			form.body.css("top","0px");
			return;
		}else if(operArea.length!=1){
			var err="检查到当前界面上有多个操作区域标签";
			LT.infomation({message:err,sticky:true,model:true});
			throw new Error(err);
		}
		operArea.find(".pui-button").css("height","30px").css("float","right");
		form.isHeadInit=true;
		var tab=$("<div class='lt_form_head_tab'></div>").appendTo(form.head);
		tab.draggable({axis:"x",stop:function(event,ui){
			var o=tab.offset();
			var items=tab.find(">div :visible");
			var width=items.length*123;
			if(o.left>0){
				tab.animate({left:0},o.left/2);
			}else{
				var max=tab.parent().width()-width;
				if(o.left<max){
					tab.animate({left:max},-max/2);					
				}
			}
		}});
		operArea.addClass("lt_form_operArea ui-widget-content").css({marginTop:"0px",height:"35px",paddingTop:"6px"})
		.append($("<div style='clear:both'></div>")).appendTo(form.head);
		var fieldsets=form.body.find(".lt_form_fieldset");
		var html="";
		for(var i=0;i<fieldsets.length;i++){
			var one=$(fieldsets[i]);
			var vg=one.data("viewGroup");
			html+="<div class='lt_form_head_tabItem notselected ui-widget-content"+(vg.category!=null?" lt_form_tabItem_"+vg.category:"")+"'><div>"+vg.name+"</div></div>";
		}
		tab.html(html);
		var allTabItem=tab.find(".lt_form_head_tabItem");
		for(var i=0;i<allTabItem.length;i++){
			$(allTabItem[i]).data("group",$(fieldsets[i]).parent());
		}
		allTabItem.click(function(){
			var pre=tab.find(">.selected");
			if(pre.length!=0){
				pre.removeClass("selected ui-state-highlight").addClass("notselected")
				.data("group").find(">.pui-fieldset-legend").removeClass("ui-state-highlight");				
				if(LT.simpleStyle){
					pre.removeClass("lt_simpleStyle_background");
				}
			}
			$(this).addClass("selected ui-state-highlight").removeClass("notselected");	
			if(LT.simpleStyle){
				$(this).addClass("lt_simpleStyle_background");
			}
			var group=$(this).data("group");
			form.body.scrollTop(group.offset().top+form.body.scrollTop()-90)
			group.find(">.pui-fieldset-legend").addClass("ui-state-highlight");
		}).hover(function(){
			$(this).toggleClass("ui-state-active");
		});
	}
	
	function buildNavSwitch(form){
		var ns=form.model.navSwitch;
		var html="<div><div class='form-nav-switch'>";
		var navIndex=0;
		for(var i in ns){
			if(ns[i]==form.model.curSwitch){
				navIndex=i;
			}
			html+="<div class='form-switch-item' style='width:"+parseInt(100/ns.length)+"%'>"+ns[i]+"</div>";
		}
		html+="</div></div>";
		html=$(html);
		setTimeout(function(){
			$(html.find(".form-switch-item")[navIndex]).click();
		});
		html.delegate(".form-switch-item","click",function(){
			html.find(".form-switch-item.active").removeClass("active");
			$(this).addClass("active");
			dealSwitchBind(form,$(this).html());
		});
		form.head.css({left:"0px",right:"0px",height:"46px"}).css("border-top","1px #cccccc solid").append(html);
		form.body.css("top","46px");
	}
	
	function dealSwitchBind(form,name){
		var items=form.getFormItems();
		for(var i in items){
			if(items[i].bindSwitch&&items[i].bindSwitch!=name){
				items[i].hide();
			}else if(!items[i].hidden){
				items[i].show();
			}
		}
	}
	
	/**
	 * 布局
	 */
	function layout(form){
		var layout=null;
		var defaultData={width:275,height:32,labelWidth:75,contentWidth:"auto"};
		if(!form.model.layout){
			layout={name:"rowLayout",xGap:10,yGap:12,dir:"left",layoutData:defaultData};//默认布局
		}else{
			layout=form.model.layout;
		}
		layout.name=layout.name?layout.name:"rowLayout";
		layout.xGap=layout.xGap?layout.xGap:10;
		layout.yGap=layout.yGap?layout.yGap:0;
		var layoutName=layout.name;
		var ld=null;//布局数据,layoutData
		if(layoutName=="rowLayout"){//行布局
			layout.dir=layout.dir=="right"?"right":"left";
			layout.xGap=layout.xGap?layout.xGap:10;
			layout.yGap=layout.yGap?layout.yGap:0;
			ld=layout.layoutData=layout.layoutData?layout.layoutData:defaultData;
			ld.width=ld.width?ld.width:defaultData.width;
			ld.height=ld.height?ld.height:defaultData.height;
			ld.labelWidth=ld.labelWidth?ld.labelWidth:defaultData.labelWidth;
			ld.contentWidth=ld.contentWidth?ld.contentWidth:defaultData.contentWidth;
			
			var allItem=form.body.find(".lt_form_item");
			var allLabel=form.body.find(".lt_form_item_label");
			var allLabelDiv=form.body.find(".lt_form_itemLabelDiv");
			var allElement=form.body.find(".lt_form_item_element");
			var allElementDiv=form.body.find(".lt_form_item_elementDiv");
			allItem.css({width:ld.width,height:ld.height,float:layout.dir}).css("margin-top",layout.yGap).addClass("ui-widget-content").css("border-width","0px").css("border-width","0px 0px 1px 0px");//为了使用jqueryui的边框样式，只有出此下策
			allLabel.css({height:ld.height});
			allLabelDiv.css({width:ld.labelWidth});
			allElement.css({width:"100%"});
			if(ld.contentWidth=="auto"){//自动填充
				allElementDiv.css({right:layout.xGap,position:"absolute",width:"auto",left:ld.labelWidth,top:"3px",bottom:"3px"});
			}else{				
				allElementDiv.css({right:layout.xGap,width:ld.contentWidth,height:ld.height});
			}	
			allElementDiv.data("right",layout.xGap);
			for(var i=0;i<allItem.length;i++){
				var item=$(allElement[i]).data("item");
				if(item.thumb){
					$(allItem[i]).css("border-bottom-width","0px");
				}
				if(item.layoutData){
					var wholeLD=ld;//全局布局数据
					var subLd=item.layoutData;
					subLd.width=subLd.width?subLd.width:wholeLD.width;
					subLd.height=subLd.height?subLd.height:wholeLD.height;
					subLd.labelWidth=subLd.labelWidth?subLd.labelWidth:wholeLD.labelWidth;
					subLd.contentWidth=subLd.contentWidth?subLd.contentWidth:wholeLD.contentWidth;
					
					if(item.type=="checkArea"&&subLd.height=="auto"){
						autoHeight($(allElement[i]),$(allItem[i]),$(allLabel[i]),$(allLabelDiv[i]));
					}
					
					$(allItem[i]).css({width:subLd.width,height:subLd.height});
					$(allLabel[i]).css({height:subLd.labelHeight||subLd.height});
					$(allLabelDiv[i]).css({width:subLd.labelWidth});
					if(subLd.contentWidth=="auto"){//自动填充
						$(allElementDiv[i]).css({position:"absolute",width:"auto",left:subLd.labelWidth,top:"3px",bottom:"3px"});
					}else{				
						$(allElementDiv[i]).css({left:subLd.labelWidth,width:subLd.contentWidth,height:subLd.height});
					}
				}
				var icon=$(allItem[i]).find(".lt_form_customIcon");
				if(icon.length!=0){
//					alert($(icon[0]).width()*icon.length+1+$(allElementDiv[i]).data("right"))
					$(allElementDiv[i]).css("right",$(icon[0]).width()*icon.length+1+$(allElementDiv[i]).data("right"));
				}
				var tag={textArea:true,text:true,password:true,tree:true,valueTree:true,select:true,uploadFile:true,downloadFile:true};
				if($.browser.msie&&tag[item.type]){//ie8
					$(allElement[i]).css("height",$(allItem[i]).height()-10)
				}
			}
		}
		if(form.model.noBorder){
			form.body.find(".lt_form_item").css("border-width","0px");
			form.body.find(".lt_form_item>div").css("border-width","0px");
			form.body.find(".lt_form_viewGroup").css("border-width","0px");
		}
		if(!form.hasInited){
			form.hasInited=true;
			setTimeout(function(){
				var cost=new Date().getTime()-window.formStartTime;
				if(top.SF&&top.SF.devMode){
//					LT.infomation({content:"渲染表单耗时:"+cost+"ms",time:1000});
				}
				console.log("渲染表单耗时"+cost+"ms");
			}, 0);			
		}
	}
	
	function autoHeight(a,b,c,d){
		setTimeout(function(){
			var h=a[0].scrollHeight+5;
			a.height(h);
			b.height(h+10);
			c.height(h+10);
			d.height(h+10);
		});
	}
	
	function addItem(form,item){
		if(!item.type){
			item.type="text";
		}
		item.value=item.value==null?"":item.value;
		var needValidity=null;
		var itemDiv=$('<div class="lt_form_item lt_validityRoot"></div>');
		var border=item.noBorder?"0px 0px 0px 0px":"0px 1px 0px 1px";
		itemDiv.html("<div style='height:100%;border-width:"+border+";margin-left:-1px;background:none;' class='lt_form_itemLabelDiv ui-widget-content'>"
				+"<a class='lt_form_item_label' title='"+item.label+"'>"+item.label+"</a>"
				+"</div>"
				+"<div class='lt_form_item_elementDiv lt_form_item_noticeDiv'></div>");
		var itemLabelDiv=itemDiv.find(".lt_form_itemLabelDiv");
		var itemLabel=itemLabelDiv.find("a");
		var elementDiv=itemDiv.find(".lt_form_item_elementDiv");
		var element;
		var oneFormIem={};
		
		if(item.type=="text"||!item.type){
			element=$('<input type="text" />').val(item.value).puiinputtext();
			if(item.validity&&item.validity.indexOf("date")>=0){
				var date=$("<img class='descImg'></img>").attr("src",LT.getBasePath()+"/common/workframe/liontech/img/calendar.png").appendTo(elementDiv);
				item.dateFormat=item.dateFormat||"yymmdd";
//				if(!item.readOnly){		
					var param={dateFormat:item.dateFormat,showButtonPanel:true,numberOfMonths:1,changeMonth:true,changeYear:true};
					if(item.onlyLastDate){//只允许选择月末	
						var lastDays=[31,28,31,30,31,30,31,31,30,31,30,31];
						param.beforeShowDay=function(d){
							var year=d.getFullYear();
							var month=d.getMonth();
							var day=d.getDate();
							var leap=(year%400==0||(year%4==0&&year%100!=0));
							if(leap){
								lastDays[1]=29;
							}else{
								lastDays[1]=28;
							}
							if(lastDays[month]==day){								
								return [true];
							}else{
								return false;
							}
						}
					}
					param.beforeShow=function(){
						if(element.attr("readonly")){
							return false;
						}
					}
					element.datepicker(param);
					date.click(function(){
						if(element.attr("readonly")){
							return;
						}
						element.datepicker("show");
					});
//				}
			}
			if(item.validity&&item.validity.indexOf("double")>=0){
				var v=parseFloat(item.value);
				if(!isNaN(v)){
					v=LT.thousandsFormat(v);
					element.val(v);
				}
				
			}
			if(item.readOnly){
				element.attr("readonly",true);
			}
		}else if(item.type=="password"){
			element=$("<input type='password'/>").val(item.value).puipassword();
			if(item.readOnly){
				element.attr("readonly",true);
			}
		}else if(item.type=="select"){
			var html='<select>';
			if(item.validity==null||item.validity.indexOf("require")<0){
				html+='<option value="">'+"请选择"+"</option>";
			}
			for(var i in item.selects){
				html+='<option value='+i+'>'+	item.selects[i]+"</option>";
			}
			html+="</select>";
			element=$(html).val(item.value);
			if(LT.toString(item.selects)=='{}'&&item.value!=null){//没有下拉框选项，但是有值，refresh的时候赋值上
				element.data("initValue",item.value);
			}
			if(item.readOnly){
				element.attr("readonly",true);
			}
			 element.puidropdown({fromExist:false,filter:item.filter}).data("item",item);
			 oneFormIem.event={};
			 oneFormIem.content=element;
			 element.change(function(){
					if(oneFormIem.event.change){
						oneFormIem.event.change.call(this,$(this).val());
					}
				});
			 element.refresh=function(map){
				 var array=[];
				 for(var i in map){
					 array.push({paramKey:i,paramValue:map[i]});
				 }
				 var ve=element.data("valueElement");
				  ve.puidropdown("refresh",array);
				  if(ve.data("initValue")!=null){
					  ve.val(ve.data("initValue")).change();
					  ve.data("initValue",null);
				  }
				  return ve;
			 }
			 element=element.parent().parent().data("valueElement",element);
		}else if(item.type=="textArea"){
			element=$('<textArea></textArea>').val(item.value).puiinputtextarea();
			if(item.readOnly){
				element.attr("readonly",true);
			}
		}else if(item.type=="tree"||item.type=="valueTree"){
			var img=$("<img class='descImg'></img>").attr("src",LT.getBasePath()+"/common/workframe/liontech/img/org.png")
			.appendTo(elementDiv);
			element=$('<input type="text"/>').puiinputtext();
			if(item.readOnly){
				element.attr("readonly",true);
			}
			element.hover(function(){
				img.toggleClass("lt_tool_hide");
			});
			LT.createInputTree(item.tree,item.value,element,item.type=="valueTree",false);		
			img.click(function(){
				element.focus();
			});
			oneFormIem.api={};
			oneFormIem.api.getSelectedNode=function(){
				if(element.data("equalNumber")!=1||element.val()==null||element.val()==""){
					return null;
				}
				return element.data("lastEqNode");
			}
			oneFormIem.api.selectedNode=oneFormIem.api.selectNode=function(value){
				element.val(value).blur();
			}
		}else if(item.type=="checkArea"){//复选框组
			element=$("<div class='ui-widget-content ui-corner-all' style='padding-right:10px;overflow:auto;'></div>").css({border:"1px dashed black"});
			oneFormIem.api={};
			oneFormIem.api.refresh=function(checkMapping,itemValue){
				item.checkItems=form.model.mapping[item.name]=checkMapping;
				item.value=itemValue;
				buildCheckContent();
				element.find(".lt_form_checkbox").puicheckbox();
			}
			oneFormIem.event={};
			buildCheckContent();
			function buildCheckContent(){
				var checked={};
				if(item.value){
					var values=item.value.split("|");
					for(var i=0;i<values.length;i++){
						checked[values[i]]=true;
					}
				}
				var ci=null;
				oneFormIem.content={};
				var html="";
				var nameArray=[];
				for(var i in item.checkItems){
					ci=item.checkItems[i];
					html+="<div class='lt_form_float_block'>"
						  +"<input type='checkbox'"+(checked[i]?" checked='checked'":"")+(item.readOnly?" readonly='true'":"")+" class='lt_form_checkbox' key='"+i+"'/>"
						  +"<div class='lt_form_check_radio_label' title='"+item.checkItems[i]+"'>"+item.checkItems[i]+"</div>"
						  +"</div>";
					nameArray.push(item.checkItems[i]);
				}
				element.html(html);
				if(item.blockWidth){
					element.find(".lt_form_float_block").css("width",item.blockWidth);
					element.find(".lt_form_check_radio_label").addClass("lt_form_over_hidden").css("width",item.blockWidth-22);
				}
				var cbs=element.find(".lt_form_checkbox");
				cbs.change(function(){
					if(oneFormIem.event.change){
						oneFormIem.event.change.call(this,$(this).attr("key"),$(this).attr("checked"));
					}
				});
				element.find(".lt_form_check_radio_label").click(function(){
					$(this).parent().find(".pui-chkbox-box").click();
				});
				for(var i=0;i<cbs.length;i++){
					oneFormIem.content[nameArray[i]]=$(cbs[i]);
				}
			}
			
		}else if(item.type=="radioArea"){//单选框组
			element=$("<div class='ui-widget-content ui-corner-all' style='padding-right:10px'></div>").css({border:"1px dashed black"});
			oneFormIem.api={};
			oneFormIem.api.refresh=function(radioMapping,itemValue){
				item.radioItems=form.model.mapping[item.name]=radioMapping;
				item.value=itemValue;
				buildRadioContent();
				element.find(".lt_form_radio").puiradiobutton();
			}
			oneFormIem.event={};
			buildRadioContent();
			function buildRadioContent(){
				var ri=null;
				oneFormIem.content={};
				var html="";
				var nameArray=[];
				for(var i in item.radioItems){
					ri=item.radioItems[i];
					html+="<div class='lt_form_float_block'>"
						  +"<input type='radio'"+(i==item.value?" checked='checked'":"")+(item.readOnly?" readonly='true'":"")+" class='lt_form_radio' key='"+i+"'  name='"+item.name+"'/>"
						  +"<div class='lt_form_check_radio_label'>"+item.radioItems[i]+"</div>"
						  +"</div>";
					nameArray.push(item.radioItems[i]);
	  			}
				element.html(html);
				if(item.blockWidth){
					element.find(".lt_form_float_block").css("width",item.blockWidth);
					element.find(".lt_form_check_radio_label").addClass("lt_form_over_hidden").css("width",item.blockWidth-22);
				}
				var rbs=element.find(".lt_form_radio");
				rbs.change(function(){
					if(oneFormIem.event.change){
						oneFormIem.event.change.call(this,$(this).attr("key"),$(this).attr("checked"));
					}
				});
				element.find(".lt_form_check_radio_label").click(function(){
					$(this).parent().find(".pui-radiobutton-box").click();
				});
				for(var i=0;i<rbs.length;i++){
					oneFormIem.content[nameArray[i]]=$(rbs[i]);
				}
			}	
		}else if(item.type=="uploadFile"){
			oneFormIem.api={};
			oneFormIem.api.mutiItem=function(){
				var ld=$.extend({},item.layoutData);
				ld.labelWidth="0px";
				var index=1;
				var addMutiItem={label:"",noBorder:true,name:"",type:"custom",customElement:function(value){
					var div=$("<div title='点击继续添加 "+item.label+"' style='width:100%;height:100%;text-align:center;cursor:pointer'></div>");
					div.append($("<img style='height:100%' src='"+LT.getBasePath()+"/common/images/tool/addFileItem.png'></img>"));
					div.click(function(){
						var nItem=$.extend({},item);
						nItem.value="";
						nItem.validity="";
						nItem.filePreName=nItem.filePreName+"_"+index++;
						form.insertBefore(addMutiItem.getElement(),[nItem]);
						form.layout();
					});
					setTimeout(function(){
						var p=div.parent();
						p.css("right","0px");
						p.parent().css("border-radius","5px").css("margin-left","10px").css("margin-top","3px").css("border-width","1px");
						form.layout();
					});
					return div;
				},customValue:function(){return null},layoutData:ld};
				form.insertAfter(oneFormIem,[addMutiItem]);
			}
			form.needUploadFile=true;
			if(item.filePreName==null){
				item.filePreName="";
			}
			var html="<img class='descImg' title='点击我进行文件选择' src='"+LT.getBasePath()+"/common/workframe/liontech/img/choseFile.png'></img>";
			html+="<input type='file' title='点击我进行文件选择' class='descImg' style='width:60px'/>";
			elementDiv.html(elementDiv.html()+html);
			var img=$(elementDiv.find(".descImg")[0]);
			window.idIndex=window.idIndex||1;
			var hiddenFile=$(elementDiv.find(".descImg")[1]).css("opacity",0).attr("id","form-hidden-file-"+window.idIndex++);
			if(item.readOnly){
				hiddenFile.hide();
			}
			hiddenFile.change(function(){
				if(!hiddenFile.val()&&hiddenFile.data("uploaded")){
					return;
				}		
				element.data("lt_file_webPath",null);
				hiddenFile.data("uploaded",false);
				element.val(hiddenFile.val());
				element.change();
			});
			element=$("<input type='text' title='点击右侧图标进行文件选择' style='cursor:pointer'/>").puiinputtext();
			
			elementDiv.removeClass("lt_form_item_noticeDiv");
			element.addClass("lt_form_item_noticeDiv");
			
			element.data("hiddenFile",hiddenFile);
			element.attr("readonly",true);
			hiddenFile.data("element",element);
			element.data("subWebPath",item.subWebPath);
			if(item.value){
				element.data("lt_file_webPath",item.value);
				element.val(item.value);
				hiddenFile.data("uploaded",true);
			}
			element.bind("click",function(){//下载
				var webPath=element.data("lt_file_webPath");
				if(!webPath){//无文件
					LT.infomation({content:"无文件",time:700},{element:itemDiv});
					return;
				}
				if(!form.model.fileUploadUrl){
					var msg="未获取到文件服务器的地址";
					LT.infomation({content:msg,type:"error",sticky:true,block:true});
					throw new Error(msg);
				}
				webPath=encodeURI(webPath);
				LT.download(form.model.fileDownloadUrl+"?uuid="+webPath);			
			});
			if(item.showImg){
				item.thumb=true;
			}
			//TODO 待测试
			if(item.thumb){		
				element.removeClass("lt_form_item_noticeDiv");//上面的代码中给element加上了 lt_form_item_noticeDiv
				itemDiv.css("min-height","64px").css("min-width","64px").css({marginTop:3,marginBottom:3});
				var thumbSrc=form.model.fileDownloadUrl+"/"+item.value;
				if(item.w&&item.h){
					thumbSrc+="?w="+item.w+"&h="+item.h;
				}
				var selectFileSrc=LT.getBasePath()+"/common/images/tool/selectFile.png";
				var fileArea=$("<div class='lt_form_item_noticeDiv ui-widget ui-state-default lt_form_fileArea'></div>");
				if(item.showImg){
					element.hide();
					$(elementDiv.find(".descImg")[0]).hide();
					fileArea.appendTo(elementDiv);
				}else{
					elementDiv.hide();
					itemLabel.parent().hide();
					fileArea.appendTo(itemDiv)
				}
				if(LT.simpleStyle){
					fileArea.css("background","none");
				}
				fileArea.html(
						"<div class='lt_form_fileArea_thumb "+(item.showImg?"showImg":"")+"'>"
						+"<img style='max-width:100%;height:100%;cursor:pointer' src='"+(item.value?thumbSrc:selectFileSrc)+"'></img>"
						+ "</div>"
						+(item.showImg?"":("<div class='lt_form_fileArea_label' title='"+item.label+"'>"+item.label+"</div>"))
						+"<div class='lt_form_fileArea_bg'>"
						+"<div title='点击进行下载' class='lt_form_fileArea_oper ui-widget ui-state-highlight'>下载"
						+"<img style='height:22px' src='"+LT.getBasePath()+"/common/images/tool/download.png'></img>"
					    +"</div>"
					    +"<div title='点击进行预览' class='lt_form_fileArea_oper ui-widget ui-state-highlight'>预览" 
					    +"<img style='height:22px' src='"+LT.getBasePath()+"/common/images/tool/preview.png'></img>"
					    +"</div>"
					    +(item.readOnly?"":"<div title='点击进行文件选择' class='lt_form_fileArea_oper ui-widget ui-state-highlight'>替换"
					    		+"<img style='height:22px' src='"+LT.getBasePath()+"/common/images/tool/upload.png'></img>"
					    		+"</div>"
					    		)
					    +(!item.deletable?"":"<div title='点击删除该项' class='lt_form_fileArea_oper ui-widget ui-state-highlight'>删除" 
					    +"<img style='height:22px' src='"+LT.getBasePath()+"/common/images/tool/delete.png'></img>"
					    +"</div>")
					    +"</div>"
					    +"<img title='取消该文件' class='lt_form_fireArea_empty' src='"+LT.getBasePath()+"/common/images/tool/delete.png'></img>"
						);
				var thumbDiv=fileArea.find(".lt_form_fileArea_thumb");
				var thumbImg=thumbDiv.find("img");
				thumbImg.load(function(){
					setTimeout(function(){
						if(thumbImg.height()>thumbDiv.height()){
							thumbImg.css({width:"",height:"100%"});
						}						
					}, 0)
				});
				var bg=fileArea.find(".lt_form_fileArea_bg");
				var opers=bg.find(".lt_form_fileArea_oper");
				if(item.showImg){
					bg.hide();
				}
				var oper_down=$(opers[0]);			
				oper_down.click(function(){element.click()})
				
				var viewable={png:1,PNG:1,jpg:1,JPG:1,jpeg:1,JPEG:1,BMP:1,bmp:1,gif:1,GIF:1};
				item.value=item.value==null?"":item.value;
				var suffix=item.value.substring(item.value.lastIndexOf(".")+1,item.value.length)
				var oper_view=$(opers[1]);
				if(viewable[suffix]||item.value.length==32){//临时解决方案
					var webPath=encodeURI(element.data("lt_file_webPath"));
					var url=form.model.fileDownloadUrl+"?uuid="+webPath;
					var thumbUrl=url+"&isThumb=1";
					item.lt_form_imageShow={image:url,thumbImage:thumbUrl,name:item.label};					
					if(LT.isIe8()){
						LT.noticable(oper_view.attr("title","chrome下有更高级的图片预览功能哦"),"提示");
					}
					oper_view.click(function(){
						if(LT.isIe8()){
							window.open(url);
							return;
						}			
						var path=element.data("lt_file_webPath");
						path=encodeURI(path);
						
						var allItems=form.getFormItems();
						var images=[];
						var thumbImages=[];
						var names=[];
						var curIndex=0;
						for(var i=0;i<allItems.length;i++){
							var it=allItems[i];
							if(it.lt_form_imageShow){
								var show=it.lt_form_imageShow;
								images.push(show.image);
								thumbImages.push(show.thumbImage);
								names.push(show.name);
								if(it==item){
									curIndex=images.length-1;
								}
							}
						}
						LT.imageShow(thumbImages,images,names,curIndex);
					});					
				}else{
					oper_view.hide();
				}
						
				var oper_up=null;
				if(!item.readOnly){
					oper_up=opers[2];
					hiddenFile.addClass("lt_form_fileArea_hf");
					if(item.value){
//						hiddenFile.appendTo(oper_up);	
						hiddenFile.appendTo(thumbDiv);			
					}else{
						hiddenFile.appendTo(thumbDiv);										
					}
				}		
				var oper_delete=$(opers[3]);
				oper_delete.click(function(){
					itemDiv.remove();
				});
				var empty=fileArea.find(".lt_form_fireArea_empty");
				empty.click(function(){
					empty.hide();
					hiddenFile.wrap('<form>').closest('form').get(0).reset();
					hiddenFile.unwrap();
					hiddenFile.change();
					thumbImg.css({width:"auto"});
				});
				hiddenFile.data("emptyButton",empty);
				!item.showImg&&itemDiv.css({marginLeft:"10px"});
				!item.showImg&&itemDiv.hover(function(evt){
					var v=bg.is(":visible");
					if(v&&evt.type=="mouseleave"){
						bg.hide();
						thumbDiv.removeClass("lt_tool_opacity_60");
						hiddenFile.appendTo(thumbDiv);
					}else if(hiddenFile.data("uploaded")&&evt.type=="mouseenter"){
						bg.show();
						thumbDiv.addClass("lt_tool_opacity_60");
						hiddenFile.appendTo(oper_up);
					}
				});
				if(!item.value){
					thumbImg.attr("title","点击进行文件选择");
				}
				hiddenFile.change(function(){
					empty.hide();
					if(hiddenFile.val()){//新选择了文件
						if(item.showImg&&!LT.isImg(hiddenFile.val())){
							LT.error("请选择正确的图片格式");
							thumbImg.attr("src",LT.getBasePath()+"/common/images/tool/selectFile.png");
							thumbImg.attr("title","点击进行文件选择");
							thumbImg.css({width:"auto"});
							hiddenFile.val("");
						}else{
							var src=LT.getBasePath()+"/common/images/tool/wait4upload.png";
							if(item.showImg){
								var fileInputId=hiddenFile.attr("id");
								var src=LT.getLocalFileUrl(fileInputId);
								thumbImg.css({width:"auto"});
							}
							thumbImg.attr("src",src);
							thumbImg.attr("title",hiddenFile.val());
							empty.show();
						}
					}else{//无文件
						if(!hiddenFile.data("uploaded")){						
							thumbImg.attr("src",LT.getBasePath()+"/common/images/tool/selectFile.png");
							thumbImg.attr("title","点击进行文件选择");
						}
					}
				});
			}
		}else if(item.type=="downloadFile"){
			element=$("<input style='font-size:14px' type='button' value='"+item.filePreName+"'/>").click(function(){
				if(!form.model.fileUploadUrl){
					var msg="未获取到文件服务器的地址";
					LT.infomation({content:msg,type:"error",sticky:true,block:true});
					throw new Error(msg);
				}
				webPath=encodeURI(item.value);
				LT.download(form.model.fileDownloadUrl+"?uuid="+webPath);
			}).puibutton();
			element.attr("readonly",true);
			//TODO 待测试
			if(item.thumb){		
				itemDiv.css("min-height","64px").css("min-width","64px").css({marginTop:3,marginBottom:3});
				elementDiv.hide();
				itemLabel.parent().hide();
				var thumbSrc=form.model.fileDownloadUrl+"/"+item.value;
				var noFileSrc=LT.getBasePath()+"/common/images/tool/noFile.png";
				var fileArea=$("<div class='ui-widget ui-state-default lt_form_fileArea'></div>").appendTo(itemDiv);
				if(LT.simpleStyle){
					fileArea.css("background","none");
				}
				fileArea.html(
						"<div class='lt_form_fileArea_thumb'>"
						+"<img style='width:100%;cursor:pointer' src='"+(item.value?thumbSrc:noFileSrc)+"'></img>"
						+"</div>"
						+"<div class='lt_form_fileArea_label' title='"+item.label+"'>"+item.label+"</div>"
						+"<div class='lt_form_fileArea_bg'>" 
						+"<div title='点击进行下载' class='lt_form_fileArea_oper ui-widget ui-state-highlight'>下载"
						+"<img style='height:22px' src='"+LT.getBasePath()+"/common/images/tool/download.png'></img>"
					    +"</div>"
					    +"<div title='点击进行预览' class='lt_form_fileArea_oper ui-widget ui-state-highlight'>预览" 
					    +"<img style='height:22px' src='"+LT.getBasePath()+"/common/images/tool/preview.png'></img>"
					    +"</div>"
						+"</div>"
						
				);
				var thumbDiv=fileArea.find(".lt_form_fileArea_thumb");
				var thumbImg=thumbDiv.find("img").load(function(){
					setTimeout(function(){
						if(thumbImg.height()>thumbDiv.height()){
							thumbImg.css({width:"",height:"100%"});
						}				
					}, 0)
				});
				var bg=fileArea.find(".lt_form_fileArea_bg");
				var opers=bg.find(".lt_form_fileArea_oper");
				var oper_down=$(opers[0]);
				oper_down.click(function(){element.click()});
				
				var viewable={png:1,PNG:1,jpg:1,JPG:1,jpeg:1,JPEG:1,BMP:1,bmp:1};
				var suffix=item.value.substring(item.value.lastIndexOf(".")+1,item.value.length)
				var oper_view=$(opers[1]);
				if(viewable[suffix]){
					var webPath=encodeURI(item.value);
					var url=form.model.fileDownloadUrl+"?uuid="+webPath;
					var thumbUrl=url+"&isThumb=1";
					item.lt_form_imageShow={image:url,thumbImage:thumbUrl,name:item.label};
					if(LT.isIe8()){
						LT.noticable(oper_view.attr("title","chrome下有更高级的图片预览功能哦"),"提示");
					}
					oper_view.click(function(){
						if(!form.model.fileUploadUrl){
							var msg="未获取到文件服务器的地址";
							LT.infomation({content:msg,type:"error",sticky:true,block:true});
							throw new Error(msg);
						}
						if(LT.isIe8()){
							window.open(url);
							return;
						}
						var allItems=form.getFormItems();
						var images=[];
						var thumbImages=[];
						var names=[];
						var curIndex=0;
						for(var i=0;i<allItems.length;i++){
							var it=allItems[i];
							if(it.lt_form_imageShow){
								var show=it.lt_form_imageShow;
								images.push(show.image);
								thumbImages.push(show.thumbImage);
								names.push(show.name);
								if(it==item){
									curIndex=images.length-1;
								}
							}
						}
						LT.imageShow(thumbImages,images,names,curIndex);
					});				
				}else{
					oper_view.hide();
				}
				itemDiv.css({marginLeft:"10px"});
				if(item.value){
					itemDiv.hover(function(){
						bg.toggle();
						thumbDiv.toggleClass("lt_tool_opacity_60");
					});				
				}
			}
		}else if(item.type=="word"){
			element=$('<div class="ui-widget-content ui-corner-all"></div>').css({padding:"2px",overflow:"auto"}).html(item.value);		
		}else if(item.type=="label"){
			element=$('<div class="ui-widget-content lt_form_item_element" style="border-width:0px;overflow:hidden;white-space:nowrap;padding:2px;cursor:pointer;"></div>').html(item.value);		
			elementDiv.css({marginLeft:"0px",marginRight:"0px",marginTop:"2px"});
			oneFormIem.setValue=function(val,showValue){
				element.data("customValue",val);
				element.html(showValue);
			}
			item.customValue=function(){
				return element.data("customValue");
			}
		}else if(item.type=="custom"){
			element=item.customElement(item.val);
		}else{
			var err="不支持的表单项类型:"+item.type;
			LT.infomation({content:err,type:"error",block:"true",sticky:"true"});
			throw new Error(err);
		}
		var temp={text:true,password:true,select:true,textArea:true,checkArea:true,radioArea:true,tree:true,valueTree:true,uploadFile:false};
		if(temp[item.type]){//将提示边框放在element上
			elementDiv.removeClass("lt_form_item_noticeDiv");
			element.addClass("lt_form_item_noticeDiv");
		}
		element.change();
		element.addClass("lt_form_item_element").data("item",item);
		if(item.name){
			element.attr("name",item.name);	
		}		
		if(item.validity&&item.type!="word"&&item.type!="downloadFile"){//文字区域和文件下载不需要校验
			element.attr("validity",item.validity);
			needValidity=true;
		}
		if(item.type=="uploadFile"&&!item.validity){//文件上传始终需要校验(应付选择了文件没上传的情况)
			element.attr("validity","uploadFile");
			needValidity=true;
		}
		elementDiv.append(element);
		if(item.readOnly){			
			element.attr("readonly",true);
		}
		if(item.readOnly&&item.type!="word"){
			itemDiv.css("opacity",0.75);
			if($.browser.msie&&$.browser.version=="8.0"){
				element.css("opacity",0.75);
				itemLabel.css("opacity",0.75);
				}
			 itemLabel.css("textDecoration","none");
		}else if(item.type!="word"){
			itemLabel.addClass("ui-state-focus").css("background","none").css("border","none");
		}
		oneFormIem.root=itemDiv;
		if(oneFormIem.content==null){
			oneFormIem.contentElement=oneFormIem.content=element;
		}else{
			oneFormIem.contentElement=element;
		}
		if(item.key!=null&&item.key!=""){//通过key访问元素
			form.elements[item.key]=oneFormIem;
		}
		if(needValidity){			
			bindOneValidityItem(itemDiv);
		}else if(item.title!=null){
			element.attr("validity","");
			needValidity=true;
			bindOneValidityItem(itemDiv);
		}
		item.getElement=function(){
			return oneFormIem;
		}
		item.changeValidity=function(validity){
			changeValidity(oneFormIem,validity)
		}
		item.remove=function(){
			itemDiv.remove();
		}
		oneFormIem.hide=item.hide=function(){
			itemDiv.hide();
		}
		oneFormIem.show=item.show=function(){
			itemDiv.show();
		}
		item.addIcon=function(iconElement){
			addIconElement(oneFormIem,iconElement);
		}
		oneFormIem.getValue=item.getValue=function(){
			return getElementValue(element, false);
		}
		item.insertAfter=function(models){
			form.insertAfter(oneFormIem,models);
		}
		if(item.hidden){
			itemDiv.hide();	
		}
		return oneFormIem;//返回表单项和表单内容元素组成的表单项
	}
	
	function validForm(form,category){
		if(!category){
			rootElement=form.body;
		}else{
			rootElement=form.body.find(".viewGroup_"+category);
		}
		var validityItems=rootElement.find(".lt_form_show .lt_validityRoot:has([validity])");
		var result=0;
		var first=null;
		for(var i=0;i<validityItems.length;i++){
			if(!validOneValidityItem($(validityItems[i]))){
				if(result==0){
					first=$(validityItems[i]);
				}
				result++;
			}
		}	
		if(first!=null){
			var element=first.find("[validity]");
			element.focus();
			form.body.scrollTop(first.offset().top+form.body.scrollTop()-90);
		}
		return result;
	}
	
	function createFromRemote(form,url){
		var pro=LT.startProgress({message:"正在获取表单数据"});
		LT.asynPost(url,{},function(model){
			pro.changeMessage("正在构建页面");
			try {
				checkData(model);
				form.model=model;
				form.userData=model.userData;
				build(form);
			} catch (e) {
				pro.stopProgress(true);
				throw e;
			}			
			pro.stopProgress(true);
		});
	}
	
	function checkData(model){
		var item;
		var msg=null;
		model.mapping=model.mapping?model.mapping:{};
		model.trees=model.trees?model.trees:{};
		for(var i=0;i<model.formItems.length;i++){
			item=model.formItems[i];
			if(item.type=="select"&&item.selects==null){
				item.selects=model.mapping[item.name];
				if(item.selects==null){
					msg="表单项<font color='red'>"+item.label+"</font>为下拉框类型,但未找到下拉框的数据源";
					break;
				}
			}else if(item.type=="tree"||item.type=="valueTree"&&item.tree==null){
				item.tree=LT.toJson(model.trees[item.name]);
				if(item.tree==null){
					msg="表单项<font color='red'>"+item.label+"</font>为下拉树类型,但未找到下拉树的数据源";
					break;
				}
			}else if(item.type=="checkArea"&&item.checkItems==null){
				item.checkItems=model.mapping[item.name];
				if(item.checkItems==null){
					msg="表单项<font color='red'>"+item.label+"</font>为复选框组,但未找到复选框集合的数据源";
					break;
				}
			}else if(item.type=="radioArea"&&item.radioItems==null){
				item.radioItems=model.mapping[item.name];
				if(item.radioItems==null){
					msg="表单项<font color='red'>"+item.label+"</font>为单选框组,但未找到单选框集合的数据源";
					break;
				}
			}
		}
		if(msg!=null){
			LT.infomation({type:"error",content:msg,sticky:true,block:true});
			throw new Error(msg);
		}
	}
	
	function bindForm(rootElement){
		var validityItems=rootElement.find(".lt_validityRoot:has([validity])");
		for(var i=0;i<validityItems.length;i++){
			bindOneValidityItem($(validityItems[i]));
		}
		return true;
	}

	
	function bindOneValidityItem(validityItem){
		var element=validityItem.find("[validity]");
		var elementDiv=validityItem.find(".lt_form_item_elementDiv");
		var noticeDiv=validityItem.find(".lt_form_item_noticeDiv");
		var label=validityItem.find(".lt_form_item_label").html();
		var validities=element.attr("validity").split("|");		
		validOneValidityItem(validityItem);
		element.change(function(){
			//1、如果给一个配置了不能为null的下拉框被设置值为null（比如查询重置操作）,校验就会报错（该值不能为空）
			//2、但是puidropdown里面通过判断发现该下拉框的值没有'空'的选项，将其又设置为了第一个选项，值就不为空了
			//如果1发生在2之前，就会出现，明明值不为空，但是却提示该值不能为空，所以将第一步中的校验异步执行
			setTimeout(function(){
				validOneValidityItem(validityItem);
			}, 0)			
		});
		noticeDiv.hover(function(evt){
			evt=evt||window.event;
			if(evt.type=="mouseenter"){
				var s = evt.fromElement || evt.relatedTarget;
				if (s&&this.contains(s)) {
					return;
				}
				if(noticeDiv.data("lt_validity_notice")||element.data("item").title){
					var delay=window.setTimeout(function(){//延时200毫秒
						if(noticeDiv.data("lt_validity_delay")){
							var info=noticeElement(noticeDiv,element.data("item"),noticeDiv.data("lt_validity_notice"));	
							noticeDiv.data("lt_validity_info",info);
							noticeDiv.data("lt_validity_delay",null);
						}		
					}, 200);
					noticeDiv.data("lt_validity_delay",delay);	
				}
			}else{
				var s = evt.toElement || evt.relatedTarget;
				if (this.contains(s)) {
					return;
				}
				validOneValidityItem(validityItem);
				if(noticeDiv.data("lt_validity_info")){
					noticeDiv.data("lt_validity_info").close();
					noticeDiv.data("lt_validity_info",null);
				}
				window.clearTimeout(noticeDiv.data("lt_validity_delay"));
				noticeDiv.data("lt_validity_delay",null);
			}
		});
		if(element.attr("validity").indexOf("double")>=0){
			element.blur(function(){
				setTimeout(function(){
					var val=getElementValue(element,true);
					if(val==null||val==""){
						return;
					}
					if(noticeDiv.data("lt_validity_notice")!=null){
						return;
					}
					val=parseFloat(val);
					if(isNaN(val)){
						return;
					}
					var tf=LT.thousandsFormat(val);
					element.val(tf);
				});
			});		
		}
	}
	
	function getElementValue(element,validity){
		var valueElement=null;
		if(element.data){
			valueElement=element.data("valueElement");			
		}
		var value=null;
		if(valueElement){
			value=element.data("valueElement").val();
		}else{
			value=element.val();
		}
		var item=element.data("item");		
		if(item.type=="tree"){
			value=element.data("lt_tree_value");
		}else if(item.type=="checkArea"){
			var checks=element.find(".lt_form_checkbox");
			value="";
			for(var j=0;j<checks.length;j++){
				if($(checks[j]).attr("checked")=="checked"){
					value+=$(checks[j]).attr("key")+"|";
				}
			}
			if(value!=""){
				value=value.substring(0,value.length-1);
			}
		}else if(item.type=="radioArea"){
			var radios=element.find(".lt_form_radio");
			value="";
			for(var j=0;j<radios.length;j++){
				if($(radios[j]).attr("checked")=="checked"){
					value=$(radios[j]).attr("key");
					break;
				}
			}
		}else if(item.type=="valueTree"){
			value=element.data("lt_tree_value");
			value=value==null?null:value.value;
		}else if(item.type=="uploadFile"){
			if(validity&&element.data("lt_file_webPath")==null){
				value = element.val();
			}else{			
				value=element.data("lt_file_webPath");
			}
		}else if(item.validity&&item.validity.indexOf("double")>=0){
			if(value!=null){
				value=LT.replaceAll(value,",","");
			}
		}else if(item.type=="word"){
			value="";
		}else if(item.customValue){
			value=item.customValue(element);
		}
		return value;
	}
	
	function getAquireNotice(element){
		var item=element.data("item");
		var result=null;
		if(item.type=="uploadFile"&&element.val()!=null&&element.val()!=""){//选择了文件但未上传
			result=null;	
		}else{
			result = "该输入项不允许为空"; 
		}
		return result;
	}
	
	function specialValidity(element){
		var result=null;
		var item=element.data("item");
		if(item.type=="uploadFile"){
			if(element.val()!=null&&element.val()!=""&&element.data("lt_file_webPath")==null){//选择了文件但未上传
				result="该文件还未上传";
			}
		}
		return result;
	}
	
	function validOneValidityItem(validityItem){
		var element=validityItem.find("[validity]");
		var elementDiv=validityItem.find(".lt_form_item_elementDiv");
		var noticeDiv=validityItem.find(".lt_form_item_noticeDiv");
		var label=validityItem.find(".lt_form_item_label").html();
		var value=getElementValue(element,true);		
		var validities=element.attr("validity").split("|");
		var noticeMessage="";
		var noticeIndex=0;
		if(element.data("lt_validity_hasValid")&&value==element.data("lt_validity_preValue")){
			return noticeDiv.data("lt_validity_notice")==null;//已经校验过，且值未改变
		}else{
			element.data("lt_validity_hasValid",true).data("lt_validity_preValue",value);
		}
		var require=false;
		for(var i=0;i<validities.length;i++){
			var validity=validities[i];
			if(validity=="require"){
				require=true;
				if(value==null||value==""){
					var an=getAquireNotice(element);
					if(an!=null){
						noticeMessage+=++noticeIndex+"、"+getAquireNotice(element)+"</br>";
					}
				}
			}else if(validity.indexOf("string")>=0){
				var message=LT.Validity.checkString(value);
				if(message!=null){
					noticeMessage+=++noticeIndex+"、"+message+"</br>";
					continue;
				}
				var stringValue=value==null?"":value;
				if(validity.indexOf("string[")>=0&&(require||value!="")){
					var range=validity.replace("string[","").replace("]","").split(",");
					if(range[0]=="*"&&stringValue.length>range[1]){
						noticeMessage+=++noticeIndex+"、该值长度不能大于"+range[1]+"</br>";
					}else if(range[1]=="*"&&stringValue.length<range[0]){
						noticeMessage+=++noticeIndex+"、该值长度不能小于"+range[0]+"</br>";
					}else if(stringValue.length<range[0]||stringValue.length>range[1]){
						noticeMessage+=++noticeIndex+"、长度范围为"+range[0]+"到"+range[1]+"</br>";
					}
				}
			}else if(validity.indexOf("int")>=0&&(require||value!="")){
				var message=LT.Validity.checkInt(value);
				if(message!=null){
					noticeMessage+=++noticeIndex+"、"+message+"</br>";
					continue;
				}
				var intValue=parseInt(value);
				if(validity.indexOf("int[")>=0){
					var range=validity.replace("int[","").replace("]","").split(",");
					if((range[0]!="*"&&LT.Validity.checkInt(range[0]))||(range[1]!="*"&&LT.Validity.checkInt(range[1]))){
						LT.infomation({type:"error",content:validity+"不是合法的表达式",sticky:true,block:true});
						throw new Exception();
					}
					var msg=checkArea(range[0],range[1],intValue);
					if(msg!=null){					
						noticeMessage+=++noticeIndex+"、"+msg;
					}
				}
			}else if(validity.indexOf("long")>=0&&(require||value!="")){
				var message=LT.Validity.checkLong(value);
				if(message!=null){
					noticeMessage+=++noticeIndex+"、"+message+"</br>";
					continue;
				}
				var longValue=parseInt(value);
				if(validity.indexOf("long[")>=0){
					var range=validity.replace("long[","").replace("]","").split(",");
					if((range[0]!="*"&&LT.Validity.checkLong(range[0]))||(range[1]!="*"&&LT.Validity.checkLong(range[1]))){
						LT.infomation({type:"error",content:validity+"不是合法的表达式",sticky:true,block:true});
						throw new Exception();
					}
					var msg=checkArea(range[0],range[1],longValue);
					if(msg!=null){					
						noticeMessage+=++noticeIndex+"、"+msg;
					}
				}
			}else if(validity.indexOf("double")>=0&&(require||value!="")){
				var message=LT.Validity.checkDouble(value);
				if(message!=null){
					noticeMessage+=++noticeIndex+"、"+message+"</br>";
					continue;
				}
				var doubleValue=parseFloat(value);
				if(validity.indexOf("double[")>=0){
					var range=validity.replace("double[","").replace("]","").split(",");
					if((range[0]!="*"&&LT.Validity.checkDouble(range[0]))||(range[1]!="*"&&LT.Validity.checkDouble(range[1]))){
						LT.infomation({type:"error",content:validity+"不是合法的表达式",sticky:true,block:true});
						throw new Exception();
					}
					var msg=checkArea(range[0],range[1],doubleValue);
					if(msg!=null){					
						noticeMessage+=++noticeIndex+"、"+msg;
					}
				}
			}else if(validity.indexOf("date")>=0&&(require||value!="")){
				var item=element.data("item");
				var message=LT.Validity.checkDate(value,item.dateFormat,item.onlyLastDate);
				if(message!=null){
					noticeMessage+=++noticeIndex+"、"+message+"</br>";
					continue;
				}
				if(validity.indexOf("date[")>=0){
					var range=validity.replace("date[","").replace("]","").split(",");
					if((range[0]!="*"&&LT.Validity.checkDate(range[0],item.dateFormat))||(range[1]!="*"&&LT.Validity.checkDate(range[1],item.dateFormat))){
						LT.infomation({type:"error",content:validity+"不是合法的表达式",sticky:true,block:true});
						throw new Exception();
					}
					var msg=checkArea(range[0],range[1],value);
					if(msg!=null){					
						noticeMessage+=++noticeIndex+"、"+msg;
					}
				}
			}else if(validity.indexOf("fun:")==0){
				var fun=validity.substring(4);
				var msg=null;
				if(element.data("item").type=="uploadFile"){
					var flag=!!element.data("hiddenFile").data("uploaded");
					msg=window.eval(fun+"('"+value+"',"+flag+")");
					if(!flag&&msg){//未上传
						element.data("item").updateNotValidity=msg;
					}else{
						element.data("item").updateNotValidity=false;
					}
				}else{
					msg=window.eval(fun+"('"+value+"')");
				}
				if(msg!=null){					
					noticeMessage+=++noticeIndex+"、"+msg;
				}
			}
		}	
		var msg=specialValidity(element);
		if(msg!=null){
			noticeMessage+=++noticeIndex+"、"+msg+"</br>";
		}
		if(noticeMessage!=""){
			noticeDiv.data("lt_validity_notice",noticeMessage);
			noticeDiv.addClass("lt_form_noticeBorder");
		}else{
			noticeDiv.removeClass("lt_form_noticeBorder");
			noticeDiv.data("lt_validity_notice",null);
		}
		return noticeMessage=="";
	}
	
	function checkArea(from,to,value){
		var msg=null;
		if(from=="*"&&to=="*"){
			return null;
		}
		if(from=="*"){
			if(value>to){
				msg="该值不能大于"+to+"</br>";
			}
		}else if(to=="*"){
			if(value<from){
				msg="该值不能小于"+from+"</br>";
			}
		}else if(value<from||value>to){
			msg="请输入"+from+"到"+to+"的值</br>";
		}
		return msg;
	}
	
	function noticeElement(elementDiv,item,message){
		if(message==null){
			message="";
		}else{
			message="<font color='red'>"+message+"</font>";
		}
		if(item.title){ 			
			message=item.title+"</br>"+message;
		}
		return LT.infomation({title:item.noticeTitle||item.label,content:message,time:2000,sticky:false,animateTime:200},{element:elementDiv});
	}
	
}