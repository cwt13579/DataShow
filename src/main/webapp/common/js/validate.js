$(function(){

    /*
     *  下拉框的事件
     * */
    $('.cms-select-option').children('ul').children('li').each(function(){
        $(this).click(function(){
            var selectHtml = $(this).html();
            $(this).parent('ul').parent('.cms-select-option').parent('.cms-select-box').children('.cms-select-input').children('input').val(selectHtml);
            $(this).parent('ul').parent('.cms-select-option').css('display','none');
        })

    });
    $('.cms-select').focus(function(){
        var isShow = $(this).parent('.cms-select-input').parent('.cms-select-box').children('.cms-select-option').css('display');
        if(isShow == 'none'){
            $(this).parent('.cms-select-input').parent('.cms-select-box').children('.cms-select-option').css('display','block');
        }

    });

});


/*
 *校验表格的
 * */


var validator = {
    chinese:{
        requireText:"此为必填项"
    },
    showError:function(element){
        var errorText = $(element).attr('data-error');
        var iconHtml = '<span class="cms-check-icon"><i class="fa fa-times-circle"></i></span>';
        $(element).addClass('cms-checkFalse');
        $(element).after(iconHtml);
        var errorHtml = '<span class="cms-check-text">'+errorText+'</span>';
        $(element).parent('.cms-check').after(errorHtml);

    },
    showSeverError :function(element){
        var errorText = $(element).attr('data-serverError');
        var iconHtml = '<span class="cms-check-icon"><i class="fa fa-times-circle"></i></span>';
        $(element).addClass('cms-checkFalse');
        $(element).after(iconHtml);
        var errorHtml = '<span class="cms-check-text">'+errorText+'</span>';
        $(element).parent('.cms-check').after(errorHtml);

    },
    showRequire:function(element,type){
        if(type == 'text'){
            var iconHtml = ' <span class="cms-check-icon "><i class="fa fa-asterisk"></i></span>';
            $(element).addClass('cms-checkMust');
            $(element).after(iconHtml);
            var requireHtml =  '<span class="cms-check-text">'+validator.chinese.requireText+'</span>';
            $(element).parent('.cms-check').after(requireHtml);
        }
        if(type == 'select'){
            $(element).addClass('cms-checkMust');
            var requireHtml =  '<span class="cms-check-text">'+validator.chinese.requireText+'</span>';
            $(element).parent('.cms-check').after(requireHtml);
        }
        if(type == 'textarea'){
            $(element).addClass('cms-checkMust');
            var requireHtml =  '<span class="cms-check-text">'+validator.chinese.requireText+'</span>';
            $(element).after(requireHtml);
        }

        if(type == 'checkbox'){
            var requireHtml =  '<span class="cms-check-text">'+validator.chinese.requireText+'</span>';
            var obj = $(element).parent('.cms-label-checkbox').parent('.cms-check').next().hasClass('cms-check-text');
            if(obj){

            }else{
                $(element).parent('.cms-label-checkbox').parent('.cms-check').after(requireHtml);
            }
           /* if(!$(element).parent('.cms-label-checkbox').parent('.cms-check').hasClass('cms-no-check')){
                $(element).parent('.cms-label-checkbox').parent('.cms-check').addClass('cms-no-check')
            }*/
        }
    },
    showTrue:function(element){
        var iconHtml = ' <span class="cms-check-icon"><i class="fa fa-check-circle"></i></span>';
        $(element).addClass('cms-checkTrue');
        $(element).after(iconHtml);
    },
    validate:function(element,form,callback){
        /*清除前面的样式*/
        $(element).removeClass('cms-checkMust');
        $(element).removeClass('cms-checkFalse');
        $(element).removeClass('cms-checkTrue');
        if($(element).next('.cms-check-icon')){
            $(element).next('.cms-check-icon').remove();
        }
        if($(element).parents('.cms-check').next('.cms-check-text')){
            $(element).parents('.cms-check').next('.cms-check-text').remove();
        }

        var hasErrors = 'false';
        var isRequire = $(element).attr('required')? $(element).attr('required'):$(element).attr('data-required');
        var thisValue = '';
        var thisRule = $(element).attr('data-rule');
        var thisServer = $(element).attr('data-server');
        if(thisRule){
            thisRule = eval(thisRule); //将字符串转为正则表达式
        }
         
        /* 单文本框*/
        if ($(element).is('input') && !$(element).hasClass('cms-select') && ($(element).attr('type') == 'text' || $(element).attr('type') == undefined)) {
            thisValue = $(element).val();
            if (isRequire) {
                /*如果是必填项，检验是否为空*/
                if (thisValue.length > 0) {
                    /*不为空，检查是否满足校验要求
                     * */
                    if (thisRule ) {
                        if( ! thisRule.test(thisValue)){
                            //不满足
                            validator.showError(element);
                            hasErrors = 'true';
                        }else{
                        	if(thisServer){
                        		var f = eval(thisServer);
                        		var msg = f();
                        		if(msg.flag){
                        			validator.showTrue(element);
                        		}else{
                        			$(element).attr('data-serverError',msg.msg);
                        			validator.showSeverError(element);
                        		}
                        	}else{
                        		validator.showTrue(element);
                        	}
                        }
                    }else{
                        validator.showTrue(element);
                    }
                } else {
                    /*为空*/
                	hasErrors = 'true';
                    validator.showRequire(element,'text');
                }
            } else {
                /* 不是必填项 */
                if (thisValue.length > 0) {
                    if (thisRule ) {
                        if( ! thisRule.test(thisValue)){
                            //不满足
                            validator.showError(element);
                            hasErrors = 'true';
                        }else{
                            validator.showTrue(element);
                        }
                    }else{
                        validator.showTrue(element);
                    }
                }

            }
        }


        /*密码框*/
        if ( $(element).is('input') && $(element).attr('type') == 'password') {
            thisValue = $(element).val();
            if (isRequire) {
                /*如果是必填项，检验是否为空*/
                if (thisValue.length > 0) {
                    /*不为空，检查是否满足校验要求
                     * */
                    if (thisRule ) {
                        if( ! thisRule.test(thisValue)){
                            //不满足
                            validator.showError(element);
                            hasErrors = 'true';
                        }else{
                            /*如果是重复的密码*/
                           var copyPasswd = $(element).attr('data-copy');
                            if(copyPasswd){
                                if(thisValue === $("#"+copyPasswd+"").val()){
                                    validator.showTrue(element);
                                }else{
                                    validator.showError(element);
                                }
                            }else{
                                validator.showTrue(element);
                            }

                        }
                    }
                } else {
                    /*为空*/
                	hasErrors = 'true';
                    validator.showRequire(element,'text');
                }
            } else {
                /* 不是必填项 */
                if (thisValue.length > 0) {
                    if (thisRule ) {
                        if( ! thisRule.test(thisValue)){
                            //不满足
                            validator.showError(element);
                            hasErrors = 'true';
                        }else{
                            /*如果是重复的密码*/
                            var copyPasswd = $(element).attr('data-copy');
                            if(copyPasswd){
                                if(thisValue === $("#"+copyPasswd+"").val()){
                                    validator.showTrue(element);
                                }else{
                                    validator.showError(element);
                                    hasErrors = 'true';
                                }
                            }else{
                                validator.showTrue(element);
                            }
                        }
                    }else{
                        validator.showTrue(element);
                    }
                }

            }
        }
            /*单选框*/
            // Input[type=radio]
            if ($(element).is('input') && $(element).attr('type') == 'radio') {
            }
            /*多选框*/
            // Input[type=checkbox]
            if ($(element).is('input') && $(element).attr('type') == 'checkbox') {
            	if(isRequire){
            		var checkboxName = $(element).attr('name');
                    var check  =isCheck(checkboxName);
                   if(!check){
                       validator.showRequire(element,'checkbox');
                       hasErrors = 'true';
                   }
                   function isCheck(checkboxName){
                       var isCheck = false;
                       $(form).find('input[name ='+checkboxName+']').each(function(){
                           if($(this).is(':checked')){
                               isCheck = true;
                               return isCheck;

                           }
                       })
                       return isCheck;
                   }
            	} 
            }
            /*选择框*/
            // Select
            if ($(element).is('input') &&$(element).attr('type')== 'text' && $(element).hasClass('cms-select') || $(element).is('select')) {
                thisValue = $(element).val();
                // required
                if(isRequire){
                    if(thisValue == undefined || thisValue == ''){
                        /*必填 为空*/
                        validator.showRequire(element,'select');
                        hasErrors = 'true';
                    }
                }

            }


            /*文本框*/
            if ($(element).is('textarea')) {
                if($(element).next('.cms-check-text')){
                    $(element).next('.cms-check-text').remove();
                }
                thisValue = $(element).val();
                // required
                if(isRequire){
                    if(thisValue == undefined || thisValue == ''){
                        /*必填 为空*/
                        validator.showRequire(element,'textarea');
                        hasErrors = 'true';
                    }
                }
            }
         
        /* return hasErrors;*/
        if(callback){
            callback(hasErrors);
        }

    },
    formClick:function(form){
        var fromIsPass = true;
        var isErrorBox = [];
        //循环每个需要校验的输入框
        $(form).find('input, select, textarea').each(function () {
            /*文本框*/
           var isErrors = validator.validate(this,form,function(data){
               isErrorBox.push(data);
           });
        });
        
        for(var i=0 ;i<isErrorBox.length;i++){
            var iValue = isErrorBox[i];
            if(iValue == 'true'){
                fromIsPass = false;
                return fromIsPass;
            }

        }
        /* 都没有错就返回 true */
        return fromIsPass;
    },
    focusOutF:function(form){
        /*
         * 表单校验，当焦点离开输入框的时候做一次校验
         * */
        $(form).find('input, select, textarea').each(function () {
            $(this).focusout(function(){
                validator.validate(this,form);
            })
        });
    }

}