/**
 * 创建于:2014-3-8<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 查询界面插件
 * @author chender
 * @version 1.0.0
 */
LT.QueryPage=new function(){	
	LT.requireJquery().requirePrimeUi().requireWidgets(
			[ "dropdown", "inputtext","calendar","dialog","button","growl","progressbar" ]).requireDataTable();
	LT.loadCss(LT.getBasePath()+"/common/workframe/liontech/queryPage/queryPage.css");
	var root=null;
	
	var windowWidth=null;
	
	var developMode=false;
	
	var pageItem=null;
	
	var tableId=null;
	
	var table=null;
	
	var properties=null;
	
	var queryProperties=null;
	
	var resultProperties=null;
	
	var itemsPerRow=null;
	
	var instance=this;
	
	var placeDialog=null;
	
	var params=null;
	
	var place=null;
	
	var placeMap=null;
	
	var placeMapRevert=null;
	
	var paramMap={};
	
	var parentMapping=null; //key是子的groupId,value是parent的groupId
	
	var parentParamsMapping={}; //key是parent的groupId,value是当前选中的父参数对象
	
	var dialogSelects=new Array();
	
	var propertyUnits=null;
	
	var queryMarginTop=0;//查询区域靠上边的像素
	
	var createPk=null;
	
	var paramJson=null;
	
	var editValueCheckMap={};//key是propertyId,value是property对象，因为jqgrid对传入的对象进行了clone，导致引用失效，所以只有自己维护
	
	var develop={};
	
	this.bindPage=function(rootId,pageItemId){
		root=$("#"+rootId);
		createPage(pageItemId);
		return instance;
	};
	
	this.setParam=function(param){
//		var cols=param.cols;//自定义列数
//		if(cols){
//			cols=parseInt(cols);
//			if(!isNaN(cols)&&cols>0){
//				itemsPerRow=cols;
//			}
//		}
//		return instance;
	};
	
	function initData(pageItemId){
		var result=LT.synPost("grantWebAction_getPageProperties.action",{pageItemId:pageItemId});//返回字段和页面名称
		properties=result.property;
		pageItem=result.pageItem;
		itemsPerRow=pageItem.colNumbers;
		createPk=result.createPk;
		table=result.table;
		tableId=table.tableId;
		developMode=result.developMode;
		document.title=pageItem.pageName;
		queryProperties=new Array();
		resultProperties=new Array();
		var paramLinkString="";
		var hasPlace=false;
		for(var i=0;i<properties.length;i++){
			if(properties[i].isCondition){
				var qp=$.extend(true, {}, properties[i].propertyEntity);
				qp.eqType=properties[i].eqType;
				queryProperties.push(qp);
			}
			if(properties[i].isResult){
				var rp=$.extend(true, {}, properties[i].propertyEntity);
				rp.colSize=properties[i].colSize;
				rp.formula=properties[i].formula;
				resultProperties.push(rp);
			}
			var paramLink=properties[i].propertyEntity.paramLink;
			if(paramLink!=null&&paramLink!=""){
				paramLinkString+=paramLink+"|";
			}
			if(properties[i].propertyEntity.specialTag=="place"){
				hasPlace=true;
			}
		}
		if(paramLinkString!=null){//将所欲需要的参数一次性加载到前端
			paramLinkString=paramLinkString.substring(0, paramLinkString.length-1);
			var result=LT.synPost("grantWebAction_getParams.action", {paramGroupIds:paramLinkString});
			parentMapping=result.parentMapping;
			params=result.params;
			for(var key in params){	
				var temp=params[key];		
				for(var i=0;i<temp.length;i++){
					parseParam(temp[i]);
				}
			}
		}
		if(hasPlace){
			place=LT.synPost("grantWebAction_getPlace.action", {jiguanCode:100000});//100000为中国的籍贯号
			placeMap={};
			placeMapRevert={}
			parsePlace(place);			
			createPlaceDialog();
		}
		
		function parsePlace(place){
			placeMap[place.jiguanCode]=place;
			placeMapRevert[place.fullName+"("+place.jiguanCode+")"]=place;
			var children=place.children;
			if(children!=null&&children.length>0){
				for(var i=0;i<children.length;i++){
					parsePlace(children[i]);
				}
			}
		}
		
		function parseParam(param){
			var group=paramMap[param.groupId];
			if(group==null){
				group=paramMap[param.groupId]={};
			}
			group[param.paramKey]=param;
			var children=param.children;
			if(children!=null&&children.length>0){
				for(var i=0;i<children.length;i++){
					parseParam(children[i]);
				}
			}
		}
	}
	
	function createPage(pageItemId){
		var start=new Date();
		windowWidth=$(document.body).width()
		initData(pageItemId);
		createQueryArea();
		createTable();
		justifyInitSize();
		var end=new Date();
//		alert(end.getTime()-start.getTime())
		return instance;
	};
	
	function justifyInitSize(){		
		var pro=LT.startProgress({message:"正在调整页面布局..."});
		setTimeout(function(){//必须异步获取才能取到真实的高度，因为当前渲染界面的线程还没执行完
			$("#resultTable").setGridHeight($(document.body).height()-queryMarginTop-$("#lt-queryRoot").height()-77,true);
			$("#resultTable").setGridWidth($(document.body).width()-5);
			pro.stopProgress(true);
		}, 600);
		
		var queryItems=$(".queryItem");
		for(var i=0;i<queryItems.length;i++){
			var conditionName=$(queryItems[i]).find(".lt-conditionName");
			var inputDiv=$(queryItems[i]).find(".inputDiv");
			inputDiv.css("margin-top",(conditionName.height()-18)/3);
			$(queryItems[i]).find(">img").css("margin-top",(conditionName.height()-18)/2);
		}
		
		$(document.body).resize(function(){
			$("#resultTable").setGridHeight($(document.body).height()-queryMarginTop-$("#lt-queryRoot").height()-77);
			$("#resultTable").setGridWidth($(document.body).width());
		});
	}
	
	function justifySize(){
		$("#resultTable").setGridHeight($(document.body).height()-queryMarginTop-$("#lt-queryRoot").height()-77,true);
		$("#resultTable").setGridWidth($(document.body).width());
	}
	
	function createTable(){
		var tableArea=$("<div class='tableArea'></div>").appendTo(root);
		var tableElement=$("<table id='resultTable'></table>").appendTo(tableArea);
		$("<div id='resultTableFoot'></div>").appendTo(tableArea);
		var colNames=new Array();
		var colModel=new Array();
		var shrinkToFit=false;
		var fix=0;
		var cols=3;
		var width=0;
		var allWidth=0;
		for(var i=0;i<resultProperties.length;i++){
			var property=resultProperties[i];		
			width=property.colSize;
			allWidth+=width;
			var formoptions={colpos:(i-fix)%cols+1,rowpos:parseInt((i-fix)/cols)+1};
			var formatoptions={};
			var editrules={};
			var editoptions={};
			var colMod={
					name:"propertyId_"+property.propertyId,
					index:"entity.propertyId_"+property.propertyId,
					key:false,
					editable:true,
					width:width,
					sortable:false,
					hidden:(i==0&&createPk),        //如果是手动创建的主键，就隐藏
					formoptions : formoptions,
					formatoptions:formatoptions,
					editrules : editrules,
					editoptions:editoptions,
					propertyId:property.propertyId,
					paramLink:property.paramLink
				};
			
			if(property.shortName==table.pk){		//主键 设置为不可编辑 如果是手动创建的，也不显示
				colMod.key=true;
				colMod.index="operedRecordId";
				colMod.editable=false;
				if(createPk){
					colMod.hidden=true;
				}
				formoptions.colpos=1;
				formoptions.rowpos=(resultProperties.length-1)/cols+2;
				fix++;
			}else{
				colMod.edittype="custom";//为了好控制，所有的元素都自定义
				editoptions.custom_element=customElement;
				editoptions.custom_value=customValue;
			}
			
			if(property.specialTag=="money"){
				colMod.formatter="currency";
				formatoptions.suffix="元";
				formatoptions.decimalPlaces=property.afterDot;
			}else if(property.type=="int"){
				colMod.formatter="integer";
			}else if(property.type=="double"||property.type=="float"){
				colMod.formatter="number";
				formatoptions.decimalPlaces=property.afterDot;
			}else if(property.specialTag=="place"){
				colMod.formatter=function(cellvalue,options,rowObject){
					var place=placeMap[cellvalue];
					if(place){
						return place.fullName+"("+place.jiguanCode+")";
					}else{//不合法的籍贯号
						return "<div style='color:red' title='该值不合法'>"+cellvalue+"</div>"
					}			
				};
				colMod.unformat=function(cellvalue,options,rowObj){
					var place=placeMapRevert[cellvalue]
					if(place){
						return place.jiguanCode;
					}else{
						return cellValue;
					}
				};
			}else if(property.paramLink!=null&&property.paramLink!=""){
				colMod.formatter=function(cellvalue,options,rowObject){
					console.log(options.colModel.paramLink)
					console.log(paramMap[options.colModel.paramLink]);
					var param=paramMap[options.colModel.paramLink][cellvalue];
					if(param){
						return param.paramValue;
					}else{//不合法的参数值
						if(cellvalue!=null){
						return "<a style='color:red' title='该值不合法'>"+cellvalue+"</a>"
						}else{
							return "";
						}
					}			
				};
			}else if(property.type=="boolean"){
				colMod.formatter=function(cellvalue,options,rowObject){
					return cellvalue==true?"是":"否";
				}
				colMod.unformat=function(cellvalue,options,rowObj){
					return cellvalue=="是";
				};
			}
			formatoptions.propertyId=property.propertyId;
			editrules.custom=true;
			editrules.propertyId=property.propertyId;
			editValueCheckMap[property.propertyId]=property;
			editrules.custom_func=customCheck;
		
			if(property.notNull){
				formoptions.elmsuffix=" *";
				editrules.required=(createPk&&i==0)?false:true;
			};
			
			editoptions.propertyId=property.propertyId;
			var pn=property.propertyName;
			if(property.unit){
				pn+="("+property.unit+")";
			}
			colNames.push(pn);
			colModel.push(colMod);
		}
		if(allWidth<$(document.body).width()-20){
			shrinkToFit=true;
		}
		
		function customElement(value,options,parent){
			var property=editValueCheckMap[options.propertyId];
			var input=null;
			if(property.specialTag=="date"){//日期
				input=$("<input></input>").appendTo(parent);
				getDateInput(input,property,parent);
			}else if(property.paramLink!=null&&property.paramLink!=""){//参数
				 input=$("<select style='width:147px'></select>").attr("dialog_paramGroupId",property.paramLink).appendTo(parent);
				 getParamSelect(input,property,"editSelectParam");
				 dialogSelects.push(input);
			}else if(property.specialTag=="place"){//地址
				input=$("<input></input>").appendTo(parent);
				getPlaceInput(input,property,parent);
			}else if(property.type=="boolean"){
				input=$("<select style='width:147px'></select>").appendTo(parent);
				getBooleanSelect(input,property,parent);
			}else if(property.specialTag=="identify"){
				input=$("<input></input>").appendTo(parent);
				getIdentifyInput(input,property,parent);
			}else if(property.type=="String"){
				input=$("<input></input>").appendTo(parent);
				getStringInput(input,property,parent);
			}else{//数字
				input=$("<input></input>").appendTo(parent);
				getNumberInput(input,property,parent);
			}
			property.lt_focus=function(){
				input.forcus();
			};
			property.lt_setValue(value);
			input.data("propertyData",property);
			return input;
		}
		
		function customValue(ele,oper,value){
			if(oper=="set"){
			}else if(oper=="get"){
				var val= ele.data("propertyData").lt_getValue();
				val=typeof(val) == "undefined"?"":val;
				return val;
			}
		}
		
		function customCheck(value,name,editRule){
			var property=editValueCheckMap[editRule.propertyId];
			var checkResult=null;
			if(property.lt_checkValue){
				checkResult=property.lt_checkValue(value);
			}
			if(checkResult!=null){
				return [false,"字段【"+name+"】 ："+checkResult];
			}
			return [true,""];
		}
		
		var prmNames = {
				page : "curPage", // 表示请求页码的参数名称
				rows : "recordPerPage", // 表示请求行数的参数名称
//				sort : "propertyId", // 表示用于排序的列名的参数名称
				order : "sord", // 表示采用的排序方式的参数名称
				search : "_search", // 表示是否是搜索请求的参数名称
				nd : "nd", // 表示已经发送请求的次数的参数名称
				id : "operedRecordId", // 表示当在编辑数据模块中发送数据时，使用的id的名称
				oper : "oper", // operation参数名称（我暂时还没用到）
				editoper : "edit", // 当在edit模式中提交数据时，操作的名称
				addoper : "add", // 当在add模式中提交数据时，操作的名称
				deloper : "del", // 当在delete模式中提交数据时，操作的名称
				subgridid : "propertyId", // 当点击以载入数据到子表时，传递的数据名称
				npage : null,
				totalrows : "totalrows" // 表示需从Server得到总共多少行数据的参数名称，参见jqGrid选项中的rowTotal
			};
			var jsonReader = {
				root : "data", // json中代表实际模型数据的入口
				page : "curPage", // json中代表当前页码的数据
				total : "pageNumbers", // json中代表页码总数的数据
				records : "recordNumbers", // json中代表数据行总数的数据
				repeatitems : false, // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。
				cell : "cell",
//				id : "propertyId",
				userdata : "userdata"
			};
			var editOptions = { // edit options
					editCaption : "编辑记录",
					url : "grantWebAction_editRecord.action?tableId="+tableId,
					jqModal : true, 
					modal : true,
					resize:false,
					closeOnEscape : true,
					closeAfterEdit : true,
					viewPagerButtons:false,
					reloadAfterSubmit : true,
					recreateForm : true,
					bottominfo : "<div class='bottominfo-div'>有*号的为必填项  </div>",
					onclickSubmit : function(rp_ge, postdata) {
						
					},
					beforeShowForm : function(form) {
						var dialog=$("#editmodresultTable");
						dialog.css("width",850);
						var top=($(document.body).height()-dialog.height())/2;
						var left=($(document.body).width()-dialog.width())/2;
						dialog.css({top:top,left:left});
					},
					onClose: function(){
						 LT.removeListener("editSelectParam");
						 parentParamsMapping={};
						 for(var i=0;i<dialogSelects.length;i++){
							 dialogSelects[i].puidropdown("removePanel");					
						 }
						 dialogSelects=new Array();
					},
					beforeSubmit : function(formData, formId) {
						
						return[true,""];
					}
				};
			
			   var viewOptions={
					recreateForm : true,
					beforeShowForm : function(form) {
						var dialog=$("#viewmodresultTable");
						dialog.css("width",850);
						var top=($(document.body).height()-dialog.height())/2;
						var left=($(document.body).width()-dialog.width())/2;
						dialog.css({top:top,left:left});
					}  
			   };

				var addOptions = { // edit options
					addCaption : "新增记录",
					url : "grantWebAction_addRecord.action?tableId="+tableId,
					jqModal : true, // 改为false的话会有重大问题
					modal : true,
					resize:false,
					closeOnEscape : true,
					closeAfterAdd : true,
					reloadAfterSubmit : true,
					recreateForm : true,
					bottominfo : "<div class='test'>有*号的为必填项  </div>",
					onclickSubmit : function(rp_ge, postdata) {

					},
					onClose: function(){
						 LT.removeListener("editSelectParam");
						 parentParamsMapping={};
						 for(var i=0;i<dialogSelects.length;i++){
							 dialogSelects[i].puidropdown("removePanel");					
						 }
						 dialogSelects=new Array();
					},
					beforeShowForm : function(form) {
						var dialog=$("#editmodresultTable");
						dialog.css("width",850);
						var top=($(document.body).height()-dialog.height())/2;
						var left=($(document.body).width()-dialog.width())/2;
						dialog.css({top:top,left:left});	
					},
					beforeSubmit : function(formData, formId) {

						return [ true, "" ];
					}

				};

				var delOptions = { // del options
					left : 450,
					top : 200,
					resize : false,
					delCaption : "删除数据",
					url : "grantWebAction_deleteRecord.action?tableId="+tableId,
					msg : "确认删除该条记录吗?",
					jqModal : true, // 改为false的话会有重大问题
					// gridModel:false,
					modal : true,
					closeOnEscape : true,
					reloadAfterSubmit : true,
					recreateForm : true,
					beforeShowForm : function(form) {
						var dialog=$("#delmodresultTable");
						dialog.css("width",220);
						var top=($(document.body).height()-dialog.height())/2;
						var left=($(document.body).width()-dialog.width())/2;
						dialog.css({top:top,left:left});	
					},
					beforeSubmit : function(formData, formId) {
						return [ true, "" ];
					}

				};

		$.jgrid.ajaxOptions.type = 'post';
		var pro=null;
		tableElement.jqGrid({
			data : [],
			datatype : "local",
			height : 0,
			width : $(document.body).width()+10,
			pgbuttons : true,
			pginput : true,
			viewrecords: true,
			forceFit : false,
			shrinkToFit:shrinkToFit,
			altRows : true,
			altclass : "altCss",
			hiddengrid:false,
			hidegrid:false,
			loadui:"disable",
			emptyrecords:"没有满足条件的查询结果",
			rowNum : 50,
			rowList : [20,30,40,50,100],
			colNames : colNames,
			colModel : colModel,
			pager : "#resultTableFoot",
			prmNames : prmNames,
			jsonReader : jsonReader,
			serializeGridData:function(postData){
				if(postData==null){
					psotData={};
				}
				postData.paramJson=paramJson;
				postData.pageItemId=pageItem.pageItemId;
				postData.sourceTable=pageItem.sourceTable;
				return postData;
			},
			ondblClickRow:function(){
				var gr = tableElement.jqGrid(
						'getGridParam', 'selrow');
				if (gr != null) {
					tableElement.jqGrid('viewGridRow', gr, viewOptions);
			 }
			},
			beforeRequest:function(){
				pro=LT.startProgress({message:"正在请求数据"});
			},
			loadComplete:function(){
				pro.stopProgress();
			},
			resizeStop:function(){
				$("#saveColSizeButton").find("a").html("<a>*保存列宽</a>");
				develop.saveColSize=true;
			},
			caption : table.tableName
		});
		var opt={add:false,del:false,edit:false,search:false,refreshtext:"刷新"};
		if(pageItem.sourceTable){
			opt={search:false,addtext:"新增",deltext:"删除",edittext:"编辑",refreshtext:"刷新"};
		}
		tableElement.jqGrid('navGrid', "#resultTableFoot",opt,
				editOptions,
				addOptions,
				delOptions
			);
		if(developMode){//开发模式
			tableElement.jqGrid('navButtonAdd', "#resultTableFoot", {
				caption : "<a>保存列宽</a>",
				buttonicon : "ui-icon-wrench",
				onClickButton : function(){
					saveColSizes();
				},
				position : "",
				title : "将列宽保存到数据库",
				cursor : "",
				id : "saveColSizeButton"
			});
		}
	}
	
	function saveColSizes(){
		if(!develop.saveColSize){
			LT.infomation({content:"列宽没有改变,无需保存"}, {location:"center"});
			return;
		}
		var colSizes=new Array();
		for(var i=0;i<resultProperties.length;i++){
			var pro=resultProperties[i];
			if(createPk&&pro.shortName==table.pk){//手动创建的列
				continue;
			}
			var colSize=$("#jqgh_resultTable_propertyId_"+pro.propertyId).width();
			colSizes.push({propertyId:pro.propertyId,colSize:colSize});
		}
		var paramJson=JSON.stringify({pageId:pageItem.pageItemId,colSizes:colSizes});
		var pro=LT.startProgress({message:"正在修改列宽"});
		LT.asynPost("tableManageAction_updateColSizes.action", {paramJson:paramJson}, function(result){
			if(result=="success"){
				$("#saveColSizeButton").find("a").html("<a>保存列宽</a>");
				develop.saveColSize=false;
				pro.stopProgress(true);
				LT.infomation({content:"操作成功"}, {location:"center"});
			}else{
				LT.infomation({type:"error",content:"result"}, {location:"center"});
			}
		});
	}
	
	function saveEqTypes(){
		if(!develop.saveEqType){
			LT.infomation({content:"条件匹配类型未改变，无需保存"}, {location:"center"});
			return;
		}
		var eqTypes=new Array();
		for(var i=0;i<queryProperties.length;i++){
			var pro=queryProperties[i];
			eqTypes.push({propertyId:pro.propertyId,eqType:pro.eqType});
		}
		var paramJson=JSON.stringify({pageId:pageItem.pageItemId,eqTypes:eqTypes});
		var pro=LT.startProgress({message:"正在修改匹配类型"});
		LT.asynPost("tableManageAction_updateEqTypes.action", {paramJson:paramJson}, function(result){
			if(result=="success"){
				pro.stopProgress(true);
				LT.infomation({content:"操作成功"}, {location:"center"});
				develop.saveEqType=false;
			}else{
				LT.infomation({type:"error",content:"result"}, {location:"center"});
			}
		});
	}
	
	function changeColNumber(){
		var number=null;
		var notice="请输入每行的条件数";
		while(true){
			number=window.prompt(notice,pageItem.colNumbers);
			if(number==null){
				return;
			}
			number=parseInt(number);
			if(isNaN(number)||number<1||number>8){
				notice="每行的条件数必须是一个1到8的整数";
				continue;
			}
			if(number==pageItem.colNumbers){
				notice="你输入的值和之前的值一样";
				continue;
			}
			break;
		}
		var paramJson=JSON.stringify({pageId:pageItem.pageItemId,colNumber:number});
		var pro=LT.startProgress({message:"正在修改列数"});
		LT.asynPost("tableManageAction_changeColNumber.action", {paramJson:paramJson}, function(result){
			if(result=="success"){
				LT.infomation({content:"操作成功"}, {location:"center"});
				pro.changeMessage("开始刷新界面");
				LT.reload();
			}else{
				LT.infomation({type:"error",content:"result"}, {location:"center"});
			}
		});
	}
	
	function createQueryArea(){
		propertyUnits=new Array();
		var queryRoot=$("<div></div>").addClass("lt-queryRoot").attr("id","lt-queryRoot").appendTo(root);
		var qa=$("<div></div>").addClass("lt-queryArea").attr("id","lt-queryArea").appendTo(queryRoot);
		var queryTable=$("<table></table>").addClass("lt-queryTable")
		.css("min-width",320*itemsPerRow).css("overflow","auto").appendTo(qa);	
		var index=0;
		var tr=null;
		for(var i=0;i<queryProperties.length;i++){
			if(--index<=0){
				tr=$("<tr></tr>").appendTo(queryTable);
				index=itemsPerRow;
			}
				var td=$("<td></td>").addClass("lt-conditionTd").appendTo(tr);
				createByProperty(td,queryProperties[i],windowWidth);
		}
		var bottomDiv=$("<div></div>").css("height",15).appendTo(queryRoot);
		var updown=$("<img></img>").attr("src","develop/img/tableUp.png").addClass("tableUpDown").appendTo(bottomDiv);
		updown.click(function(){
			if(updown.attr("src").indexOf("tableUp.png")>=0){
				updown.attr("src",updown.attr("src").replace("tableUp.png","tableDown.png"));
				queryRoot.animate({marginTop:-queryRoot.height()+15});
				qa.animate({opacity:0.1});
				queryMarginTop=-queryRoot.height()+15;
				justifySize();				
			}else{
				updown.attr("src",updown.attr("src").replace("tableDown.png","tableUp.png"));			
				queryRoot.animate({marginTop:0,opacity:1});
				queryMarginTop=0;
				justifySize();
				qa.animate({opacity:1});
			}
		});
		
		if(developMode){
			var saveEq=$("<img></img>").attr("src","develop/img/saveEq.png").addClass("saveEq")
			.attr("title","保存条件匹配类型").appendTo(bottomDiv);
			saveEq.click(function(){
				saveEqTypes();
			});
			var changeColNum=$("<img></img>").attr("src","develop/img/changeColNumber.png").addClass("changeColNumber")
			.attr("title","修改每行所包含的查询条件个数").appendTo(bottomDiv);
			changeColNum.click(function(){
				changeColNumber();
			});
		}
		
		createToolbar();
	}
	

	function createByProperty(parent,property){
		var unit = $("<div class='queryItem'></div>").attr("id","queryItem_"+property.propertyId)
		.css("text-align","center").appendTo(parent);
		var proName=$("<div></div>").html(property.propertyName).addClass("lt-conditionName").appendTo(unit);
		var inputDiv=$("<div class='inputDiv'></div>").appendTo(unit);
		var input=createInputByProperty(inputDiv,property);
		var width=(windowWidth/itemsPerRow-50)*0.72;
		var labelWidth=(windowWidth/itemsPerRow-50)*0.28;
		width=width<160?160:width;
		input.css("width",width);
		proName.css("width",labelWidth);
		property.lt_focus=function(){//默认的获取焦点的方法
			input.focus();
		};
		if(!property.eqType){
			property.eqType="eq";//默认都是eq类型
		}
		createEqualType(unit,input,property);
		unit.data("property",property);
		propertyUnits.push(unit);
		var copyDiv=null;
		var to=null;
		property.equalTypeChange=function(type){
			if(type=="between"&&copyDiv==null){//复制
				if(property.elementType!="input"){
					return false;
				}
				if(property.specialTag=="place"){
					return false;
				}
				property.copyProperty=$.extend(true, {}, property);
				var width=(input.width()-25)/2;
				copyDiv=$("<div class='inputDiv'></div>").css("margin-top",inputDiv.css("margin-top")).appendTo(unit);
				var copyInput=createInputByProperty(copyDiv,property.copyProperty);
				input.width(width);
				copyInput.width(width);
				inputDiv.after(copyDiv);
				to=$("<a style='margin-left:3px;float:left'>-</a>").css("margin-top",parseInt(inputDiv.css("margin-top").replace("px",""))+4);
				inputDiv.after(to);
			}else if(copyDiv!=null){
				input.width(input.width()*2+24);
				to.remove();
				copyDiv.remove();
				copyDiv=null;
				property.copyProperty=null;
			}
			return true;
		};
		if(property.eqType=="between"){
			property.equalTypeChange("between");
		}
	}
	
	function resetQuery(){
		for(var i=0;i<propertyUnits.length;i++){
			var property=propertyUnits[i].data("property");
			property.lt_setValue("");
			if(property.copyProperty){
				property.copyProperty.lt_setValue("");
			}
		}		
	}
	function excuteQuery(){
		var condition=new Array();
		for(var i=0;i<propertyUnits.length;i++){
			var property=propertyUnits[i].data("property");
			if(property.eqType=="isnull"||property.eqType=="notnull"){
				condition.push({propertyId:property.propertyId,value:null,secondValue:null,eqType:property.eqType});
				continue;
			}
			var value=property.lt_getValue();
			if(property.lt_checkValue&&value!=null&&value!=""){
			    var checkResult=property.lt_checkValue();
			    if(checkResult!=null){
			    	LT.infomation({type:"提示",title:"输入不合法",content:checkResult},{element:propertyUnits[i],location:"down"});
			    	property.lt_focus();
			    	return;
			    }
			}
			var copyValue=null;
			var copyProperty=property.copyProperty;
			if(copyProperty){
				copyValue=copyProperty.lt_getValue();
				if(copyProperty.lt_checkValue&&copyValue!=null&&copyValue!=""){
				    var checkResult=copyProperty.lt_checkValue();
				    if(checkResult!=null){
				    	LT.infomation({type:"提示",title:"输入不合法",content:checkResult},{element:propertyUnits[i],location:"down"});
				    	copyProperty.lt_focus();
				    	return;
				    }
				}
			}
			if((value!=null&&value!="")||(copyValue!=null&&copyValue!="")){
				condition.push({propertyId:property.propertyId,value:value,secondValue:copyValue,eqType:property.eqType});
			}
		}
		var result=new Array();
		for(var i=0;i<resultProperties.length;i++){
			result.push({propertyId:resultProperties[i].propertyId});
		}
		 paramJson=JSON.stringify({condition:condition,result:result});
		 $("#resultTable").jqGrid("setGridParam",
					{
						datatype : 'json',
						url : "grantWebAction_asynPagingDataNoPackage.action"
					});
		 $("#resultTable").trigger("reloadGrid");			 
	}
	
	
	function importData(callback){
		var pro=null;
		LT.fileUpload.upload({
			url:"grantWebAction_importData.action",
			data:{tableId:tableId},
			fileId:"importFile_input",
			dataType:"json",
			start:function(){
				pro=LT.startProgress({message:"正在导入数据"});
			},
			finish:function(data){
				pro.stopProgress(true);
				if(data=="success"){
					LT.infomation({content:"导入完毕"},{location:"center"});
				}else{
					LT.infomation({type:"error",content:"导入失败:"+data},{location:"center"});
				}		
				callback();
			}
		});	
	
	}
	
	function exportData(){
		var records=$("#resultTable").jqGrid("getGridParam","records");
		if(records==0){
			LT.infomation({content:"无查询结果,无法进行导出 "},{location:"center"});
			return;
		}
		LT.changeUrl("grantWebAction_exportData.action");
	}
	
	function createToolbar(){
		var div=$("<div class='toolbarDiv'></div>").appendTo(document.body);
		var innderDiv=$("<div class='toolbarInnerDiv'></div>").appendTo(div);
		var resetImage=$("<img class='resetButton imgButton' src='develop/img/reset.png'></img>").click(resetQuery).appendTo(innderDiv);
		var queryImage=$("<img class='queryButton imgButton' src='develop/img/query.png'></img>").click(excuteQuery).appendTo(div);
		var importImage=$("<img class='importButton imgButton' src='develop/img/import.png'></img>").appendTo(innderDiv);
		var exportImage=$("<img class='exportButton imgButton' src='develop/img/export.png'></img>").click(exportData).appendTo(innderDiv);
		if(pageItem.sourceTable){			
			createImportButton();
		}
		if(!pageItem.sourceTable){
			importImage.removeClass("imgButton").addClass("imgButtonDisabled");
			importImage.unbind("click").click(function(){
				LT.infomation({content:"页面["+pageItem.pageName+"]为自定义界面，无法进行导入操作",time:2500}, {element:importImage});
			});
		}
		div.draggable({scroll:false});
		div.css("position","absolute")
		div.mouseover(function(){
			if(div.data("isShow")){
				return;
			}
			div.stop();
			div.animate({height:122,width:122},"fast");
			innderDiv.css("display","block");
			div.data("isShow",true);
		});
		div.mouseout(function(){
			var s = event.toElement || event.relatedTarget;
	         if (!this.contains(s)) { 
	        	 div.stop();
	        	 div.animate({height:60,width:60},"fast",function(){
	        		 innderDiv.css("display","none");
	        	 });
	        	 div.data("isShow",false);
	        	}	
		});
		
		function createImportButton(){
			fileInput=$("<input type='file'  class='importButton' name='dataFile'></input>").attr("id","importFile_input")
			.css("opacity","0").appendTo(innderDiv).mouseover(function(){
				importImage.removeClass("imgButton").addClass("imgButton_hover");
			}).mouseout(function(){
				importImage.removeClass("imgButton_hover").addClass("imgButton");
			}).change(function(){
				importData(function(){
					$("#importFile_input").remove();
					createImportButton();
					div.mouseout();
				});
			});
		}
		
	}
	
	function createInputByProperty(parent,property){
		var input=null;
		if(property.specialTag=="date"){//日期类型		
			input=$("<input class='lt-conditionInput'></input>").appendTo(parent);
			getDateInput(input,property,parent);
			property.elementType="input";
		}else if(property.specialTag=="identify"){//身份证
			input=$("<input class='lt-conditionInput'></input>")
			.appendTo(parent);
			getIdentifyInput(input,property,parent);
			property.elementType="input";
		}else if(property.paramLink!=null&&property.paramLink!=""){//参数
			var width=(windowWidth/itemsPerRow-50)*0.72+10;
			width=width<170?170:width;
			input=$("<select style='width:"+width+"px;'></select>").appendTo(parent);
			getParamSelect(input,property,"querySelectParam");
			property.elementType="select";
		}else if(property.specialTag=="place"){//地放
			input=$("<input class='lt-conditionInput'></input>").attr("jiguancode","").appendTo(parent);
			getPlaceInput(input,property,parent);
			property.elementType="input";
		}else if(property.type=="String"){//字符串
			input=$("<input class='lt-conditionInput'></input>").appendTo(parent);
			getStringInput(input,property,parent);
			property.elementType="input";
		}else if(property.type=="boolean"){
			var width=(windowWidth/itemsPerRow-50)*0.72+10;
			width=width<170?170:width;
			input=$("<select style='width:"+width+"px;'></select>").appendTo(parent);
			getBooleanSelect(input,property,parent);
			property.elementType="select";
		}
		else{//数字
			input=$("<input class='lt-conditionInput'></input>").appendTo(parent);
			getNumberInput(input,property,parent);
			property.elementType="input";
		}
		return input;
	}
	
	function createEqualType(parent,input,property){
		var eq= $("<img class='equalTypeImg'></img>").attr("src","develop/img/eqType/"+property.eqType+".png").appendTo(parent);
		if(document.getElementById("equalSelectDiv")==null){
			var div=$("<div id='equalSelectDiv'></div>").css("display","none").appendTo($(document.body));
			var ul=$("<ul></ul>").appendTo(div);
			var types=["等于","相似","大于","小于","为空","不等于","不为空","大于等于","小于等于","在..之间"];
			var temp=["eq","like","gt","lt","isnull","neq","notnull","egt","elt","between"];
			for(var i=0;i<types.length;i++){
				var li=$("<li></li>").html(types[i]).appendTo(ul).attr("tag",temp[i]);
				li.click(function(){
					if($("#equalSelectDiv").data("property").equalTypeChange){
						var result=$("#equalSelectDiv").data("property").equalTypeChange.call("",$(this).attr("tag"));
						if(!result){
							$("#equalSelectDiv").stop();
							$("#equalSelectDiv").hide("fast");
							LT.infomation({content:"该字段不支持类型为["+$(this).html()+"]的查询"},
									{location:"center"});
							return;
						}
					}
					$("#equalSelectDiv").data("element").attr("src","develop/img/eqType/"+$(this).attr("tag")+".png");
					$("#equalSelectDiv").data("element").attr("tag",$(this).attr("tag")).attr("title",$(this).html());
					$("#equalSelectDiv").data("property").eqType=$(this).attr("tag");
					$("#equalSelectDiv").stop();
					$("#equalSelectDiv").hide("fast");
					develop.saveEqType=true;
				});
			}
			div.mouseout(function(){
				 var s = event.toElement || event.relatedTarget;
		         if (!this.contains(s)) { 
		         	 div.data("shouldShow",false);
		        	 setTimeout(function(){
		        		 if($("#equalSelectDiv").data("shouldShow")){
			 					return;
			 				}
		 				 $("#equalSelectDiv").stop();
			        	 $("#equalSelectDiv").hide("fast");
		 			}, 500);
		        	}
			});
			div.mouseover(function(){
				div.data("shouldShow",true);
			});
		}
		eq.mouseover(function(){	
			if($("#equalSelectDiv").data("shouldShow")){
				return;
			}
			$("#equalSelectDiv").data("shouldShow",true);
			 setTimeout(function(){
        		 if($("#equalSelectDiv").data("shouldShow")){
        			 var pos=eq.offset();
        			 var left=pos.left+eq.width();
        			 var top=pos.top+eq.height();
        			 if(left+$("#equalSelectDiv").width()>$(document.body).width()-5){
        				 left=$(document.body).width()-$("#equalSelectDiv").width()-5;
        			 }
        				$("#equalSelectDiv").css({left:left,top:top});
        				$("#equalSelectDiv").show("fast");
        				$("#equalSelectDiv").data("element",eq);
        				$("#equalSelectDiv").data("property",property);
        				$("#equalSelectDiv").find(".equalSelected").removeClass("equalSelected");
        				$("#equalSelectDiv").find("li[tag='"+property.eqType+"']").addClass("equalSelected");
	 				}
 			}, 300);
		}).mouseout(function(evt){
			$("#equalSelectDiv").data("shouldShow",false);
			setTimeout(function(){
				if($("#equalSelectDiv").data("shouldShow")){
					return;
				}
				$("#equalSelectDiv").stop();
				$("#equalSelectDiv").hide("fast");
			}, 500);
		});
		
		return eq;
	}
	
	function createPlaceDialog(){
		placeDialog=$("<div id='dialogDiv'></div>").attr("title","请选择籍贯信息").css("position","absolute")
		.appendTo($(document.body));
		var first=$("<select style='width:150px;'></select>").appendTo(placeDialog);
		var second=$("<select style='width:150px;'></select>").appendTo(placeDialog);
		var third=$("<select style='width:150px;'></select>").appendTo(placeDialog);
		var firstMap=new Object();
		var secondMap=new Object();
		var thirdMap=new Object();
		for(var i=0;i<place.children.length;i++){
			place.children[i].paramKey=place.children[i].jiguanCode;
			place.children[i].paramValue=place.children[i].placeName;
			firstMap[place.children[i].paramKey]=place.children[i];
		}
		first.puidropdown({
			data:place.children,
			header:"--请选择--",
			scrollHeight:200,
			content:function(one){
				return one.paramValue;
			},
			change:function(){
				secondMap=new Object();
				var cur=firstMap[first.val()];
				if(!cur){
					second.puidropdown("refresh",[]);
					return;
				}
				for(var i=0;i<cur.children.length;i++){
					cur.children[i].paramKey=cur.children[i].jiguanCode;
					cur.children[i].paramValue=cur.children[i].placeName;
					secondMap[cur.children[i].paramKey]=cur.children[i];
				}
				second.puidropdown("refresh",cur.children);
			}
		});
		second.puidropdown({
			data:[],
			header:"--请选择--",
			scrollHeight:200,
			content:function(one){
				return one.paramValue;
			},
			change:function(){
				thirdMap=new Object();
				var cur=secondMap[second.val()];
				if(!cur){
					third.puidropdown("refresh",[]);
					return;
				}
				for(var i=0;i<cur.children.length;i++){
					cur.children[i].paramKey=cur.children[i].jiguanCode;
					cur.children[i].paramValue=cur.children[i].placeName;
					thirdMap[cur.children[i].paramKey]=cur.children[i];
				}
				third.puidropdown("refresh",cur.children);
			}
		});
		third.puidropdown({
			data:[],
			header:"--请选择--",
			scrollHeight:200,
			content:function(one){
				return one.paramValue;
			}
		});
		placeDialog.puidialog({  
	        showEffect: 'fade',  
	        hideEffect: 'fade',  
	        minimizable: false,  
	        maximizable: false,  
	        resizable:false,
	        width:500,
	        modal: true,  
	        buttons: [{  
	                text: '确定',  
	                icon: 'ui-icon-check',  
	                click: function() {  
	                	var callBack=placeDialog.data("callBack");
	                	var code=null;
	                	var name=null;
	                	if(third.val()){
	                		code=third.val();
	                		name=third.puidropdown("getSelectedLabel");
	                	}else if(second.val()){
	                		code=second.val();
	                		name=second.puidropdown("getSelectedLabel");
	                	}else if(first.val()){
	                		code=first.val();
	                		name=first.puidropdown("getSelectedLabel");
	                	}
	                	callBack.call("",code,name);
	                	placeDialog.puidialog('hide');  
	                }  
	            },  
	            {  
	                text: '取消',  
	                icon: 'ui-icon-close',  
	                click: function() {  
	                	placeDialog.puidialog('hide');  
	                }  
	            }  
	        ]  
	    });
	}
	
	function booleanFormatter(value, options, rowObject) {
		if (value) {
			return "是";
		} else {
			return "否";
		}
	}

	function booleanUnformatter(value, option, rowObject) {
		return value == "是";
	}
	
	function getDateInput(input,property,parent){
		$("<img class='dateSelectImg' src='develop/img/selectDate.png'></img>").click(function(){
			new Calendar(1940).show(input[0]);
		}).attr("title","点击进行选择").appendTo(parent);
		input.puiinputtext();
		property.lt_setValue=function(value){
			input.val(value);
		};
		property.lt_getValue=function(value){
			return input.val();
		};
		property.lt_checkValue=function(){
			return LT.checker.date(input.val());
		};
	}
	
	function getParamSelect(input,property,eventType){
		var paramList=params[property.paramLink];
		var paramMap=new Object();
		if(paramList){//若一个下拉框为子下拉框，paramList为undifine
			for(var i=0;i<paramList.length;i++){
				paramMap[paramList[i].paramKey]=paramList[i];
			}
		}
		input.data("all",paramMap).data("userData",property);
		
		property.lt_setValue=function(value){
			if(input.puidropdown("getItemSize")==0){
				var parentParam=parentParamsMapping[parentMapping[property.paramLink]];
				if(parentParam){
					input.puidropdown("refresh",parentParam.children);
				}
			}
			input.puidropdown("selectValue",value);
			parentParamsMapping[property.paramLink]=paramMap[value];
		};
		property.lt_getValue=function(value){
			return input.val();
		};
		input.puidropdown({
			data:paramList,
			header:"-请选择"+property.propertyName+"-",
			scrollHeight:200,
			content:function(one){
				return one.paramValue;
			},
			change:function(){
				if(!input.data("all")){//元素也被移除
					return;
				}
				var postValue=input.data("all")[property.lt_getValue()];
				if(postValue==null){//选择的header
					postValue=new Object();
					postValue.groupId=input.data("userData").paramLink;
					postValue.children=null;
				}
				LT.postEvent(eventType,postValue);
			}
		});
		LT.addListener(eventType,function(obj){
			if(obj.type==eventType){
				if(!obj.value){
					return;
				}
				if(parentMapping[property.paramLink] == obj.value.groupId){
					input.puidropdown("refresh",obj.value.children);
					var children=obj.value.children;
					if(children){
						paramMap=new Object();
						for(var i=0;i<children.length;i++){
							paramMap[children[i].paramValue]=children[i];
						}
					}
					input.data("all",paramMap);
				}
			}
		});
	}
	
	function getPlaceInput(input,property,parent){
		var icon=$("<img class='placeSelectImg' src='develop/img/selectPlace.png'></img>")
		.attr("title","点击进行选择").appendTo(parent);
		input.puiinputtext();
		property.lt_setValue=function(value){
			if(!placeMap[value]){//籍贯号非法
//				input.val("");
//				icon.attr("src",icon.attr("src").replace("deletePlace.png","selectPlace.png"));
				return;
			}
			input.val(placeMap[value].fullName+"("+value+")").attr("jiguancode",value);
			icon.attr("src",icon.attr("src").replace("selectPlace.png","deletePlace.png"));
			input.attr("readonly",true);
		};
		property.lt_getValue=function(){
			return input.attr("jiguancode");
		};
		icon.click(function(){
			if(icon.attr("src").indexOf("deletePlace.png")>=0){//删除
				input.val(null).attr("readonly",false);
				icon.attr("src",icon.attr("src").replace("deletePlace.png","selectPlace.png"));
				input.attr("jiguancode","");
				return;
			}
			placeDialog.data("callBack",function(key,value){
				if(!key){
					return;
				}
				input.val(placeMap[key].fullName+"("+key+")");
				icon.attr("src",icon.attr("src").replace("selectPlace.png","deletePlace.png"));
				input.attr("readonly",true).attr("jiguancode",key);
			});			
			var x=input.offset().left;
			var y=input.offset().top;
			x=x-(placeDialog.width()-input.width())/2;
			if(x+placeDialog.width()>$(document.body).width()){
				x=$(document.body).width()-placeDialog.width();
			}
			x=x<0?0:x;
			y=y+input.height()+15;
			placeDialog.puidialog("show");
			placeDialog.css({left:x,top:y});
		});
		input.blur(function(){
			if(input.val()==null||input.val()==""||input.attr("readonly")){
				return;
			}
			var place=placeMap[input.val()];
			if(place){
			 input.val(place.fullName+"("+place.jiguanCode+")");
			 icon.attr("src",icon.attr("src").replace("selectPlace.png","deletePlace.png"));
			 input.attr("readonly",true);
			}else{
				LT.infomation({content:"籍贯号:"+input.val()+"不存在",time:1200},
						{element:input,location:"down"});
				 input.val(null);
			}			
		});
	}
	
	function getIdentifyInput(input,property,parent){
		input.puiinputtext();
		property.lt_setValue=function(value){
			input.val(value);
		};
		property.lt_getValue=function(value){
			return input.val();
		};
		property.lt_checkValue=function(){
			return LT.checker.identify(input.val());
		};
	}
	
	function getStringInput(input,property,parent){
		input.puiinputtext();
		property.lt_setValue=function(value){
			input.val(value);
		};
		property.lt_getValue=function(){
			return input.val();
		};
		property.lt_check=function(){
			return LT.checker.string(input.val());
		};
	}
	
	function getBooleanSelect(input,property,parent){
		input.append($("<option value=''></option><option value='true'>是</option><option value='false'>否</option>"));
		input.puidropdown();
		property.lt_setValue=function(value){
			input.puidropdown("selectValue",value);
		};
		property.lt_getValue=function(){
			return input.val();
		};
	}
	
	function getNumberInput(input,property,parent){
		input.puiinputtext();
		property.lt_setValue=function(value){
			input.val(value);
		};
		property.lt_getValue=function(){
			return input.val();
		};	
		property.lt_checkValue=function(){
			return LT.checker.number(property.type,input.val());
		};
	}
}