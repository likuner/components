;(function($){
    
    $.fn.extend({
        
        dateTimeBar : function(options){
            
            var defaults = {
                date : true,
                time : true,
                week : true,             
            };
            
            var options = $.extend(defaults , options);
            
            var _this = $(this);
            
            var numFormat = function(num){
                if(num==undefined || num==null || isNaN(num)==true){
                    return;
                }else if(num>9){
                    return num;
                }else{
                    return '0'+num;
                }
            };
            
            var milliFormat = function(num){
                if(num==undefined || num==null || isNaN(num)==true){
                    return;
                }else if(num <= 9){
                    return num;
                }else if(num > 9 && num <= 99){
                    return Math.floor((num/10));
                }else if(num > 99){
                    return Math.floor((num/100));
                }
            };
            
            return this.each(function(){
                
                setInterval(function(){
                    
                    var now = new Date();
                    
                    var _year = now.getFullYear();
                    var _month = now.getMonth()+1;
                    var _day = numFormat(now.getDate());
                    var _hour = numFormat(now.getHours());
                    var _minute = numFormat(now.getMinutes());
                    var _second = numFormat(now.getSeconds());
                    var _mSecond = milliFormat(now.getMilliseconds());
                    var n = now.getDay();
                    
                      var _week =['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']; //_week[n]为当天星期
                    
//                  var _week =['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
                
                    var dateStr = _year + '年' + _month + '月' + _day + '日';
//                  var timeStr = _hour + ':' + _minute + ':' + _second + ':' + _mSecond;
                    var timeStr = _hour + ':' + _minute + ':' + _second;
                    var weekStr = '❤'+_week[n];
                    
                    if(options.date == true && options.time == false && options.week == true){
                        _this.text( dateStr + ' ' + weekStr );
                        
                    }else if(options.date == true && options.time == true && options.week == false){
                        _this.text( dateStr + ' ' + timeStr );
                        
                    }else if(options.date == false && options.time == true && options.week == true){
                        _this.text( timeStr + ' ' + weekStr );
                        
                    }else if(options.date == true && options.time == false && options.week == false){
                        _this.text( dateStr );
                        
                    }else if(options.date == false && options.time == true && options.week == false){
                        _this.text( timeStr );
                        
                    }else if(options.date == false && options.time == false && options.week == true){
                        _this.text( weekStr );
                        
                    }else{
                        _this.text( dateStr + ' ' + timeStr + ' ' + weekStr );
                    }
                    
                }, 100);

            });
            
        },
        
    });
    
        
})(jQuery);
