;(function($){

	$.fn.tab = function(options){
		var defaults = {
			curNavClass : 'curNav',
			eventType : 'click',
			curTabNav :  '.tabNav>li',
			curTabContent : '.tabContent>div'
		};

		var options = $.extend(defaults , options);

		this.each(function(){

			var _this = $(this);
			_this.find(options.curTabNav).on(options.eventType, function(){
				$(this).addClass(options.curNavClass).siblings().removeClass(options.curNavClass);
				var curIndex = $(this).index();
				_this.find(options.curTabContent).eq(curIndex).stop().show().siblings().stop().hide();
			});
			
		});
	}

})(jQuery);