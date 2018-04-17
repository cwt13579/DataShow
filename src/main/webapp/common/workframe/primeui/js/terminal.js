/**
 * PrimeUI Terminal widget
 */
$(function() {

    $.widget("primeui.puiterminal", {
       
        options: {
            welcomeMessage: '',
            prompt:'prime $',
            handler: null
        },
        
        _create: function() {
            this.element.addClass('pui-terminal ui-widget ui-widget-content ui-corner-all')
                        .append('<div>' + this.options.welcomeMessage + '</div>')
                        .append('<div class="pui-terminal-content"></div>')
                        .append('<div style="position:relative"><span class="pui-terminal-prompt">' + this.options.prompt + '</span>' +
                                 '<div class="pui-terminal-input-div"><textarea class="pui-terminal-input" autocomplete="off"></textarea></div></div>' );
                         
            this.promptContainer = this.element.find('> div:last-child > span.pui-terminal-prompt');
            this.content = this.element.children('.pui-terminal-content');
            this.inputDiv = this.promptContainer.next();
            this.input=this.inputDiv.children();
            this.commands = [];
            this.commandIndex = 0;
            this._justifySize();
            this._bindEvents();
        },
                
        _bindEvents: function() {
            var $this = this;

            this.input.on('keydown.terminal', function(e) {
                var keyCode = $.ui.keyCode;

                switch(e.which) {
                    case keyCode.UP:
                    	if($this.commandIndex==$this.commands.length-1){
                    		$this.curVal=$this.input.val();
                    	}
                        if($this.commandIndex > 0) {
                        	$this.commands[$this.commandIndex]= $this.input.val();
                            $this.input.val($this.commands[--$this.commandIndex]);
                        }

                        e.preventDefault();
                    break;

                    case keyCode.DOWN:
                        if($this.commandIndex < ($this.commands.length - 1)) {
                        	$this.commands[$this.commandIndex]= $this.input.val();
                            $this.input.val($this.commands[++$this.commandIndex]);
                        }
                        else {
                            $this.commandIndex = $this.commands.length-1;
                            $this.input.val($this.curVal);
                        }

                        e.preventDefault();
                    break;

                    case keyCode.ENTER:
                    case keyCode.NUMPAD_ENTER:
                    	if(e.ctrlKey){
                    		$this._processCommand();                    		
                    		e.preventDefault();
                    	}
                    break;
                }
            });        
        },
                
        _processCommand: function() {
            var command = this.input.val();
            this.commands.push(command);
            this.commandIndex++;

            if(this.options.handler && $.type(this.options.handler) === 'function') {
                this.options.handler.call(this, command, this._updateContent); 
            }
        },

        _updateContent: function(content) {
            var commandResponseContainer = $('<div style="overflow-x:hidden"></div>');
            commandResponseContainer.append('<div class="pui-terminal-command">' + this.options.prompt  +  this.input.val() + '</div>')
                                    .append('<div style="color:blue">' + content + '</div>').appendTo(this.content);

            this.input.val('');
            this.element.scrollTop(this.content.height());
            this.commandIndex=this.commands.length;
        },
        
        _justifySize: function(){
        	var me=this;
        	setTimeout(function(){
        		me.inputDiv.css({left:me.promptContainer.width()+2});
        		me.input.focus();
        	});
        },

        clear: function() {
            this.content.html('');
            this.input.val('');
        },
        changePrompt:function(prompt){
        	this.element.find(".pui-terminal-prompt").html(prompt);
        	var me=this;
        	this._justifySize();
        	setTimeout(function(){
        		me.options.prompt=prompt;        		
        	});
        }
    });
});