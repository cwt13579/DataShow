/**
 * 创建于:2014-5-21<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 数据表格控件
 * @author chender
 * @version 1.0.0
 */
LT.requireJqGrid();
LT.loadCss(LT.getBasePath()+"/common/workframe/liontech/plugin/dataTable/dataTable-t.css");
LT.DataTable = new function() {
	this.create = function(root,param) {
		var me={};
		var tableId="ltDataTable_"+new Date().getTime();
		$("<table class='ltDataTable'></table>").attr("id",tableId).appendTo(root);
		me.foot=$("<div class='ltDataTableFoot'></div>").attr("id",
				"ltDataTableFoot_"+$(".ltDataTableFoot").length).appendTo(root);
		me.root = root;
		me.param=param;
		me.lt_sort_name="";
		me.lt_sort_order="";
		me.build=function(setting){
			build(this,setting);
			return this;
		}
		me.smart=function(){
			smartParams();
			return this;
		}
		me.destroy=function(){
			me.table.jqGrid("GridDestroy");
		}
		me.query=function(queryCondition){
		  me.queryCondition=queryCondition;
		  me.refresh();
		}
		me.setRowNum=function(num,refresh){
			me.table.setGridParam({rowNum:num});  
			if(refresh){
				me.table.trigger("reloadGrid")
			}
		}
		me.refresh=function(){
			me.table.jqGrid('setGridParam', {datatype:'json'});
			me.table.trigger("reloadGrid");
		}
		me.condition=function(queryCondition){
			  me.queryCondition=queryCondition;
		}
		me.merge=function(param){
			me.mergeParam=param;
			var params=[];
			var curLevel=[];
			for(var i=0;i<param.length;i++){
				if(param[i].numberOfColumns==19870514&&curLevel.length!=0){
					params.push(curLevel);
					curLevel=[];
				}else{
					curLevel.push(param[i]);
				}
			}
			if(curLevel.length!=0){
				params.push(curLevel);
			}
			for(var i=0;i<params.length;i++){
				me.table.jqGrid('setGroupHeaders', {
					useColSpanStyle: true, 
					groupHeaders:params[i]
				});				
			}
		}
		me.getSelectedRowData=function(){
			var rowId=me.table.jqGrid("getGridParam","selrow");
			if(rowId==null){
				return null;
			}
			return me.table.jqGrid("getRowData",rowId);
		}
		me.getSelectedRowDatas=function(){
			var ids=me.table.jqGrid('getGridParam', 'selarrrow');
			var result=[];
			if(ids!=null){				
				for(var i=0;i<ids.length;i++){
					result.push( me.table.jqGrid("getRowData",ids[i]));
				}
			}
			return result;
		}
		me.getColWidth=function(colName){
			return $("[lt_dt_cw="+tableId+"_"+colName.replace(".","_")+"]").width();
		}
		me.getAllColWidth=function(){
			var result={};
			var cols=me.setting.colModel;
			for(var i=0;i<cols.length;i++){
				if(!cols[i].hidden){					
					result[cols[i].name]=me.getColWidth(cols[i].name);
				}
			}
			return result;
		}
		me.contextMenu=function(param){
			me.table.parent().parent().contextMenu(param);
		}
		me.getUserData=function(){
			return me.table.getGridParam("userData");
		}
		me.getAllData=function(){
			return me.table.getGridParam("data");
		}
		me.getExtendData=function(){
			return me.param.model.extendData;
		}
		me.chooseCol=function(){
			chooseCol(me);
		}
		me.setCaption=function(caption){
			me.table.setCaption(caption);
		}
		me.getInitCaption=function(){
			return me.param.model.caption;
		}
		me.showCol=function(cols){
			me.table.jqGrid("showCol",cols);
			delayResize(me);
		}
		me.hideCol=function(cols){
			me.table.jqGrid("hideCol",cols);
			delayResize(me);
		}
		me.mergeRow=function(  CellName) { 
            //得到显示到界面的id集合 
            var mya = $("#" + tableId + "").getDataIDs(); 
            //当前显示多少条 
            var length = mya.length; 
            for (var i = 0; i < length; i++) { 
                //从上到下获取一条信息 
                var before = $("#" + tableId + "").jqGrid('getRowData', mya[i]); 
                //定义合并行数 
                var rowSpanTaxCount = 1; 
                for (j = i + 1; j <= length; j++) { 
                    //和上边的信息对比 如果值一样就合并行数+1 然后设置rowspan 让当前单元格隐藏 
                    var end = $("#" + tableId + "").jqGrid('getRowData', mya[j]); 
                    if (before[CellName] == end[CellName]) { 
                        rowSpanTaxCount++; 
                          $("#" + tableId + "").setCell(mya[j], CellName, '', { display: 'none' }); 
                          
                    } else { 
                        rowSpanTaxCount = 1; 
                        break; 
                    } 
                    $("#" + tableId + "").setCell(mya[i], CellName, '', {},{ rowspan: rowSpanTaxCount }); 
                } 
            } 
        }; 
     
		return me;
	}
	
	
	/**
	 * 构建数据表格
	 */
	function build(me,setting) {
		if(me.param.actionName){
			me.param.url=me.param.actionName+"_dataTable.action"
			setting.url=me.param.actionName+"_queryData.action"
		}
		var root=me.root;
		var temp =$.extend({}, defaultsetting);
		setting=$.extend(temp, setting);
		me.setting=setting;
		var tableModel=null;
		if(me.param.model){
			tableModel=me.param.model;
		}else{
			me.param.model=tableModel=LT.synPost(me.param.url,{});
		}
		var colNames=[];
		var colModel=[];
		var col;
		var mapping=tableModel.mapping;
		var sizeJson=null;
		if(tableModel.tableColSize){
			sizeJson=LT.toJson(tableModel.tableColSize);
		}
		var fozenIndex=-1;
		tableModel.rowMerges=[];
		for(var i=0;i<tableModel.tableCols.length;i++){
			dealOne(tableModel.tableCols[i]);
		}
		
		function dealOne(col){
			
			colNames.push(col.colName);
			var mod={name:col.proName,align:"center",sortable:false};
			if(sizeJson){
				var width=sizeJson[col.proName];
				if(width!=null){
					mod.width=width;
				}
			}
			if(col.rowmergeable){
				tableModel.rowMerges.push(col.proName);
			}
			if(col.hidden){
				mod.hidden=true;
			}
			if(col.sortable){
				mod.sortable=true;
			}
			if(col.frozen){
				mod.frozen=true;
				fozenIndex=i;
			}
			if(col.align){
				mod.align=col.align;
			}
			if(col.proName==tableModel.pk){
				mod.key==true;
			}
			if(col.type=="select"){
				if(mapping[col.proName]==null){
					var msg="表格列<font color='red'>"+col.colName+"</font>为键值对类型,但未找到键值对的数据源";
					LT.infomation({type:"error",content:msg,sticky:true,block:true});
					throw new Error(msg);
				}
				mod.formatter=function(cellvalue,options,rowObject){
					if(cellvalue&&cellvalue.indexOf&&cellvalue.indexOf(",")!=-1){//数字类型没有indexOf方法
						cellvalue=cellvalue.split(",");
					}else{
						cellvalue=[cellvalue];
					}
					var result="";
					for(var i in cellvalue){
						var value=mapping[options.colModel.name][cellvalue[i]];
						value=value===undefined?"":value;
						result+=value+",";
					}
					return result.substring(0,result.length-1);
				};
			}
			if(col.formatter){
				mod.formatter=allFormatters[col.formatter]||function(cellvalue,options,rowObject){
					return window[col.formatter].call(window,cellvalue,rowObject);
				}
			}
			colModel.push(mod);
		}
		
		for(var i=0;i<fozenIndex;i++){
			colModel[i].frozen=true;//冻结列之前的列都需要冻结
		}
		setting.colNames=colNames;
		setting.colModel=colModel;
		if(setting.hidePaging){
			setting.pgbuttons=false;
			setting.pginput=false;
			setting.pgtext=false;
			setting.rowList=[];	
		}
		if(tableModel.checkable){
			setting.multiselect=true;
		}
		if(tableModel.autoColSize&&!sizeJson){
			setting.shrinkToFit=true;
		}
		if(tableModel.scrollPaging){//滚动翻页
			setting.scroll=1;//真分页(jqgrid的约定，scroll参数为1时滚动真分页)
		}		
		if(tableModel.loadOnce){//一次加载全部数据
			setting.loadonce=true;
			if(tableModel.scrollPaging){//一次加载且需要滚动分页，使用滚动假分页
				setting.scroll=true;
			}	
		}
		if(tableModel.tableGroup){
			setting.grouping=true;
			setting.groupingView =tableModel.tableGroup;
			setting.groupingView.groupCollapse=tableModel.groupCollapse;				
			if(tableModel.scrollPaging){//分组会导致导航栏的按钮被显示出来，如果是滚动翻页(不需要导航栏),手动隐藏
				setting.pgbuttons=false;
				setting.pginput=false;
				setting.pgtext=false;
				setting.rowList=[];	
			}
			
			if(tableModel.loadOnce){		
				setting.loadonce=false; //loadonce+groupingview在强制刷新时会有bug(组头不会减少),所以讲rowNum设置成很大，达到loadonce的效果
				setting.rowNum=999999;
			}
		}
		setting.rownumbers=tableModel.showRowNumber;
		setting.caption=tableModel.caption;	
		setting.pager = "#" + root.find(".ltDataTableFoot").attr("id");
		setting.serializeGridData=function(postData){
			if(postData==null){
				psotData={};
			}
			$.extend(postData,me.queryCondition);
			postData.lt_sort_name=me.lt_sort_name;
			postData.lt_sort_order=me.lt_sort_order;
			return postData;
		};
		setting.onSortCol=function(index, iCol, sortorder) {
			me.lt_sort_name=index;
			me.lt_sort_order=sortorder;
	    };
		$.jgrid.ajaxOptions.type = 'post';
		setting.gridComplete=function(){
			if(tableModel.rowMerges!=null&&tableModel.rowMerges.length>0){
				  for (colname in tableModel.rowMerges){
					  me.mergeRow( tableModel.rowMerges[colname]);
				  }
			   }
		}
		me.table=root.find(".ltDataTable").jqGrid(setting);
		me.elementRoot=me.table.parent().parent().parent();
		me.titleBar=me.elementRoot.find(".ui-jqgrid-titlebar");
		me.colHead=me.elementRoot.find(".ui-jqgrid-hdiv");
		var opt={add:false,del:false,edit:false,search:false,refreshtext:"刷新"};
		if(tableModel.loadOnce||tableModel.hideRefreshIcon){
			opt.refresh=false;//loadonce的时候自带的刷新不好使
		}
		me.table.jqGrid('navGrid', setting.pager,opt);
		if(tableModel.noRoundCorner){
			me.root.find(">div.ui-corner-all").removeClass("ui-corner-all");
			me.root.find(".ui-jqgrid-caption").removeClass("ui-corner-top");
			$(setting.pager).removeClass("ui-corner-bottom");
		}
		if(tableModel.loadOnce&&!tableModel.hideRefreshIcon){
			me.table.jqGrid('navButtonAdd',setting.pager,{
			    caption: "刷新",
			    title: "刷新表格数据",
			    buttonicon:"ui-icon-refresh",
			     onClickButton : function (){
				    me.refresh();
			    }
			});
		}
		if(tableModel.colChoosable){
			me.table.jqGrid('navButtonAdd',setting.pager,{
			    caption: "选择列",
			    title: "自定义选择需要显示的列",
			     onClickButton : function (){
					chooseCol(me);
			    }
			});
		}
		if(top.SF.devMode&&tableModel.tableKey){
			me.table.jqGrid('navButtonAdd',setting.pager,{
			    caption: "保存列宽",
			    title: "保存列宽",
			     onClickButton : function (){
					saveColWidth(me);
			    }
			});
			me.table.jqGrid('navButtonAdd',setting.pager,{
			    caption: "删除列宽",
			    title: "删除列宽",
			     onClickButton : function (){
					delColWidth(me);
			    }
			});
		}
		delayResize(me,true);
		if(tableModel.colMerges!=null&&tableModel.colMerges.length>0){
			me.merge(tableModel.colMerges);
		}
		if(fozenIndex!=-1){
			me.table.jqGrid('setFrozenColumns');
		}
		$(window).resize(function(){
			delayResize(me);
		});
	   var headCols=me.table.parent().parent().parent().find(".ui-jqgrid-htable .ui-th-column");
	   for(var i=0;i<headCols.length;i++){
			var hc=$(headCols[i]);
			hc.attr("lt_dt_cw",hc.attr("id").replace(".","_"));
		}
	   
		return me;
	}
	
	function chooseCol(me){
		alert("尚未实现的功能");
	}
	function saveColWidth(me){
		var pro=LT.startProgress({message:"正在保存"});
		var param={tableKey:me.param.model.tableKey,tableColSizeJson:LT.toString(me.getAllColWidth())};
		LT.asynPost(LT.getBasePath()+"/liontech/develop/developAction_saveColSize.action",param,function(result){
			pro.stopProgress(true);
			if(result=="success"){
				LT.infomation({content:"保存成功"});
			}else{
				LT.infomation({content:result,type:"error",stick:true,block:true});
			}
		});
	}
	
	function delColWidth(me){
		var pro=LT.startProgress({message:"正在删除"});
		var param={tableKey:me.param.model.tableKey};
		LT.asynPost(LT.getBasePath()+"/liontech/develop/developAction_deleteColSize.action",param,function(result){
			pro.stopProgress(true);
			if(result=="success"){
				LT.infomation({content:"删除成功"});
			}else{
				LT.infomation({content:result,type:"error",stick:true,block:true});
			}
		});
	}
	var width_;
	function delayResize(me,isInit){
		var table=me.table
		var root=me.root;
		width_=$(window).width();
		if(width_!=$(window).width()){//又被resize了
			return;
		}
		setTimeout(function(){//解决滚动条引起的问题
			resize(isInit,me);
		}, 0);
		
		function resize(isInit,me){
			var height=root.height()-(me.titleBar.height()+me.colHead.height()+me.foot.height()+12);
			var width=root.width()-3;
			if(isInit){
				height+=0;
				width+=0;
			}
			if(!me.setting.caption){
				height+=10;
			}
			table.setGridHeight(height);//设置的高度只是内部的高度，要考虑表头等因素
			table.setGridWidth(width);
			if(me.mergeParam){
				me.table.jqGrid('destroyGroupHeader');
				me.merge(me.mergeParam);
			}
		}
		
	}
	
	function smartParams(){
		jsonReader.page="curPage";
		jsonReader.total="pageNumbers";
		jsonReader.records="recordNumbers";
		prmNames.page="curPage";
		prmNames.rows="recordPerPage";
	}
	

	var jsonReader = {
			root : "data", 
			page : "pagination.curPage", 
			total : "pagination.pageNumbers",
			records : "pagination.recordNumbers", 
			repeatitems : false, // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。
			cell : "cell",
			userdata : "userData"
		};
	var prmNames = {
		page : "pagination.curPage", // 表示请求页码的参数名称
		rows : "pagination.recordPerPage" // 表示请求行数的参数名称	
	}

	var defaultsetting = {
		data : [],
		datatype : "json",
		url : "",
//		height : 350,
//		width : 1000,
		autowidth:true,
		autoScroll: false,
		pgbuttons : true,
		pginput : true,
		viewrecords : true,
		forceFit : false,
		shrinkToFit : false,
		altRows : true,
		altclass : "lt_dataTable_altCss",
		hiddengrid : false,
		hidegrid : false,
		loadui : "disable",
		emptyrecords : "没有满足条件的查询结果",
		rowNum : 50,
		rowList : [ 20, 30, 40, 50, 100 ],
		colNames : null,
		colModel : null,
		pager : "",
		prmNames : prmNames,
		jsonReader :jsonReader,
		beforeRequest:function(){
			this.pro=LT.startProgress({message:"正在请求数据"});
		},
		loadComplete:function(a){
			if(window.tableDataFinish){
				window.tableDataFinish(a);
			}
			this.pro.stopProgress(true);
		},
		loadError:function(xhr,status,error){
			this.pro.stopProgress(true);
			LT.infomation({type:"error",content:"加载数据出现错误,错误码:"+xhr.status});
		}
	}

	var allFormatters={
			smartTime:function(v,obj){
				return LT.parseTime(v);
			}
	}
	
}