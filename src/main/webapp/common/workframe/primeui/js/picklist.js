/**
 * PrimeUI picklist widget
 */
$(function() {

    $.widget("primeui.puipicklist", {
       
        options: {
            effect: 'fade',
            effectSpeed: 'fast',
            sourceCaption: null,
            targetCaption: null,
            filter: false,
            filterFunction: null,
            filterMatchMode: 'startsWith',
            dragdrop: true,
            sourceData: null,
            targetData: null,
            clickItem:null,
            content: null,
            showMiddleButtons:false,  //chender
            showSourceControls:false  ,//chender
            showTargetControls:false  //chender
        },
        
        setSourceCaption:function(param){//chender
        	$(".pui-picklist-source  .pui-picklist-caption").html(param);
        },
        
        setTargetCaption:function(param){//chender
        	$(".pui-picklist-target  pui-picklist-caption").html(param);
        },
        
        removeSourceItems:function(){//chender
        	var select=this.element.find(".ui-helper-hidden > select:eq(0)");
        	var ul=this.element.find(".pui-picklist-source > .pui-picklist-list");
        	select.empty();
        	ul.empty();
        },
        removeTargetItems:function(){//chender
        	var select=this.element.find(".ui-helper-hidden > select:eq(1)");
        	var ul=this.element.find(".pui-picklist-target > .pui-picklist-list");
        	select.empty();
        	ul.empty();
        },
        
        getTargetSelectedItems:function(){//chender
        	return this.element.find(".pui-picklist-target > .pui-picklist-list > li").filter(".ui-state-highlight");
        },
        
        addSourceItems:function(items,noTran){//chender
        	var select=this.element.find(".ui-helper-hidden > select:eq(0)");
        	var ul=this.element.find(".pui-picklist-source > .pui-picklist-list");
        	var $this=this;
        	var array=$();
        	var existItems= $("#propertyPick").find(".pui-picklist-item > div");
        	var temp=new Object();
        	for(var i=0;i<existItems.length;i++){
        		temp[$(existItems[i]).attr("propertyId")]=true;
        	}
        	$.each(items,function(i){
        		if(temp[items[i].propertyId]){
        			return;
        		}
        		select.append('<option value="' + items[i] + '">' + items[i] + '</option>');
            	var content = $this.options.content ? $this.options.content.call(this, items[i],i,"source") : items[i];
            	var item=$('<li class="pui-picklist-item ui-corner-all">' + content + '</li>').data("data",items[i]);
            	item.attr("location","source");
            	ul.append(item);
            	array=array.add(item);
        	});
        	$this._bindEvents(array,noTran);
        },
        
        addTargetItems:function(items,noTran){//chender
        	//chender
        	var select=this.element.find(".ui-helper-hidden > select:eq(0)");
        	var ul=this.element.find(".pui-picklist-target > .pui-picklist-list");
        	var $this=this;
        	var array=$();
        	$.each(items,function(i){
        		select.append('<option value="' + items[i] + '">' + items[i] + '</option>');
            	var content = $this.options.content ? $this.options.content.call(this, items[i],i,"target") : items[i];
            	var item=$('<li class="pui-picklist-item ui-corner-all">' + content + '</li>').data("data",items[i]);
            	item.attr("location","target");
            	ul.append(item);
            	array=array.add(item);
        	});
        	$this._bindEvents(array,noTran);
        
        },

        _create: function() {
            this.element.uniqueId().addClass('pui-picklist ui-widget ui-helper-clearfix');
            this.inputs = this.element.children('select');
//            this.items = $();
            this.sourceInput = this.inputs.eq(0);
            this.targetInput = this.inputs.eq(1);
            
            if(this.options.sourceData) {
                this._populateInputFromData(this.sourceInput, this.options.sourceData);
            }
            
            if(this.options.targetData) {
                this._populateInputFromData(this.targetInput, this.options.targetData);
            }
                        
            this.sourceList = this._createList(this.sourceInput, 'pui-picklist-source', this.options.sourceCaption, this.options.sourceData);
            if(this.options.showMiddleButtons){
            this._createButtons();
            }
            this.targetList = this._createList(this.targetInput, 'pui-picklist-target', this.options.targetCaption, this.options.targetData);
            
            if(this.options.showSourceControls) {
                this.element.prepend(this._createListControls(this.sourceList));
            }
            
            if(this.options.showTargetControls) {
                this.element.append(this._createListControls(this.targetList));
            }
        },
                
        _populateInputFromData: function(input, data) {
            for(var i = 0; i < data.length; i++) {
                var choice = data[i];
                if(choice.label)
                    input.append('<option value="' + choice.value + '">' + choice.label + '</option>');
                else
                    input.append('<option value="' + choice + '">' + choice + '</option>');
            }
        },
                
        _createList: function(input, cssClass, caption, data) {
            input.wrap('<div class="ui-helper-hidden"></div>');
                        
            var listWrapper = $('<div class="pui-picklist-listwrapper ' + cssClass + '"></div>'),
            listContainer = $('<ul class="ui-widget-content pui-picklist-list pui-inputtext"></ul>'),
            choices = input.children('option');
    
            if(this.options.filter) {
                listWrapper.append('<div class="pui-picklist-filter-container"><input type="text" class="pui-picklist-filter" /><span class="ui-icon ui-icon-search"></span></div>');
                listWrapper.find('> .pui-picklist-filter-container > input').puiinputtext();
            } 
    
            if(caption) {
                listWrapper.append('<div class="pui-picklist-caption ui-widget-header ui-corner-tl ui-corner-tr">' + caption + '</div>');
                listContainer.addClass('ui-corner-bottom');
            }
            else {
                listContainer.addClass('ui-corner-all');
            }
            var items=$();
            for(var i = 0; i < choices.length; i++) {
                var choice = choices.eq(i),
                content = this.options.content ? this.options.content.call(this, data[i]) : choice.text(),
                item = $('<li class="pui-picklist-item ui-corner-all">' + content + '</li>').data({
                    'item-label': choice.text(),
                    'item-value': choice.val()
                });
                if(cssClass=="pui-picklist-source"){
                	  item.attr("location","source");
                	  items=items.add(item);             	 
                }else{
                	  item.attr("location","target");
                	  items=items.add(item);
                }
                listContainer.append(item);
            }     
            
            this._bindEvents(items);
            this._bindEvents(items);
            
            listWrapper.append(listContainer).appendTo(this.element);       
            return listContainer;
        },
                
        _createButtons: function() {
            var $this = this,
            buttonContainer = $('<ul class="pui-picklist-buttons"></ul>');
            
            buttonContainer.append(this._createButton('ui-icon-arrow-1-e', 'pui-picklist-button-add', function(){$this._add();}))
                            .append(this._createButton('ui-icon-arrowstop-1-e', 'pui-picklist-button-addall', function(){$this._addAll();}))
                            .append(this._createButton('ui-icon-arrow-1-w', 'pui-picklist-button-remove', function(){$this._remove();}))
                            .append(this._createButton('ui-icon-arrowstop-1-w', 'pui-picklist-button-removeall', function(){$this._removeAll();}));
                    
            this.element.append(buttonContainer);
        },
                
        _createListControls: function(list) {
            var $this = this,
            buttonContainer = $('<ul class="pui-picklist-buttons"></ul>');
            
            buttonContainer.append(this._createButton('ui-icon-arrow-1-n', 'pui-picklist-button-move-up', function(){$this._moveUp(list);}))
                            .append(this._createButton('ui-icon-arrowstop-1-n', 'pui-picklist-button-move-top', function(){$this._moveTop(list);}))
                            .append(this._createButton('ui-icon-arrow-1-s', 'pui-picklist-button-move-down', function(){$this._moveDown(list);}))
                            .append(this._createButton('ui-icon-arrowstop-1-s', 'pui-picklist-button-move-bottom', function(){$this._moveBottom(list);}));
                    
            return buttonContainer;
        },
                
        _createButton: function(icon, cssClass, fn) {
            var btn = $('<button class="' + cssClass + '" type="button"></button>').puibutton({
                'icon': icon,
                'click': function() {
                    fn();
                    $(this).removeClass('ui-state-hover ui-state-focus');
                }

            });
            
            return btn;
        },
                
        _bindEvents: function(items,noTran) {
            var $this = this;
            items.on('mouseover.puipicklist', function(e) {
                var element = $(this);

                if(!element.hasClass('ui-state-highlight')) {
                    $(this).addClass('ui-state-hover');
                }
            })
            .on('mouseout.puipicklist', function(e) {
                $(this).removeClass('ui-state-hover');
            })
            .on('click.puipicklist', function(e) { 
                var item = $(this),
                metaKey = (e.metaKey||e.ctrlKey);
                
            	if($this.options.clickItem){
            		$this.options.clickItem.call(this, item);	
            	}
                
                if(!e.shiftKey) {
                    if(!metaKey) {
                        $this.unselectAll();
                    }

                    if(metaKey && item.hasClass('ui-state-highlight')) {
                        $this.unselectItem(item);
                    } 
                    else {
                        $this.selectItem(item);
                        $this.cursorItem = item;
                    }
                }
                else {
                    $this.unselectAll();

                    if($this.cursorItem && ($this.cursorItem.parent().is(item.parent()))) {
                        var currentItemIndex = item.index(),
                        cursorItemIndex = $this.cursorItem.index(),
                        startIndex = (currentItemIndex > cursorItemIndex) ? cursorItemIndex : currentItemIndex,
                        endIndex = (currentItemIndex > cursorItemIndex) ? (currentItemIndex + 1) : (cursorItemIndex + 1),
                        parentList = item.parent();

                        for(var i = startIndex ; i < endIndex; i++) {
                            $this.selectItem(parentList.children('li.ui-picklist-item').eq(i));
                        }
                    }
                    else {
                        $this.selectItem(item);
                        $this.cursorItem = item;
                    }
                }
            })
            .on('dblclick.pickList', function() {
            	if(noTran){
            		return;
            	}
                var item = $(this);

                if($(this).closest('.pui-picklist-listwrapper').hasClass('pui-picklist-source')){
                    $this._transfer(item, $this.sourceList, $this.targetList, 'dblclick');               
                }
                else{
                    $this._transfer(item, $this.targetList, $this.sourceList, 'dblclick');
                }
                PUI.clearSelection();
            });
            
            if(this.options.filter) {
                this._setupFilterMatcher();
                
                this.element.find('> .pui-picklist-source > .pui-picklist-filter-container > input').on('keyup', function(e) {
                    $this._filter(this.value, $this.sourceList);
                });

                this.element.find('> .pui-picklist-target > .pui-picklist-filter-container > input').on('keyup', function(e) {
                    $this._filter(this.value, $this.targetList);
                });
            }
            
            if(this.options.dragdrop) {  
                this.element.find('> .pui-picklist-listwrapper > ul.pui-picklist-list').sortable({
                    cancel: '.ui-state-disabled',
                    connectWith: '#' + this.element.attr('id') + ' .pui-picklist-list',
                    revert: true,
                    containment: this.element,
                    update: function(event, ui) {
                        $this.unselectItem(ui.item);
                        $this._saveState();
                    },
                    receive: function(event, ui) {
                        $this._triggerTransferEvent(ui.item, ui.sender, ui.item.closest('ul.pui-picklist-list'), 'dragdrop');
                        if(ui.item.attr("location")=="source"){
                        	 ui.item.attr("location","target");
                        }else{
                        	 ui.item.attr("location","source");
                        }
                    }
                });
            	if(noTran){
          		  this.element.find('> .pui-picklist-listwrapper > ul.pui-picklist-list')
          		  .sortable('option','containment',"parent");
          		return;
          	}
            }
        },
                
        selectItem: function(item) {
            item.removeClass('ui-state-hover').addClass('ui-state-highlight');
        },

        unselectItem: function(item) {
            item.removeClass('ui-state-highlight');
        },

        unselectAll: function() {
            var selectedItems = $("#propertyPick").find(".ui-state-highlight");
            for(var i = 0; i < selectedItems.length; i++) {
                this.unselectItem(selectedItems.eq(i));
            }
        },
                
        _add: function() {
            var items = this.sourceList.children('li.pui-picklist-item.ui-state-highlight');

            this._transfer(items, this.sourceList, this.targetList, 'command');
        },

        _addAll: function() {
            var items = this.sourceList.children('li.pui-picklist-item:visible:not(.ui-state-disabled)');

            this._transfer(items, this.sourceList, this.targetList, 'command');
        },

        _remove: function() {
            var items = this.targetList.children('li.pui-picklist-item.ui-state-highlight');

            this._transfer(items, this.targetList, this.sourceList, 'command');
        },

        _removeAll: function() {
            var items = this.targetList.children('li.pui-picklist-item:visible:not(.ui-state-disabled)');

            this._transfer(items, this.targetList, this.sourceList, 'command');
        },
                
        _moveUp: function(list) {
            var $this = this,
            animated = $this.options.effect,
            items = list.children('.ui-state-highlight'),
            itemsCount = items.length,
            movedCount = 0;

            items.each(function() {
                var item = $(this);
                
                if(!item.is(':first-child')) {
                    if(animated) {
                        item.hide($this.options.effect, {}, $this.options.effectSpeed, function() {
                            item.insertBefore(item.prev()).show($this.options.effect, {}, $this.options.effectSpeed, function() {
                                movedCount++;

                                if(movedCount === itemsCount) {
                                    $this._saveState();
                                }
                            });
                        });
                    }
                    else {
                        item.hide().insertBefore(item.prev()).show();
                    }

                }
            });

            if(!animated) {
                this._saveState();
            }

        },

        _moveTop: function(list) {
            var $this = this,
            animated = $this.options.effect,
            items = list.children('.ui-state-highlight'),
            itemsCount = items.length,
            movedCount = 0;

            list.children('.ui-state-highlight').each(function() {
                var item = $(this);

                if(!item.is(':first-child')) {
                    if(animated) {
                        item.hide($this.options.effect, {}, $this.options.effectSpeed, function() {
                            item.prependTo(item.parent()).show($this.options.effect, {}, $this.options.effectSpeed, function(){
                                movedCount++;

                                if(movedCount === itemsCount) {
                                    $this._saveState();
                                }
                            });
                        });
                    }
                    else {
                        item.hide().prependTo(item.parent()).show();
                    }
                }
            });

            if(!animated) {
                this._saveState();
            }
        },

        _moveDown: function(list) {
            var $this = this,
            animated = $this.options.effect,
            items = list.children('.ui-state-highlight'),
            itemsCount = items.length,
            movedCount = 0;

            $(list.children('.ui-state-highlight').get().reverse()).each(function() {
                var item = $(this);

                if(!item.is(':last-child')) {
                    if(animated) {
                        item.hide($this.options.effect, {}, $this.options.effectSpeed, function() {
                            item.insertAfter(item.next()).show($this.options.effect, {}, $this.options.effectSpeed, function() {
                                movedCount++;

                                if(movedCount === itemsCount) {
                                    $this._saveState();
                                }
                            });
                        });
                    }
                    else {
                        item.hide().insertAfter(item.next()).show();
                    }
                }

            });

            if(!animated) {
                this._saveState();
            }
        },

        _moveBottom: function(list) {
            var $this = this,
            animated = $this.options.effect,
            items = list.children('.ui-state-highlight'),
            itemsCount = items.length,
            movedCount = 0;

            list.children('.ui-state-highlight').each(function() {
                var item = $(this);

                if(!item.is(':last-child')) {

                    if(animated) {
                        item.hide($this.options.effect, {}, $this.options.effectSpeed, function() {
                            item.appendTo(item.parent()).show($this.options.effect, {}, $this.options.effectSpeed, function() {
                                movedCount++;

                                if(movedCount === itemsCount) {
                                    $this._saveState();
                                }
                            });
                        });
                    }
                    else {
                        item.hide().appendTo(item.parent()).show();
                    }
                }

            });

            if(!animated) {
                this._saveState();
            }
        },
                
        _transfer: function(items, from, to, type) {  
            var $this = this,
            itemsCount = items.length,
            transferCount = 0;
            if(this.options.effect) {
                items.hide(this.options.effect, {}, this.options.effectSpeed, function() {
                    var item = $(this);
                    $this.unselectItem(item);

                    item.appendTo(to).show($this.options.effect, {}, $this.options.effectSpeed, function() {
                        transferCount++;

                        if(transferCount === itemsCount) {
                            $this._saveState();
                            $this._triggerTransferEvent(items, from, to, type);
                        }
                       if(item.attr("location")=="source"){
                    	   item.attr("location","target");  	 
                       }else{
                    	   item.attr("location","source");
                       }
                    });
                });
            }
            else {
                items.hide().removeClass('ui-state-highlight ui-state-hover').appendTo(to).show();

                this._saveState();
                this._triggerTransferEvent(items, from, to, type);
            }
        },
        

        _triggerTransferEvent: function(items, from, to, type) {
            var obj = {};
            obj.items = items;
            obj.from = from;
            obj.to = to;
            obj.type = type;

            this._trigger('transfer', null, obj);
        },
                
        _saveState: function() {
            this.sourceInput.children().remove();
            this.targetInput.children().remove();

            this._generateItems(this.sourceList, this.sourceInput);
            this._generateItems(this.targetList, this.targetInput);
            this.cursorItem = null;
        },
                
        _generateItems: function(list, input) {   
            list.children('.pui-picklist-item').each(function() {
                var item = $(this),
                itemValue = item.data('item-value'),
                itemLabel = item.data('item-label');

                input.append('<option value="' + itemValue + '" selected="selected">' + itemLabel + '</option>');
            });
        },
                
        _setupFilterMatcher: function() {
            this.filterMatchers = {
                'startsWith': this._startsWithFilter,
                'contains': this._containsFilter,
                'endsWith': this._endsWithFilter,
                'custom': this.options.filterFunction
            };

            this.filterMatcher = this.filterMatchers[this.options.filterMatchMode];
        },
                
        _filter: function(value, list) {
            var filterValue = $.trim(value).toLowerCase(),
            items = list.children('li.pui-picklist-item');

            if(filterValue === '') {
                items.filter(':hidden').show();
            }
            else {
                for(var i = 0; i < items.length; i++) {
                    var item = items.eq(i),
                    itemLabel = item.data('item-label');

                    if(this.filterMatcher(itemLabel, filterValue))
                        item.show();
                    else 
                        item.hide();                    
                }
            }
        },

        _startsWithFilter: function(value, filter) {
            return value.toLowerCase().indexOf(filter) === 0;
        },

        _containsFilter: function(value, filter) {
            return value.toLowerCase().indexOf(filter) !== -1;
        },

        _endsWithFilter: function(value, filter) {
            return value.indexOf(filter, value.length - filter.length) !== -1;
        }
    });
        
});