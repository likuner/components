;(function($){
	
	$.fn.extend({
		
		imgVision : function(opts){
			
			var defaults = {
				imgs : [
					{imgUrl:"img/jd1.jpg"},
					{imgUrl:"img/jd2.jpg"},
					{imgUrl:"img/jd3.jpg"},
					{imgUrl:"img/jd4.jpg"},
					{imgSee:"", imgUrl:"img/jd5.jpg"}
				],
				flag : 0
				
			};
			var opts = $.extend(defaults, opts);
			$this = $(this);
			
			return this.each(function(){
				
				if(opts.imgs != undefined && opts.imgs != null && opts.imgs != [] && opts.imgs instanceof Array){
					var arr = opts.imgs;
					var $imgcontainer = $('<div class="imgcontainer"></div>');
					var $arrowleft = $('<div class="arrowleft"><</div>');
					var $arrowright = $('<div class="arrowright">></div>');
					var $imgdot = $('<div class="imgdot"></div>');
					$this.append($imgcontainer).append($arrowleft).append($arrowright).append($imgdot);
					
//					$imgdot.css("margin-left", "-50px");
					
					for(var i=0; i<arr.length; i++){
						var $imgsingle = $('<div class="imgsingle"></div>');
						var $a = $('<a></a>');
						var $img = $('<img width="100%" height="100%"/>');
						var $span = $('<span></span>');
						if(i==0){
							$imgsingle.show();
							$span.addClass("on");
						}else{
							$span.addClass("off");
						}
						$imgdot.append($span);
						if(arr[i].imgSee != undefined && arr[i].imgSee != null && arr[i].imgSee !=""){
							$a.attr("href", arr[i].imgSee);
						}else{
							$a.attr("href", "##");
						}
						$img.attr("src", arr[i].imgUrl);
						$a.append($img);
						$imgsingle.append($a);
						$imgcontainer.append($imgsingle);
						
						$imgsingle.hover(function(){
							clearInterval(timer);
							$arrowleft.stop().show();
							$arrowright.stop().show();
						},function(){
							$arrowleft.stop().hide();
							$arrowright.stop().hide();
							timer = setInterval(function(){
								opts.flag++;
								if(opts.flag==$(".imgsingle").length){
									opts.flag=0;
								}
								$(".imgsingle").eq(opts.flag).stop().fadeIn(400).siblings().stop().fadeOut(400);
								$(".imgdot span").eq(opts.flag).removeClass("off").addClass("on").siblings().removeClass("on").addClass("off");
							}, 3000);
						});
						
					}
					
					var timer = setInterval(function(){
						opts.flag++;
						if(opts.flag==$(".imgsingle").length){
							opts.flag=0;
						}
						$(".imgsingle").eq(opts.flag).stop().fadeIn(400).siblings().stop().fadeOut(400);
						$(".imgdot span").eq(opts.flag).removeClass("off").addClass("on").siblings().removeClass("on").addClass("off");
					}, 3000);
					
					$(".arrowleft, .arrowright").hover(function(){
						clearInterval(timer);
						$arrowleft.stop().show();
						$arrowright.stop().show();
					},function(){
						$arrowleft.stop().hide();
						$arrowright.stop().hide();
						timer = setInterval(function(){
							opts.flag++;
							if(opts.flag==$(".imgsingle").length){
								opts.flag=0;
							}
							$(".imgsingle").eq(opts.flag).stop().fadeIn(400).siblings().stop().fadeOut(400);
							$(".imgdot span").eq(opts.flag).removeClass("off").addClass("on").siblings().removeClass("on").addClass("off");
						}, 3000);
					});
					$arrowleft.click(function(){
						opts.flag--;
						if(opts.flag==-1){
							opts.flag=$(".imgsingle").length-1;
						}
						$(".imgsingle").eq(opts.flag).stop().fadeIn(400).siblings().stop().fadeOut(400);
						$(".imgdot span").eq(opts.flag).removeClass("off").addClass("on").siblings().removeClass("on").addClass("off");
					});
					$arrowright.click(function(){
						opts.flag++;
						if(opts.flag==$(".imgsingle").length){
							opts.flag=0;
						}
						$(".imgsingle").eq(opts.flag).stop().fadeIn(400).siblings().stop().fadeOut(400);
						$(".imgdot span").eq(opts.flag).removeClass("off").addClass("on").siblings().removeClass("on").addClass("off");
					});
				}
				
			});
			
		}
		
	});
	
})(jQuery);
