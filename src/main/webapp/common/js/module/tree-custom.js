$(function(){

    $('.tree-icon').each(function(){
        $(this).click(function(){

            var childBox=[];
            var treename = $(this).next('.checkbox').children('.label-checkbox').children('input[type=checkbox]').attr('name');
            var treeChildName = $(this).next('.checkbox').children('.label-checkbox').children('input[type=checkbox]').attr('data-child-name');
            var isShow = $('input[name='+treeChildName+']').parent('.label-checkbox').parent('.checkbox').parent('li').css('display');
            //console.log(isShow);
            childBox.push(treeChildName);
            findChild(treeChildName);
            //console.log(childBox);


            $("#treeview-checkable").children("ul").children("li").each(function(){
                var childName = $(this).children('.checkbox').children('.label-checkbox').children('input[type=checkbox]').attr('name');

                for(var i=0;i<childBox.length;i++){
                    if(childBox[i] == childName){
                        if(isShow == 'none'){
                            $(this).css('display','block');
                            var childClass = $(this).children('.tree-icon').children('i').attr('class');
                            //console.log(thisClass);
                            if(childClass.match('fa-plus')){
                                $(this).children('.tree-icon').children('i').removeClass('fa-plus');
                                $(this).children('.tree-icon').children('i').addClass('fa-minus');
                            }
                        }else{
                            $(this).css('display','none');
                        }

                    }
                }

            });
            /*需找子节点*/
            function findChild(childName){
                if(childName){
                    /*需找下一个子节点*/
                    var child = $('input[name = '+childName+']').attr('data-child-name');
                    findChild(child);
                    childBox.push(child);
                }
            }


            //将自己本身的i 的css 切换
            var thisClass = $(this).children('i').attr('class');
            //console.log(thisClass);
            if(thisClass.match('fa-plus')){
                $(this).children('i').removeClass('fa-plus');
                $(this).children('i').addClass('fa-minus');
            }else{
                $(this).children('i').removeClass('fa-minus');
                $(this).children('i').addClass('fa-plus');
            }
        })
    })
});

