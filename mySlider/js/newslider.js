;(function(){

	$.fn.extend({
		newSlider : function(opts){
			var defaults = {
				imgs : [{imgUrl:"imgs/case/case1.png"},{imgUrl:"imgs/case/case2.png"},{imgUrl:"imgs/case/case3.png"}],
				flag : 1,
				speed : 200,
				interval : 3000,
				conflict : 0,
				auto : true,
				timer : "",
				imgList : "",
				imgOrder : "",
				arrLength : "",
				realLength : "",
				itemWidth : "",
				listStartLeft : ""
			};
			var opts = $.extend(defaults, opts);
			var $this = $(this);
			var preventViolentClick = function(){
				opts.conflict = 1;
				setTimeout(function(){
					opts.conflict = 0;
				},opts.speed);
			};
			var turnLeft = function(){
				opts.flag--;
				if(opts.flag < 1){
					opts.imgList.css("left", opts.listStartLeft-opts.itemWidth*(opts.arrLength-3));
					opts.imgList.stop(true,false).animate({
						left : "+=" + opts.itemWidth
					},opts.speed);
					opts.flag = opts.arrLength-3;
				}else{
					opts.imgList.stop(true,false).animate({
						left : "+=" + opts.itemWidth
					},opts.speed);
				}
				if(opts.flag < 1){
					opts.imgOrder.text(opts.realLength + "/" + opts.realLength);
				}else{
					opts.imgOrder.text(opts.flag + "/" + opts.realLength);
				}
			};
			var turnRight = function(){
				opts.flag++;
				if(opts.flag > opts.arrLength-2){
					opts.imgList.css("left", opts.listStartLeft);
					opts.imgList.stop(true,false).animate({
						left : "-=" + opts.itemWidth
					},opts.speed);
					opts.flag = 2;
				}else{
					opts.imgList.stop(true,false).animate({
						left : "-=" + opts.itemWidth
					},opts.speed);
				}
				if(opts.flag > opts.realLength){
					opts.imgOrder.text("1/" + opts.realLength);
				}else{
					opts.imgOrder.text(opts.flag + "/" + opts.realLength);
				}
			};
			var workInterval = function(){
				opts.timer = setInterval(function(){
					turnRight();
				},opts.interval);
			};
			
			return this.each(function(){
				if(opts.imgs != undefined && opts.imgs != null && opts.imgs != [] && opts.imgs instanceof Array){
					var arr = opts.imgs;
					opts.realLength = arr.length;
					arr.push(arr[0]);
					arr.push(arr[1]);
					arr.unshift(arr[arr.length-3]);
					opts.arrLength = arr.length;
					var $imglist = $('<div class="imglist"></div>');
					for(var i=0; i<arr.length; i++){
						var $imgitem = $('<div class="imgitem"></div>');
						var $a = $('<a></a>');
						if(arr[i].imgSee != undefined && arr[i].imgSee != ""){
							$a.attr("href", arr[i].imgSee);
						}else{
							$a.attr("href", "##");
						}
						var $img = $('<img width="100%" height="100%"/>');
						$img.attr("src", arr[i].imgUrl);
						$a.append($img);
						$imgitem.append($a);
						$imgitem.hover(function(){
							if(opts.auto){
								clearInterval(opts.timer);
							}
						},function(){
							if(opts.auto){
								workInterval();
							}
						});
						$imglist.append($imgitem);
					}
					var $leftblock = $('<div class="leftblock"></div>');
					var $rightblock = $('<div class="rightblock"></div>');
					var $arrowL = $('<div class="arrowL"></div>');
					var $arrowR = $('<div class="arrowR"></div>');
					var $imgorder = $('<div class="imgorder"></div>');
					opts.imgOrder = $imgorder;
					$imgorder.hover(function(){
						if(opts.auto){
							clearInterval(opts.timer);
						}
					},function(){
						if(opts.auto){
							workInterval();
						}
					});
					$imgorder.text("1/" + opts.realLength);
					$this.append($imglist).append($leftblock).append($rightblock).append($arrowL).append($arrowR).append($imgorder);
					
					opts.imgList = $imglist;
					opts.itemWidth = $imgitem.outerWidth(true);
					opts.listStartLeft = -($imgitem.outerWidth(true)-($this.outerWidth()-$imgitem.outerWidth())/2);
					$imglist.css({
						"width" : opts.itemWidth*arr.length,
						"left" : opts.listStartLeft
					});
				}
				if(opts.auto){
					workInterval();
				}
				$(".arrowL, .leftblock").on("click", function(){
					if(opts.auto){
						clearInterval(opts.timer);
					}
					if(opts.conflict == 0){
						preventViolentClick();
						turnLeft();
					}
					if(opts.auto){
						workInterval();
					}
				});
				$(".arrowR, .rightblock").on("click", function(){
					if(opts.auto){
						clearInterval(opts.timer);
					}
					if(opts.conflict == 0){
						preventViolentClick();
						turnRight();
					}
					if(opts.auto){
						workInterval();
					}
				});
			});
		}
	});
	
})(jQuery);