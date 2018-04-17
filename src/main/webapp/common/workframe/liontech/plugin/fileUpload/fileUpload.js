/**
 * 创建于:2014-6-24<br>
 * 版权所有(C) 2014 欧姆软件<br>
 * 文件上传服务
 * @author chender
 * @version 1.0.0
 */
LT.loadCss(LT.getBasePath()+"/common/workframe/liontech/plugin/fileUpload/fileUpload.css");
LT.FileUpload = new function() { 
	this.uploadOneByOne=function(setting){
		var defautSetting={showUi:true,files:[],onSuccess:null,onFail:null};
		setting=$.extend(defautSetting,setting);		
		if(setting.files.length<=0){
			LT.infomation({content:"没有需要上传的文件"});
			return;
		}
		var dialog=createDialog(setting);
		setting.dialog=dialog;
		var iframe=dialog.iframe;
		var root=dialog.root;
		var curFile=null;
		setting.fileIndex=-1;
		var form=null;
		setting.successNumber=0;
		uploadNextFile(iframe,setting);
	}
	function uploadNextFile(iframe,setting){
		if(setting.fileIndex < setting.files.length-1){
			setting.fileIndex++;
			curFile=setting.files[setting.fileIndex];
			if(curFile.uploadSuccess){
				uploadNextFile(iframe,setting);
			}
			uploadOneFile(iframe,curFile);
		}else{//上传完毕
			if(setting.successNumber!=setting.files.length){//存在失败			
				LT.dialog({closable:false,title:"提示",message:"存在"+(setting.files.length-setting.successNumber)+"个上传失败的文件,是否重试?",buttons:["是","否"]},function(choice){
					if(choice=="是"){
						setting.fileIndex=-1;
						uploadNextFile(iframe,setting);
					}else{
						setting.dialog.close();
						setting.onFinish(setting.successNumber,true);
					}
				});
			}else{
				setting.dialog.close();
				setting.onFinish(setting.successNumber);
			}			
		}		
	}	
	
	function uploadOneFile(iframe,curFile){
		iframe.data("curFile",curFile);
		setUploading(curFile);
		var form=createUploadFormForFS(curFile.url,curFile.param,curFile.element);
		form.attr("target",iframe.attr("name"));
		iframe.after(form);
		iframe.data("form",form);
		form.submit();
	}
	
	function oneFinish(iframe,setting){
		var curFile=iframe.data("curFile");
		var form=iframe.data("form");
		if(form==null){//returlUrl触发的loaded事件
			return;
		}
		var params=form.data("params");
		if(curFile==null||form==null){//将iframe加载到body时触发的load事件
			return;
		}
		var copy=curFile.element.data("copy_element");
		curFile.element.attr("name",copy.attr("name"));
		copy.before(curFile.element).remove();//将原始的文件元素还原
		form.remove();
		var src=null;
		try{
			src=iframe[0].contentWindow.location.href;
			src=unescape(src);
		}catch (e) {
		}
		var message=null;
		var url=params.returnUrl||"common/jsp/upload/infomation.html";
		if(src!=null&&src.indexOf(url)==0){
			message=src.substring(src.indexOf(url)+url.length,src.length);
			message=LT.urlParamToMap(message);
		}else{
			try{
				message=LT.toJson(iframe[0].contentWindow.document.body.innerHTML);
				if(message.status==0){
					alert(message.errMessage);
				}else if((message.status==1&&message.body=="success")||(message.code==200&&message.uuid)){
					message.code=200;
				}else{
					alert(message.body);
				}
			}catch (e) {
				
			}
		}
		if(message==null||message.code!=0){//失败,提示
			setUploadFail(curFile);
			if(setting.onFail(curFile)){//返回true代表重试,false代表跳过
				setUploading(curFile);
				setting.fileIndex--;
			}		
		}else if(message.code==0){//上传成功
			setting.successNumber++;
			setUploadSuccess(curFile);//改变图标
			setting.onSuccess(curFile,message.picurl);
		}
		uploadNextFile(iframe,setting);
	}
	
	/**
	 * 创建下载弹出框
	 */
	function createDialog(setting){
		var files=setting.files;
		var top=($(window).height()-350)/2;
		var left=($(window).width()-600)/2;
		var dialog=LT.createWindow({block:true,width:500,height:200,left:left,top:top,closable:false},function(){});
		var root=$("<div style='width:100%;height:100%;overflow:auto'></div>");
		var iframe=$("<iframe src='about:blank'  frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='yes' allowtransparency='yes'></div>")
		.attr("name","uploadIframeName_"+new Date().getTime()).css("display","none");
		var iframeId="uploadIframeId_"+new Date().getTime();
		iframe.load(function(){
			oneFinish(iframe,setting);		
		}).attr("id",iframeId).appendTo(root);
//		for(var i=0;i<10;i++){//测试多文件上传
//			files[i]=$.extend({},files[0]);
//		}
		for(var i=0;i<files.length;i++){
			var itemRoot=$("<div class='lt-upload-item'></div>").data("file",files[i]);
			$("<img class='lt-upload-image'></img>").attr("src",LT.getBasePath()+"/common/images/upload/unUpload.png").appendTo(itemRoot);
			$("<div class='lt-upload-desc'>等待上传</div>").appendTo(itemRoot);
			itemRoot.appendTo(root);
			files[i].itemRoot=itemRoot;
		}
		dialog.addContent(root).appendTo(document.body);
		dialog.iframe=iframe;
		dialog.root=root;
		return dialog;
	}
	
	function createUploadFormForFS(url,params,file){
		if(params.returnUrl&&params.returnUrl.indexOf("http")==-1){//相对路径
			params.returnUrl=location.protocol +"//"+location.host+"/"+LT.getContextPath()+"/"+params.returnUrl;
		}
		var form = $('<form  method="POST" enctype="multipart/form-data"></form>').attr("action",url).css("display","none");
		var mapping={};
		var copy=file.clone(false);
		var name=params.customUpName||"file";
//		file.attr("id",name);
		file.before(copy);//用克隆的元素占位,上传完毕后移除掉
		file.attr("name",name);
		file.appendTo(form);//必须用选择文件时的那个element，clone的不行,这是浏览器的安全机制
		file.data("copy_element",copy);
		for(var i in params){
			$("<input type='hidden'/>").attr("name",i).val(params[i]).appendTo(form);
		}
		form.data("params",params)
		return form;  
	}
	
	/**
	 * 云盘上传form
	 */
	function createUploadFormForCS(url,params,file){
		if(url.indexOf("?")>0){
			url+="&url="+LT.getBasePath()+"/common/jsp/upload/infomation.html";
		}else{
			url+="?url="+LT.getBasePath()+"/common/jsp/upload/infomation.html";
		}
		var form = $('<form  method="POST" enctype="multipart/form-data"></form>').attr("action",url).css("display","none");
		var mapping={};
		var copy=file.clone(false);
		var name=params.customUpName||"name_"+new Date().getTime();
		file.attr("id",name);
		file.before(copy);//用克隆的元素占位,上传完毕后移除掉
		file.attr("name",name);
		file.appendTo(form);//必须用选择文件时的那个element，clone的不行,这是浏览器的安全机制
		file.data("copy_element",copy);
		var p={};
		p[name]=params;
		$("<input type='hidden'/>").attr("name","params").val(LT.toString(p)).appendTo(form);
		return form;  
	}
	
	function setUploading(file){
		var ir=file.itemRoot;
		ir.find(".lt-upload-image").attr("src",LT.getBasePath()+"/common/images/upload/uploading.png");
		ir.find(".lt-upload-desc").html("正在上传");
		ir.data("uploadStatus","uploading");
	}
	
	function setUploadSuccess(file){
		var ir=file.itemRoot;
		file.uploadSuccess=true;
		ir.find(".lt-upload-image").attr("src",LT.getBasePath()+"/common/images/upload/uploaded.png");
		ir.find(".lt-upload-desc").html("上传完毕");
		ir.data("uploadStatus","success");
	}
	function setUploadFail(file){
		var ir=file.itemRoot;
		ir.find(".lt-upload-image").attr("src",LT.getBasePath()+"/common/images/upload/uploadFail.png");
		ir.find(".lt-upload-desc").html("上传失败");
		ir.data("uploadStatus","fail");
	}
}