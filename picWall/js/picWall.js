
;(function($){


    $.fn.extend({
        
        picWall : function(options){
            
            var defaults = {
                picURL : '',
                selected : 0,
                clickCbk : function(){alert('clickCbk()')},
                deleteYesCbk : function(){alert('deleteYesCbk()')},
                deleteNoCbk : function(){alert('deleteNoCbk()')},
            };
            
            var options = $.extend(defaults, options);
            
            var _this = $(this);
            
            var timeout;
            
            return this.each(function(e){
                
                var _picContentDiv = $('<div class="picContentDiv"></div>');
                
                var _img = $('<img src="" width="100%" height="100%"/>');
                _img.attr('src', options.picURL);
                _picContentDiv.append(_img);
                
                var _selectIcon = $('<span class="selectIcon">√</span>');
                _selectIcon.addClass('picUnselectedIcon selectIconHidden');
                _picContentDiv.append(_selectIcon);
                
                var _shadowMask = $('<span class="shadowMask"></span>');
                _shadowMask.addClass('picUnselectedMask');
                _picContentDiv.append(_shadowMask);
                
                var _selectedFlag = $('<span class="selectedFlag"></span>');
                _selectedFlag.text(options.selected);
                _picContentDiv.append(_selectedFlag);
                
                _this.append(_picContentDiv);
                 
                
                //添加底部菜单栏
                var _picMenuBar = $('<div class="picMenuBar"></div>');
                var _btnDelete = $('<span class="btnDelete">删 除</span>');
                _picMenuBar.append(_btnDelete);
                var _btnSelectAll = $('<span class="btnSelectAll">全 选</span>');
                _picMenuBar.append(_btnSelectAll);
                var _btnCancel = $('<span class="btnCancel">取 消</span>');
                _picMenuBar.append(_btnCancel);
                _picMenuBar.addClass('picMenuBarHidden');
                $("body").append(_picMenuBar);
                
                
                //点击删除按钮触发事件
                _btnDelete.on('click', function(){
                     var flag = 0;
                     for(var i=0; i<$('.selectedFlag').length; i++){
                         if($($('.selectedFlag')[i]).text() == 0){
                             continue;
                         }else if($($('.selectedFlag')[i]).text() == 1){
                             flag = 1;
                             break;
                         }
                     }
                     // alert(flag);
                     if(flag == 0){
                         //alert('请选择要删除的图片');
                         options.deleteNoCbk();
                     }else{
                         options.deleteYesCbk();
                     }
                });
                
                //点击全选按钮触发事件
                _btnSelectAll.on('click', function(){
                    
                    if($(this).text() == '全 选'){
                        $(this).text('反 选');
                        // $(this).css('fontSize', '0.3rem');
                        $('.selectIcon').removeClass('selectIconHidden picUnselectedIcon').addClass('selectIconShow picSelectedIcon');
                        $('.shadowMask').removeClass('picUnselectedMask').addClass('picSelectedMask');
                        $('.selectedFlag').text(1);
                    }else{
                        $(this).text('全 选');
                        // $(this).css('fontSize', '0.4rem');
                        $('.selectIcon').removeClass('selectIconHidden picSelectedIcon').addClass('selectIconShow picUnselectedIcon');
                        $('.shadowMask').removeClass('picSelectedMask').addClass('picUnselectedMask');
                        $('.selectedFlag').text(0);
                        
                    }
                });
               
                //点击取消按钮触发事件
                _btnCancel.on('click', function(){
                    $('.selectIcon').removeClass('selectIconShow picSelectedIcon').addClass('selectIconHidden picUnselectedIcon');
                    $('.shadowMask').removeClass('picSelectedMask').addClass('picUnselectedMask');
                    _picMenuBar.removeClass('picMenuBarShow').addClass('picMenuBarHidden');
                    //_btnSelectAll.text('全 选').css('fontSize', '0.4rem');
                    _btnSelectAll.text('全 选');
                });
                
                
                
                //单击图片
                _picContentDiv.on('click', function(){
                    if(!!$(this).find('.selectIcon').hasClass('selectIconHidden')){
                        options.clickCbk();
                    }else{
                        if(!!$(this).find('.selectIcon').hasClass('picUnselectedIcon')){   
                            //选中
                            $(this).find('.selectIcon').removeClass('picUnselectedIcon').addClass('picSelectedIcon');
                            $(this).find('.shadowMask').removeClass('picUnselectedMask').addClass('picSelectedMask');
                            $(this).find('.selectedFlag').text(1);
                            // alert($(this).find('.selectedFlag').text());
                        }else{
                            //取消选中
                            $(this).find('.selectIcon').removeClass('picSelectedIcon').addClass('picUnselectedIcon');
                            $(this).find('.shadowMask').removeClass('picSelectedMask').addClass('picUnselectedMask');
                            $(this).find('.selectedFlag').text(0);
                            // alert($(this).find('.selectedFlag').text());
                            $(".btnSelectAll").text('全 选');
                            
                        }
                    }
                    return false;   

                });
                
                //长按图片
                _picContentDiv.on('mousedown', function(){
                    var thisDiv = $(this);
                    timeout = setTimeout(function(){
                        if(!!thisDiv.find('.selectIcon').hasClass('selectIconHidden')){
                            //显示所有图标并置于未选中状态
                            $('.selectIcon').removeClass('selectIconHidden picSelectedIcon').addClass('selectIconShow picUnselectedIcon');
                            $('.shadowMask').removeClass('picSelectedMask').addClass('picUnselectedMask');
                            _picMenuBar.removeClass('picMenuBarHidden').addClass('picMenuBarShow');
                        }else{
                            //否则不触发长按事件
                            return false;
                        }
                                                
                    }, 200);
                });
                _picContentDiv.on('mouseup', function(){
                    clearTimeout(timeout);
                });
                _picContentDiv.on('mouseout', function(){
                    clearTimeout(timeout);
                });
               
                //点击图标事件, _selectIcon与 $(".selectIcon")的区别 ??
                _selectIcon.on('click', function(e){
                    if(!!$(this).hasClass('picSelectedIcon')){
                        //置于未选中状态
                        $(this).removeClass('picSelectedIcon').addClass('picUnselectedIcon');
                        $(this).siblings(".shadowMask").removeClass('picSelectedMask').addClass('picUnselectedMask');
                        $(this).siblings('.selectedFlag').text(0);
                        // alert($(this).siblings('.selectedFlag').text());
                        $(".btnSelectAll").text('全 选');
                    }else{
                        //置于选中状态
                        $(this).removeClass('picUnselectedIcon').addClass('picSelectedIcon');
                        $(this).siblings(".shadowMask").removeClass('picUnselectedMask').addClass('picSelectedMask');
                        $(this).siblings('.selectedFlag').text(1);
                        // alert($(this).siblings('.selectedFlag').text());
                    }
                    return false;
                });
                
            });
            
        },
        
    });

    
})(jQuery);





                                              /****** 2016-10-16 * DESIGN BY LI KUN ******/
