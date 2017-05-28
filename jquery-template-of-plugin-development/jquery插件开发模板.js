;(function($){
    
    
    $.fn.extend({
        
        pluginName1 : function(options){
          
            var defaults = {
              //key : vallue,
            };
            
            var options = $.extend(defaults, options);
            
            var _this = $(this);
            
            return this.each(function(){
                
                alert('1111');
                //coding...
                
            });
            
        },
        
        pluginName2 : function(options){
          
            var defaults = {
              //key : vallue,  
            };
            
            var options = $.extend(defaults, options);
            
            var _this = $(this);
            
            return this.each(function(){
                
                alert('2222');
                //coding...
                
            });
            
        },
        
        
    });
    
    
})(jQuery);
