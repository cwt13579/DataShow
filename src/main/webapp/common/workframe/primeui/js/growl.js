/**
 * PrimeFaces Growl Widget
 */
$(function() {

    $.widget("primeui.puigrowl", {
       
        options: {
            sticky: false,
            block:false,
            life: 5000,
            width:300,
            animateTime:"nomal",
            parent:document.body
        },
        setAnimateTime:function(animateTime){
        	this.options.animateTime=animateTime;
        },
        setLife:function(life){
        	this.options.life=life;
        },
        
        setSticky:function(sticky){
        	this.options.sticky=sticky;
        },
        
        setBlock:function(block){
        	this.options.block=block;
        },
        
        setWidth:function(width){
        	this.options.width=width;
        },
        
        close:function(force){
        	if(force||!$(this).data("mouseover")||true){//TODO 鼠标移动到提示框上时不关闭提示框 这个功能有缺陷，暂时屏蔽     		
        		this._removeMessage(this.message,this.bg);
        		return true;
        	}
        	$(this).data("close",true);
        	return false;
        },
        
        
        
        _create: function() {
            var container = this.element;
            
            container.addClass("pui-growl ui-widget").appendTo(this.options.parent);
        },
        
        show: function(msgs) {
            var $this = this;
        
            //this.jq.css('z-index', ++PrimeFaces.zindex);

            this.clear();

            $.each(msgs, function(i, msg) {
                $this._renderMessage(msg);
            }); 
            this.element.css("z-index",9999);
        },
        
        clear: function() {
            this.element.children('div.pui-growl-item-container').remove();
        },
        
        _renderMessage: function(msg) {
        	if(this.bg!=null){
        		this.bg.remove();
        		this.bg=null;
        	}
            var markup = '<div class="pui-growl-item-container ui-state-highlight ui-corner-all ui-helper-hidden" aria-live="polite">';
            markup += '<div class="pui-growl-item pui-shadow">';
            markup += '<div class="pui-growl-icon-close ui-icon ui-icon-closethick" style="display:none"></div>';
            markup += '<span class="pui-growl-image pui-growl-image-' + msg.severity + '" />';
            markup += '<div class="pui-growl-message">';
            markup += '<span class="pui-growl-title">' + msg.summary + '</span>';
            markup += '<p style="word-break:break-all"></p>';
            markup += '</div><div style="clear: both;"></div></div></div>';
            var message = $(markup);
            message.find(".pui-growl-message").css("width",this.options.width-80);
            message.find("p").append(msg.detail);
            $(this.element).css("width",this.options.width);
            this.message=message;
            var bg=null;
            if(this.options.block){
            	this.bg=bg=$("<div style='z-index:9998;position:fixed;top:0px;left:0px;width:100%;height:100%;background-color:gray;'></div>")
            	.css("opacity",0.2).appendTo(this.options.parent);
            }
            this._bindMessageEvents(message,bg);
            if(this.options.animateTime!=0){
            	  message.appendTo(this.element).fadeIn(this.options.animateTime);
            }else{
            	 message.appendTo(this.element).show();
            }
          
        },
        
        _removeMessage: function(message,bg) {
        	if(this.options.animateTime!=0){
        		 message.fadeTo(this.options.animateTime, 0, function() {
//                     message.slideUp('normal', 'easeInOutCirc',0, function() {            
                         message.remove();
//                     });
                 });
        	}else{
        		 message.remove();
        	}    	        
            if(bg){
               bg.remove();
            }

        },
        
        _bindMessageEvents: function(message,bg) {
        	$(this).data("notHide",false);
        	$(this).data("shouldHide",false);
            var $this = this,
            sticky = this.options.sticky;

            message.on('mouseover.puigrowl', function() {
                var msg = $(this);

                if(!msg.is(':animated')) {
                    msg.find('div.pui-growl-icon-close:first').show();
                }
                $($this).data("mouseover",true);
            })
            .on('mouseout.puigrowl', function(evt) {   
				var evt = evt || window.event;
				var s = evt.toElement || evt.relatedTarget;
				if (this.contains(s)) {
					return;
				}
                $(this).find('div.pui-growl-icon-close:first').hide();
                if($($this).data("close")){               	
                	$this._removeMessage(message,bg);
                }
                $($this).data("mouseover",false);
            });

            //remove message on click of close icon
            message.find('div.pui-growl-icon-close').on('click.puigrowl',function() {
                $this._removeMessage(message,bg);
                if(!sticky) {
                    clearTimeout(message.data('timeout'));
                }
            });

            if(!sticky) {
                this._setRemovalTimeout(message,bg);
            }
        },
        
        _setRemovalTimeout: function(message,bg) {
            var $this = this;

            var timeout = setTimeout(function() {
            	if($($this).data("notHide")){
            		$($this).data("shouldHide",true);
            		return;
            	}
                $this._removeMessage(message,bg);
            }, this.options.life);

            message.data('timeout', timeout);
        }
    });
});