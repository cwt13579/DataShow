(function($) {
	// 页面date picker构建
	// options.type: 1:日期加时间：yyyy-mm-dd hh:ii； 2:日期：yyyy-mm-dd； 3:时间：hh:ii
	// options.defaultDay: 默认日期： 0：当天；其他：在当前日期基础上加减天数，如“1”表示明天，“-1”表示昨天
	// options.defaultTime：默认时间：格式hh:ii，如 “12:30”
	$.fn.ui_datepicker = function(options, callback) {
		var options = $.extend({}, $.fn.ui_datepicker.defaults, options);
		if(options.type == 1){
			if(!$(this).val()){
				var d = new Date(new Date().getTime() + (options.defaultDay * 24 * 60 * 60 * 1000));
				var time = d.getFullYear() + "-" + fill(d.getMonth()+1) + "-" + fill(d.getDate()) + " " + options.defaultTime;
				$(this).val(time);
			}
			$(this).css("width","128px").css("background-color","#fff").datetimepicker({
		        language:  'zh-CN',
		        weekStart: 1,
		        todayBtn:  0,
				autoclose: 1,
				todayHighlight: 0,
				startView: 2,
				forceParse: 1,
		        showMeridian: 0
		    });
		} else if(options.type == 2){
			if(!$(this).val()){
				var d = new Date(new Date().getTime() + (options.defaultDay * 24 * 60 * 60 * 1000));
				var time = d.getFullYear() + "-" + fill(d.getMonth()+1) + "-" + fill(d.getDate());
				$(this).val(time);
			}
			$(this).css("width","93px").css("background-color","#fff").datetimepicker({
				format: 'yyyy-mm-dd',
		        language:  'zh-CN',
		        weekStart: 1,
		        todayBtn:  0,
				autoclose: 1,
				todayHighlight: 0,
				startView: 2,
				minView: 2,
				maxView: 4,
				forceParse: 1,
		        showMeridian: 0
		    });
		} else if(options.type == 3){
			if(!$(this).val()){
				$(this).val(options.defaultTime);
			}
			$(this).css("width","57px").css("background-color","#fff").datetimepicker({
				format: 'hh:ii',
		        language:  'zh-CN',
		        weekStart: 1,
		        todayBtn:  0,
				autoclose: 1,
				todayHighlight: 0,
				startView: 1,
				minView: 0,
				maxView: 1,
				forceParse: 1,
		        showMeridian: 0
		    });
		}
		if(callback){
			callback();
		}
	};
	// 页面color picker构建
	$.fn.ui_colorpicker = function(options, callback) {
		if(options && options.defaultColor){
			$(this).val(options.defaultColor);
			$(this).css("background-color", options.defaultColor);
		}
		$(this).colorpicker().on('changeColor', function(ev){
			$(this).css("background-color", ev.color.toHex());
		});
		if(callback){
			callback();
		}
	};

	// 页面combo构建
	$.fn.ui_combo = function(options, callback) {
		var options = $.extend({}, $.fn.ui_select.defaults, options);
		$(this).append(build($(this), options.schema, options.selectedValue, options.needDefault, options.defaultLabel, options.params));
		if(callback){
			callback();
		}
		return $(this).combobox();
	};

	// 页面select构建
	$.fn.ui_select = function(options, callback) {
		var options = $.extend({}, $.fn.ui_select.defaults, options);
		$(this).append(build($(this), options.schema, options.selectedValue, options.needDefault, options.defaultLabel, options.params));
		if(callback){
			callback();
		}
	};

	function build(selectRoot, schema, selectedValue, needDefault, defaultLabel, params) {
		var select = selectRoot;
		var invokeUri = path + eval("js_enums."+schema);
		nestedBuild(invokeUri, select, selectedValue, needDefault, defaultLabel, params);
		return select;
	}

	function nestedBuild(uri, select, selectedValue, needDefault, defaultLabel, params) {
		$.ajax({
			url: uri,
			method:"post",
			data: params,
			async: false,
			success: function(data){
				if(needDefault) {
					var option = $('<option value=\'\'>' + defaultLabel + '</option>');
					select.append(option);
				}
				$.each(data, function(i,status){
					var option = $('<option value=' + status.value + '>' + status.note + '</option>');
			
					selectedValue.forEach(function(e){ 
			
						if(status.value == e) {
							option.attr("selected", "selected");
						}
					});
					
					select.append(option);
				});
			},
			error:function(){
				alert(uri + "生成的列表构建失败");
			}
		});
	}

	$.fn.ui_select.defaults = {
		schema : "",
		selectedValue : "",
		needDefault : true,
		defaultLabel : "请选择",
		params : ""
	};
	function fill(num){
		if(num<10){
			return "0" + num;
		}
		return num;
	}
	$.fn.ui_datepicker.defaults = {
			type : 1,
			defaultDay : 0,
			defaultTime : "00:00"
		};
})(jQuery);