/**
 * 创建于:2014-5-12<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 右键菜单功能
 * @author chender
 * @version 1.0.0
 */
jQuery.fn.contextMenu = function(menuData) {
	var settings = {
		contextMenuClass : 'contextMenuPlugin',
		customClass:"",
		gutterLineClass : 'gutterLine',
		headerClass : 'header',
		seperatorClass : 'divider',
		title : '',
		items : [],
		beforeShow:null,
		rightClick:true,
		leftClick:false  //为ture代表左键也触发
	};
	this.unbind("contextmenu");
	if(menuData==null){
		this.bind('contextmenu',function(evt){
			evt = evt || window.event;
			evt.stopPropagation ? evt.stopPropagation() : (evt.cancelBubble = true);
			return true;
		}); 
		return this;
	}
	if(!menuData.items){
		this.bind('contextmenu',function(evt){
			evt = evt || window.event;
			if(evt.shiftKey&&evt.ctrlKey){
				return true;
			}
			evt.stopPropagation ? evt.stopPropagation() : (evt.cancelBubble = true);
			return false;
		}); 
		return this;
	}

	$.extend(settings, menuData);

	function createMenu(items, e,source) {
		var menu = $(
				'<ul class="' + settings.contextMenuClass +' ui-widget-content '+settings.customClass+ '"><div class="'
						+ settings.gutterLineClass + '"></div></ul>').appendTo(
				document.body);
		if (settings.title) {
			$('<li class="' + settings.headerClass + '"></li>').text(
					settings.title).appendTo(menu);
		}
		for(var i=0;i<items.length;i++){
			var item=items[i];
			createMenuItem(item,menu,e,source);
		};
		menu.find('.' + settings.headerClass).text(settings.title);
		return menu;
	}
	var showSubItem=null;
	function createMenuItem(item,menu,e,source){
		if (item) {
			if(item.hidden===true){
				return;
			}
			var rowCode = '<li class=" ui-widget-content"><a href="javascript:void(0)"><span></span></a></li>';
			var row = $(rowCode).appendTo(menu);
			row.hover(function(){
				row.toggleClass('ui-state-hover');
			});
			if (item.icon) {
				var icon = $('<img class="leftIcon"></img>');
				icon.attr('src', item.icon);
				icon.insertBefore(row.find('span'));
			}
			if (item.children&&item.children.length!=0) {
				row.find("a").attr("hasSub", "true");
				var icon = $('<img class="rightArr"></img>');
				icon.attr('src',
						LT.getBasePath()+"/common/workframe/contextMenu/img/rightArr.png");
				icon.insertAfter(row.find('span'));

				item._subMenu = createMenu(item.children, e,source).css("display",
						"block").hide();
				item._subMenu.mouseover(function() {
					item._subCloseAble = false;
				});
				item._subMenu.mouseout(function() {
					var evt = e || window.event;
					var s = evt.toElement || evt.relatedTarget||evt.target;;
					if (s&&this.contains(s)) {
						return;
					}
					item._subCloseAble = true;
					setTimeout(function() {
						if (item._subCloseAble) {
							item._subMenu.hide();
						}
					}, 150);

				});

				row.mouseover(
						function(e) {
							if(item._subMenu.is(":visible")){
								return;
							}
							if(showSubItem!=null){
								showSubItem._subMenu.hide();
							}						
							item._subCloseAble = false;
							var left = $(this).offset().left
									+ $(this).width() + 4;
							var top = $(this).offset().top;
							if (left + item._subMenu.width() > $(window)
									.width() - 20) {
								left = $(this).offset().left
										- item._subMenu.width() - 8;
							}
							item._subMenu.css({
								zIndex : 10001,
								left : left,
								top : top
							});
							if(item.action){
								item.action(e,source,item.children);
								var li=item._subMenu.find("li");
								for(var i=0;i<item.children.length;i++){
									if(item.children[i].disabledMenu){
										$(li[i]).addClass("disabled");
									}else{
										$(li[i]).removeClass("disabled");
									}
								}
							}
							item._subMenu.show();
							showSubItem=item;
						}).mouseout(function(e) {
					var evt = e || window.event;
					var s = evt.toElement || evt.relatedTarget;
					if (this.contains(s)) {
						return;
					}
					item._subCloseAble = true;
					setTimeout(function() {
						if (item._subCloseAble) {
							item._subMenu.hide();
						}
					}, 150);
				});
			}
			row.find('span').addClass("fontSizeControl").text(item.name);

			if (item.disabledMenu) {
				row.addClass('disabled');
			} 
			if (item.action) {
				row.find('a').click(function() {
					if(row.hasClass("disabled")){
						return;
					}
					item.action(e,source);
				});
			}

		} else {
			$('<li class="' + settings.seperatorClass + '"></li>')
					.appendTo(menu);
		}
	}
	if(settings.leftClick){
		this.bind('click', showMenu);	
	}
	if(settings.rightClick){
		this.bind('contextmenu', showMenu);		
	}
	
	function showMenu(e){
		e=e||window.event;
		if(e.shiftKey&&e.ctrlKey){
			return true;
		}
		if(settings.beforeShow){
			if(settings.beforeShow(settings.items,this)===false){
				return false;//取消
			}
		}
		var menu = createMenu(settings.items, e,this).show();

		var left = e.pageX + 5, /*
								 * nudge to the right, so the pointer is
								 * covering the title
								 */
		top = e.pageY;
		if (top + menu.height() >= $(window).height()) {
			top -= menu.height();
		}
		if (left + menu.width() >= $(window).width()) {
			left -= menu.width();
		}

		// Create and show menu
		menu.css({
			zIndex : 10001,
			left : left,
			top : top
		}).bind('contextmenu', function() {
			return false;
		});

		var bg = $('<div></div>').css({
			left : 0,
			top : 0,
			width : '100%',
			height : '100%',
			position : 'fixed',
			display:"block",
			zIndex : 10000,
			backgroundImage:'url("data:image/gif; base64,AAAA")'
		}).appendTo(document.body).bind('contextmenu', function(e) {
			 bg.remove();
			 $(".contextMenuPlugin").remove();
			return false;
		}).bind("mousedown",function(){
			 bg.remove();
			 $(".contextMenuPlugin").remove();
			 return false;
		});

		$(".contextMenuPlugin").find('a').click(function() {
			if ($(this).attr("hasSub") == "true") {
				return;
			}
			bg.remove();
			$(".contextMenuPlugin").remove();
		});

		return false;
	}

	return this;
};
