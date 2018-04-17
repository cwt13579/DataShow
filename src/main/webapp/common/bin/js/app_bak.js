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
	  util : {
	  	join : function(arr, split) {
	  		return arr.join(split);
	  	}
	  }
	});
})(jQuery);