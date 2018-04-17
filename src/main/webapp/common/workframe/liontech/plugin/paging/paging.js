/**
 * 创建于:2014-2-28<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 分页插件
 * @author chender
 * @version 1.0.0
 */
LT.Paging=new function(){
	LT.loadJs("common/workframe/bt/js/bootstrap.min.js");
	LT.loadCss("common/workframe/bt/css/bootstrap.min.css");
	LT.loadCss("common/workframe/bt/css/bootstrap-theme.min.css");
	var recordPerPage = -1; // -1时代表该值以后台的值为准
	var curPage = 1;
	var pageNumbers = 1;
	var recordNumbers = 0;
	var showNumber = -1;// 显示的页码个数
	var actionName = null; // action的名称
	var paramJson = null; // 查询的参数json对象
	var callBack = null; // 获取到数据后的回调事件
	var isAjax = false; // 是否为异步获取数据
	var preElement = 1; // 第一个页码按钮之前有几个元素（方便以后扩展）
	var otherButtons = 4;
	var onMobile = false; // 是否为手机访问模式

	this.action = function(_actionName) {
		actionName = _actionName;
		return this;
	};
	this.isAjax = function(_isAjax) {
		isAjax = _isAjax;
		return this;
	};
	this.callBack = function(_callBack) {
		callBack = _callBack;
		return this;
	};

	this.param = function(_paramJson) {
		paramJson = _paramJson;
		return this;
	};
	this.isOnMobile = function(_onMobile) {
		onMobile = _onMobile;
		return this;
	};

	/**
	 * 
	 */
	this.fire = function() {
		innerFire();
		return this;
	};

	this.hide = function() {
		$("#lt_paging_root").hide();
	};
	this.show = function() {
		$("#lt_paging_root").show();
	};

	this.changeRecordPerPage = function(_recordPerPage) {
		if (onMobile) {
			return;
		}
		recordPerPage = _recordPerPage;
		curPage = 1;
		innerFire();
	};

	this.showMore = function showMore() {
		if (!onMobile) {
			return;
		}
		curPage++;
		innerFire();
	};

	function innerFire() {
		var data = null;
		if (paramJson == null) {
			paramJson = new Object();
		}
		if (isAjax) {
			curPage = curPage < 1 ? 1 : curPage;// 防止上下翻页时页码太小或太大
			curPage = curPage > pageNumbers ? pageNumbers : curPage;
			paramJson.recordPerPage = recordPerPage;
			paramJson.curPage = curPage;
			var backData = LT.synPost(actionName + "_asynPagingData.action",
					paramJson);
			recordPerPage = backData.recordPerPage;
			curPage = backData.curPage;
			pageNumbers = backData.pageNumbers;
			recordNumbers = backData.recordNumbers;
			showNumber = backData.showNumber;
			data = backData.data;
			bindLeftAndRight();
			createUi();
			callBack(data);
		} else {
			recordPerPage = lt_paging_recordPerPage; // 等号右边的变量会在引入的jsp中定义
			curPage = lt_paging_curPage;
			pageNumbers = lt_paging_pageNumbers;
			recordNumbers = lt_pagig_recordNumbers;
			showNumber = lt_paging_showNumber;
			bindLeftAndRight();
			createUi();
		}
	}
	/**
	 * 创建ui
	 */
	function createUi() {
		if (!onMobile) {
			createUi4Pc();
		} else {
			createUi4Mobile();
		}
	}

	/**
	 * 创建pc版ui
	 */
	function createUi4Pc() {
		$("#lt_paging_mobile").hide();
		enableLeftOrRight();
		changePagingDesc();
		var end = curPage + parseInt(showNumber / 2);
		end = showNumber % 2 != 0 ? end : end - 1;
		end = end < showNumber ? showNumber : end;
		end = end > pageNumbers ? pageNumbers : end;
		var start = end - showNumber + 1;
		start = start < 1 ? 1 : start;
		var actualNumber = end - start + 1;
		var rootElement = $("#lt_paging_pc");
		var pre = $(rootElement.children()[0]);
		// var nowNumber = rootElement.children().length;
		var buttonNumber = $("#lt_paging_pc button").length;

		for ( var i = actualNumber; i < buttonNumber - otherButtons; i++) {// 移除多余的
			$(rootElement.children()[preElement]).remove();
		}

		for ( var i = buttonNumber; i < actualNumber + otherButtons; i++) { // 加上不足的
			pre = $("<button></button>").insertAfter(pre);
		}
		var step = -1;
		for ( var i = preElement; i < actualNumber + 1; i++) {// 设置样式和数字
			var number = ++step + start;
			if (number == curPage) {
				$(rootElement.children()[i]).attr("class", "btn btn-info")
						.html(number).attr("index", number);
			} else {
				$(rootElement.children()[i]).attr("class", "btn btn-default")
						.html(number).attr("index", number);
			}
			$(rootElement.children()[i]).unbind("click").bind("click",
					function() {
						curPage = $(this).attr("index");
						innerFire();
					});
		}
	}

	/**
	 * 创建手机版ui
	 */
	function createUi4Mobile() {
		$("#lt_paging_pc").hide();
		if (curPage >= pageNumbers) {
			$("#lt_paging_mobile a").html("无更多数据");
			$("#lt_paging_mobile").attr("onclick", "");
		}
	}

	/**
	 * 修改翻页描述
	 */
	function changePagingDesc() {
		$("#lt_paging_desc").html(
				"&nbsp;&nbsp;页码数:<font color='red'>" + pageNumbers
						+ "</font><br>&nbsp;&nbsp;记录数:<font color='red'>"
						+ recordNumbers + "</font>");
	}

	/**
	 * 绑定前后翻页事件
	 */
	function bindLeftAndRight() {
		var left = $("#lt_paging_left");
		var right = $("#lt_paging_right");
		left.unbind("click").bind("click", function() {
			curPage--;
			innerFire();
		});
		right.unbind("click").bind("click", function() {
			curPage++;
			innerFire();
		});
	}

	function enableLeftOrRight() {
		if (curPage <= 1) {
			$("#lt_paging_left").attr("disabled", "disabled");
		} else {
			$("#lt_paging_left").attr("disabled", null);
		}
		if (curPage >= pageNumbers) {
			$("#lt_paging_right").attr("disabled", "disabled");
		} else {
			$("#lt_paging_right").attr("disabled", null);
		}
	}
	return this;
};