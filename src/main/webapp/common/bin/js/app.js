(function ($) {
	$.extend({
		// 页面消息提示框
	  dialog : {
	  	// 消息通知
	  	info : function(content, width, height, timeInMillis) {
	  		if(content) {
	  			var t = timeInMillis ? timeInMillis : 1500;
	  			var d = dialog({
	  				fixed: true,
	  		    content: content
		  		});

	  			if(width && width>0) {
	  				d.width(width);
	  			}

	  			if(height && height>0) {
	  				d.height(height);
	  			}

		  		d.show();
		  		setTimeout(function () {
		  		    d.close().remove();
		  		}, t);
	  		} else {
	  			alert("函数参数错误，格式为：$.dialog.info(content, width, height, timeInMillis)");
	  		}
	  	},
	  	// 点击同意执行指定的回调函数
	  	confirmByCallback : function(title, content, callback, width, height) {
	  		if(title && content && callback) {
	  			var d = dialog({
	  				fixed: true,
	  				title: title,
	  		    content: content,
	  				button : [
	  				  {
		  					value : '确认',
		  					callback : callback
	  				  },
	  				  {
		  					value : '取消'
	  				  }
	  				]
	  			}).showModal();

	  			if(width && width>0) {
	  				d.width(width);
	  			}

	  			if(height && height>0) {
	  				d.height(height);
	  			}
	  		} else {
	  			alert("函数参数错误，格式为：$.dialog.deleteByCallback(title, content, callback, width, height)");
	  		}
	  	},
	  	// 点击同意页面跳转至指定的url
			deleteByUrl : function(title, content, url, width, height) {
				if(title && content && url) {
					this.confirmByCallback(title, content, function(){
						window.location = url;
					}, width, height);
				} else {
					alert("函数参数错误，格式为：$.dialog.deleteByUrl(title, content, url, width, height)");
				}
			}
	  },
	  ws : {
	  	sub : function(topicUrl, callback) {
	  		var request = {
	  	      url : topicUrl,
	  	      trackMessageLength : true,
	  	      transport: 'websocket'
	  		};

	  		request.onMessage = callback;
	  		atmosphere.subscribe(request);
	  	},
	  	unsub : function(topicUrl, callback) {
	  		var request = {
	  	  	      url : topicUrl,
	  	  	      trackMessageLength : true,
	  	  	      transport: 'websocket'
	  	  		};
	  		atmosphere.unsubscribe(request);
	  	}
	  },
	  util : {
	  	join : function(arr, split) {
	  		return arr.join(split);
	  	},
	    checkbox_all : function(ck, ck_name){
	  		var cked = $(ck).is(":checked");
	  		$(":checkbox[name="+ck_name+"]").each(function(){
				$(this).get(0).checked=cked;
			});
			$.util.show_buttons(ck_name);
	  	},
	  	show_buttons : function(ck_name){
			var s = $(":checkbox[name="+ck_name+"]:checked").size();
			if(s>0){
				if(s>1){
					$("button.btn_data_1").addClass("disabled");
				}else{
					$("button.btn_data_1").removeClass("disabled");
				}
				var text = $(".table-responsive");
				$("#buttons_box_num").text(s);
				$("#buttons_box").css({
					left: "45px",
					top: "0px"
				}).width(text.width()-45+15).css("background-color", "#fff").slideDown("fast");
			}else{
				$.util.hide_buttons();
			}
		},
		hide_buttons : function(){
			$("#buttons_box").fadeOut("fast");
		},
		// onmouseover
		light_checked : function(ck_name){
			$(":checkbox[name="+ck_name+"]:checked").each(function(){
				$(this).parents("tr").css("background-color", "#f5f5f5");
			});
		},
		// onmouseout
		dark_checked : function(ck_name){
			$(":checkbox[name="+ck_name+"]:checked").each(function(){
				$(this).parents("tr").css("background-color", "#fff");
			});
		}
	  }
	});
})(jQuery);