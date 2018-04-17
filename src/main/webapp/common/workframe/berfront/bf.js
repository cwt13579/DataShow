/**
 * 创建于:2017-3-3<br>
 * 版权所有(C) 2017 宝润兴业<br>
 * 前端基础js支持
 * 
 * @author chender
 * @version 1.0.0
 */
(function() {
	window.BF = new function() {
		this.startProgress = function(msg, timeOut) {
			return new Progress({
				message : msg || '请稍候',
				timeOut : timeOut || 10000
			});
		}
		this.getBasePath = function() {
			var bp = BF.basePath;
			if (bp == null) {
				BF.basePath = bp = window.location.protocol + "//"
						+ window.location.host + "/" + this.getContextPath();
			}
			return bp;
		};

		this.getResource = function(src) {
			return this.getBasePath() + "/" + src;
		}
		
		this.getModulePath = function(name) {
			return this.getBasePath() + "/modules/" + name+"/";
		}

		this.getContextPath = function() {
			return window.location.pathname.split("/")[1];
		};

		this.theme = function(theme) {
			this.loadCss(this.getResource("common/workframe/jquery/themes/"
					+ theme + "/jquery-ui.min.css"));
		}

		var loadedCss = {};
		this.loadCss = function(href) {
			if (loadedCss[href]) {
				return;
			}
			var css = document.createElement("link");
			css.setAttribute("rel", "stylesheet");
			css.setAttribute("type", "text/css");
			css.setAttribute("href", href + "?t=1");
			document.getElementsByTagName("head")[0].appendChild(css);
			loadedCss[href] = true;
		}
		/**
		 * 同步post请求
		 */
		this.synPost = function(url, paramJson, extParam) {
			return ajax(url, false, "post", paramJson, null, extParam);
		};
		/**
		 * 异步post请求
		 */
		this.asynPost = function(url, paramJson, callBack, extParam) {
			return ajax(url, true, "post", paramJson, callBack, extParam);
		};
		/**
		 * 同步get请求
		 */
		this.synGet = function(url, paramJson, extParam) {
			return ajax(url, false, "get", paramJson, null, extParam);
		};
		/**
		 * 异步get请求
		 */
		this.asynGet = function(url, paramJson, callBack, extParam) {
			return ajax(url, true, "get", paramJson, callBack, extParam);
		};
		
		this.bindData = function(html, object) {
			if(!(object instanceof Object) && !(object instanceof Array)) {
				return html.replace("#{item}", object);
			}
			var div = document.createElement("div");
			div.innerHTML = html;
			var binds = document.querySelectorAll("[bind-data]");
			var map = {};
			for(var i = 0; i < binds.length; i++) {
				map[binds[i].getAttribute("bind-data")] = binds[i].innerHTML;
			}
			if(!object) {
				return "";
			}
			if(!(object instanceof Array)) {
				object = [object];
			}
			if(object.length == 0) {
				return "";
			}
			html = this.replaceAll(html, "#{src}", "src");
			var result = "";
			for(var i in object) {
				var temp = html;
				var one = object[i];
				if(!(one instanceof Object) && !(one instanceof Array)) {
					temp = temp.replace("#{item}", dealSpecialChar(one));
				} else
					for(var p in one) {
						if(one[p] && (one[p] instanceof Array)) {
							if(map[p]) {
								temp = temp.replace(map[p], this.bindData(map[p], one[p]));
							} else {
								for(var j in one[p]) {
									var o = one[p][j];
									if(o instanceof Object) {
										for(var q in o) {
											temp = temp.replace("#{" + q + "_" + j + "}", dealSpecialChar(o[q]));
										}
									} else {
										temp = temp.replace("#{item_" + j + "}", dealSpecialChar(o));
									}
								}
							}
						} else {
							temp = this.replaceAll(temp, "#{" + p + "}", dealSpecialChar(one[p]));
						}
					}
				result += temp;
			}
			return result;
		}
		
		this.replaceAll = function(string, old, replaceWith, ignoreCase) {
			if(!RegExp.prototype.isPrototypeOf(old)) {
				return string.replace(new RegExp(old, (ignoreCase ? "gi" : "g")), replaceWith);
			} else {
				return string.replace(old, replaceWith);
			}
		}
		
		function dealSpecialChar(str) {
			if(str==null||Object.prototype.toString.call(str) != "[object String]"){
				return str;
			}
			str = str.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
			return str;
		}

		function ajax(url, isAsyn, requestType, paramJson, callBack, extParams) {
			var dp={noPackage:false,noJson:false,timeout:0};
			extParams=extParams||dp;
			extParams=$.extend(dp,extParams);
			var noPackage=extParams.noPackage;
			var noJson=extParams.noJson;
			var result = null;
			var error = null;
			var pro = null;
			$
					.ajax({
						type : requestType,
						async : isAsyn,
						timeout : extParams.timeout,
						url : url.indexOf("?") > 0 ? (url + "&time=" + new Date()
								.getTime())
								: (url + "?time=" + new Date().getTime()),
						data : paramJson == null ? null : $.param(paramJson,
								true),
						dataType : noJson ? "html" : "json",
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
//									callBack(new AsynException("000", "返回数据格式不正确"));
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
//										callBack(new AsynException("001", "后台出现错误"));
									} else {
										error = new Error("后台出现错误");
									}
								}else {
									unknownResponseStatus(back.status);
									if (isAsyn) {
//										callBack(new AsynException("001", "未知的状态码"));
									} else {
										error = new Error("未知的状态码");
									}
								}
							}
						},
						error : function(XMLHttpRequest, textStatus,
								errorThrown) {
							comErr(XMLHttpRequest, textStatus, errorThrown);
						}
					});
			if (!isAsyn) {
				if (error) {
					throw error;
				}
				return result;
			}
		}
		
		function comErr(req,status,err){
			alert("服务端响应状态不正确,状态码:"+status);
		}
		
		function badResponseFormat(){
			alert("返回数据格式不正确");
		}
		
		function requestProcessFail(errCode,errMsg){
			alert("服务器异常,code:"+errCode+",msg:"+errMsg);
		}
	}

	var runingCompute = 0;
	var preBg = null;
	var preRoot = null;
	var preContent;
	var progressParam = {
		expectTime : 1000,
		timeOut : 10000,
		message : "正在努力加载",
		really : false,
		showPercent : false,
		bgOpacity : 0.15,
		opacity : 0.35
	};
	function Progress(params) {
		var runningNum = runingCompute;
		var atLeft = (runningNum % 2 == 0);// 在左侧显示
		var fix = atLeft ? -155 * parseInt(runningNum / 2)
				: 155 * parseInt((runningNum + 1) / 2);
		var key = new Date().getTime();
		var p = $.extend(progressParam, params);
		p.parent = document.body;
		$.extend(p, params);
		if (p.expectTime > p.timeOut - 5000) {
			p.timeOut = p.expectTime + 5000;
		}
		if (runingCompute == 0) {
			preRoot = $(
					"<div style='text-align:center;position:absolute;width:100%;height:100%;top:0px;left:0px;z-index:9998'></div>")
					.appendTo(p.parent);
			preBg = $(
					"<div style='text-align:center;color:blue;z-index:9999;position:absolute;width:100%;height:100%;top:0px;left:0px'></div>")
					.appendTo(p.parent);
			preContent = $(
					"<div style='position:relative;top:37%;height:132px;overflow-y:hidden'></div>")
					.appendTo(preBg);
			if ($(p.parent)[0] == document.body) {
				preRoot.css("position", "fixed");
				preBg.css("position", "fixed");
			}
			// if(!($.browser.msie&&($.browser.version == "8.0"))){
			preRoot.addClass("ui-widget-overlay").css("opacity", p.bgOpacity);
			// }
		}
		var blockBg = $(
				"<div  style='height:132px;width:150px;margin-left:"
						+ fix
						+ "px;left:40%;border-radius:15px;position:absolute;background-color:white'></div>")
				.appendTo(preContent);
		// if(!($.browser.msie&&($.browser.version == "8.0"))){
		preRoot.css("opacity", p.opacity);
		// }
		var block = $(
				"<div style='height:132px;width:150px;left:40%;position:absolute;margin-left:"
						+ fix + "px;border-radius:15px;'></div>").appendTo(
				preContent);
		var imgSrc = BF.getResource("common/images/progress/progress_5.gif");
		var timeOutSrc = BF.getResource("common/images/progress/timeOut.png");
		var cancelSrc = BF.getResource("common/images/progress/exit.png");
		var img = $(
				"<img style='position:relative;height:96px;width:96px;left:0px;top:5px' />")
				.attr("src", imgSrc).appendTo(block);
		var timeOutImg = $(
				"<img style='position:relative;height:96px;width:96px;left:0px;top:-182px;'/>")
				.attr("src", timeOutSrc).css("opacity", 0).appendTo(block);
		var cancel = $(
				"<img style='cursor:pointer;top:2px;right:2px;position:absolute' />")
				.attr("src", cancelSrc).click(function() {
					stopProgress(true);
				}).appendTo(block).hide();
		var timeLabel = $(
				"<div style='font-size:16px;color:blue;position:absolute;font-weight:bold;width:20px;height:20px;top:2px;right:2px'></div>")
				.appendTo(block);
		var tempMessage = p.message;
		if (tempMessage.length > 8) {
			tempMessage = tempMessage.substring(0, 8) + "..";
		}
		var message = $(
				"<div style='top:100px;left:10px;right:10px;color:blue;font-weight:bold;font-size:12px;position:absolute;'></div>")
				.html(tempMessage).attr("title", p.message).appendTo(block);
		var dot = $("<a style='color:blue'></a>").html(".").appendTo(message);
		var percentArea = null;
		percentArea = $(
				"<div style='font-size:25px;position:relative;left:0px;top:-162px'>0%</div>")
				.appendTo(block);
		if (!p.showPercent) {
			percentArea.hide();
		}

		var timeOutArea = $("<div style='font-size:13px;position:absolute;font-weight:bold;top:100px;left:10px'>时间有点长了,但你可以尝试继续等待<div>");

		var processTime = 0;
		var percent = 0;
		var stop = false;
		var $this = this;
		runingCompute++;
		;
		// if(p.showPercent){
		window.setTimeout(animate, 50);
		// }
		var number = 1;
		function animate() {
			if (!stop) {
				timeLabel.html(parseInt(processTime / 1000));
				processTime += 50;

				var percent = parseInt(processTime / p.expectTime * 100);

				// var plus=parseInt((100-percent)/10);
				// plus=plus==0?1:plus;
				// percent=percent+plus;
				percent = percent > 99 ? 99 : percent;
				percentArea.html(percent + "%");
				number = processTime % 1600;

				if (number > 1200) {
					dot.html("........");
				} else if (number > 800) {
					dot.html("......&nbsp&nbsp");
				} else if (number > 400) {
					dot.html("....&nbsp&nbsp&nbsp&nbsp");
				} else {
					dot.html("..&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp");
				}
				if (processTime > p.timeOut) {
					timeOut();
				} else {
					window.setTimeout(animate, 50);
				}

			}
		}

		function timeOut() {
			percentArea.hide();
			timeLabel.hide();
			message.remove();
			img.animate({
				top : 101,
				opacity : 0
			});
			timeOutImg.animate({
				top : -92,
				opacity : 1
			}, function() {
				block.append(timeOutArea);
				cancel.show();
			});
		}

		this.setPercent = function(percent) {
			if (!p.really) {
				return;
			}
			percentArea.html(percent + "%");
		};

		this.stopProgress = function(ime) {
			stopProgress(ime);
		};

		this.changeMessage = function(msg) {
			message.html(msg);
		};

		function stopProgress(ime) {
			if (ime) {
				stop = true;
				blockBg.remove();
				block.remove();
				if (runingCompute == 1) {
					preContent.remove();
					preBg.remove();
					preRoot.remove();
				}
				runingCompute--;
			} else {
				setTimeout(function() {
					stop = true;
					blockBg.remove();
					block.remove();
					if (runingCompute == 1) {
						preContent.remove();
						preBg.remove();
						preRoot.remove();
					}
					runingCompute--;
				}, 300);
			}
		}
	}
})()
