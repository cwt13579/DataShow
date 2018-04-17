/**
 * 创建于:2014-9-4<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 配置界面控件
 * @author chender
 * @version 1.0.0
 */
LT.requireLTPlugin(["simplePage"]).requirePrimeUi(["fieldset"]);

LT.ConfigPage=new function(){
	var me={};
	me.create=function(){
		createArea(me);
		me.simplePage=LT.SimplePage.create(me.formArea,me.operArea,me.tableArea);
		return me;
	}
	
	me.build=function(simplePageParam){
		var finish=simplePageParam.finish;
		simplePageParam.finish=function(){
			setTimeout(function(){				
				justifySize(me);
			}, 100);
			if(finish){
				finish();
			}
		}
		me.simplePage.build(simplePageParam);
		return me;
	}
	
	function createArea(me){
		$(document.body).empty();
		var root=$("<div></div>").css({position:"absolute",left:0,top:0,right:0,bottom:0,position:"absolute",overflow:"hidden"});
		me.topArea=$("<fieldset class='topArea'><legend>查询条件</legend></fieldset>").css({position:"absolute",left:2,right:2}).appendTo(root);
		me.topInner=$("<div></div>").css({position:"relative"}).appendTo(me.topArea)
		me.formArea=$("<div class='formArea'></div>").css({borderWidth:0,position:"absolute",left:0,right:0}).appendTo(me.topInner);
		me.operArea=$("<div class='operArea'></div>").css({position:"absolute",left:0,right:0}).appendTo(me.topInner);
		me.tableArea=$("<div class='tableArea'></div>").css({position:"absolute",bottom:0,left:0,right:0}).appendTo(root);
		root.appendTo(document.body);
		me.topArea.puifieldset({toggleable: false});
	}
	
	function justifySize(me){
		var fh=me.formArea.find(".lt_form_body")[0].scrollHeight;
		me.formArea.css({height:fh,top:2});
		me.operArea.css({top:fh+2,height:35,borderWidth:0});
		me.topArea.css("padding","0.4em").find(">.pui-fieldset-content").height(fh+40);
		me.topInner.css("height","100%");
		me.operArea.find("input").css({width:154,float:"right",marginLeft:0});
		me.tableArea.css({top:fh+88});
		$(window).resize();
	}
	return me;
}