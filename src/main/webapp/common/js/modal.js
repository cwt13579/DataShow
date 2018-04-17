(function($){
   window.alertModal = function(option,callback){
	   $("#save-btn").removeAttr("disabled");
        var defaults = {
            modalType:'modal_true',
            modalText:'提示语'
        }
        option = $.extend(defaults,option);
        /*拼接页面的html*/
        var html ='<div class="cms-modal" id="cmsModal">'+
            '<div class="cms-modal-black">'+
        '</div>'+
        '<div class="cms-modal-box">'+
        '<div class="cms-modal-head">'+
        '<div class="cms-text-right">';
        if(option.modalType == 'modal_true'){
            //正确的提示
            html = html +
            '<a href="javascript:void(0)" id="cms-close"><i class="fa fa-times"></i></a>'+
            '</div>'+
            '</div>'+
            '<div class="cms-modal-body">'+
            '<div class="cms-body-icon cms-true cms-text-center">'+
            '<img src="../../common/img/true.png" style="margin: 0 auto">'+
            '</div>'+
            '</div>'+
            '<div class="cms-modal-footer">'+
            '<div class="cms-modal-footer-text cms-text-center">'+ option.modalText+ '</div>'+
            '</div>';

        }else if(option.modalType == 'modal_false'){
            //错误的提示
            html = html +
            '<a href="javascript:void(0)" id="cms-close"><i class="fa fa-times"></i></a>'+
            '</div>'+
            '</div>'+
            '<div class="cms-modal-body">'+
            '<div class="cms-body-icon cms-true cms-text-center">'+
            '<img src="../../common/img/flase.png"  style="margin: 0 auto">'+
            '</div>'+
            '</div>'+
            '<div class="cms-modal-footer">'+
            '<div class="cms-modal-footer-text cms-text-center">'+ option.modalText+ '</div>'+
            '</div>';

        }else if(option.modalType == 'modal_confirm'){
            //确定框的提示
            html = html +
            '<a href="javascript:void(0)" id="cms-close"><i class="fa fa-times"></i></a>'+
            '</div>'+
            '</div>'+
            '<div class="cms-modal-body">'+
            '<div class="cms-modal-text cms-text-center">'+ option.modalText+' </div>'+
            '</div>'+
            '<div class="cms-modal-footer cms-text-center cms-btn-box">'+
            '<button class="cms-btn cms-btn-info" id="cms-sure">确定</button>'+
            '<button class="cms-btn cms-btn-default" id="cms-del">取消</button>'+
            '</div>';

        }else if(option.modalType == 'modal_waite'){
            html = html +
            '</div>'+
            '</div>'+
            '<div class="cms-modal-body">'+
            '<div class="cms-body-icon cms-true cms-text-center">'+
            '<img src="../../common/img/loading.gif"   style="margin: 0 auto;width: 60px;margin-top: 35px;">'+
            '</div>'+
            '</div>'+
            '<div class="cms-modal-footer">'+
            '<div class="cms-modal-footer-text cms-text-center">'+ option.modalText+ '</div>'+
            '</div>';

        }
        html = html + ' </div></div>'
       $('body').append(html);

       /*如果是确定框和错误框的，在3秒后自动关闭modal*/
       if(option.modalType == 'modal_true' || option.modalType == 'modal_false' ){
           setTimeout(function(){
               closeModal('notsure')
               if(callback){
                   callback();
               }
           },3000)

       }
       /*关闭modal*/
       $("#cms-close").click(function(){
           closeModal('notsure',isTrue);
           function isTrue(data){
        	   if(callback){
        		   callback(data);
        	   }
              
           }
       });
       $("#cms-sure").click(function(){
           closeModal('sure',isTrue);
           function isTrue(data){
        	   if(callback){
        		   callback(data);
        	   }
               
           }
       })
       $("#cms-del").click(function(){
           closeModal('notsure',isTrue);
           function isTrue(data){
        	   if(callback){
        		   callback(data);
        	   }
               
           }
       });

       /*关闭modal*/
       function closeModal(str,closecallback){
           if(str == 'sure'){
               if(closecallback){
                   closecallback(true);
               }
           }else{
               if(closecallback){
                   closecallback(false);
               }
           }
           $("#cmsModal").fadeOut(1000);
           setTimeout(function(){
               $("#cmsModal").remove();
           },1000)


       }




    }
})(jQuery)