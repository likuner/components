											/* created by likun 2017-01-07 */
;(function(){

	$.fn.extend({
		newSlider : function(opts){
			var defaults = {
				imgs : [
					{imgSee:"http://www.baidu.com", imgUrl:"img/case1.png"},
					{imgSee:"http://www.baidu.com", imgUrl:"img/case2.png"},
					{imgSee:"http://www.baidu.com", imgUrl:"img/case3.png"},
					{imgSee:"http://www.baidu.com", imgUrl:"img/jd1.jpg"},
					{imgSee:"http://www.baidu.com", imgUrl:"img/jd2.jpg"},
					{imgSee:"http://www.baidu.com", imgUrl:"img/jd3.jpg"},
					{imgSee:"http://www.baidu.com", imgUrl:"img/jd5.jpg"}
				],
				flag : 1,
				speed : 300,
				interval : 3000,
				auto : true,
				timer : "",
				imgList : "",
				imgOrder : "",
				arrLength : "",
				realLength : "",
				itemWidth : "",
				listStartLeft : "",
				conflict : 0,
				//防止暴力点击
				preventViolentClick : function(){  
					opts.conflict = 1;
					setTimeout(function(){
						opts.conflict = 0;
					},opts.speed);
				},
				turnLeft : function(){
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
				},
				turnRight : function(){
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
				},
				workInterval : function(){
					opts.timer = setInterval(function(){
						opts.turnRight();
					},opts.interval);
				}
			};
			var opts = $.extend(defaults, opts);
			var $this = $(this);
			console.info("/* created by likun 2017-01-07 */");
			return this.each(function(){
				if(opts.imgs != undefined && opts.imgs != null && opts.imgs != [] && opts.imgs instanceof Array){
					var arr = opts.imgs;
					opts.realLength = arr.length;
					console.info("realLength: " + opts.realLength);
					arr.push(arr[0]);
					arr.push(arr[1]);
					arr.unshift(arr[arr.length-3]);
					opts.arrLength = arr.length;
					console.info(arr, "arrayLength: "+opts.arrLength);
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
							console.info("over");
							if(opts.auto){
								clearInterval(opts.timer);
							}
						},function(){
							console.info("out");
							if(opts.auto){
								opts.workInterval();
							}
						});
						$imglist.append($imgitem);
					}
					var $arrowL = $('<div class="arrowL"></div>');
					var $arrowR = $('<div class="arrowR"></div>');
					var $imgorder = $('<div class="imgorder"></div>');
					opts.imgOrder = $imgorder;
					$imgorder.hover(function(){
						console.info("over");
						if(opts.auto){
							clearInterval(opts.timer);
						}
					},function(){
						console.info("out");
						if(opts.auto){
							opts.workInterval();
						}
					});
					$imgorder.text("1/" + opts.realLength);
					$this.append($imglist).append($arrowL).append($arrowR).append($imgorder);
					
					opts.imgList = $imglist;
					opts.itemWidth = $imgitem.outerWidth(true);
					console.info("imgitemWidth: "+opts.itemWidth);
					opts.listStartLeft = -($imgitem.outerWidth(true)-($this.outerWidth()-$imgitem.outerWidth())/2);
					console.info("imglistStartLeft: "+opts.listStartLeft);
					$imglist.css({
						"width" : opts.itemWidth*arr.length,
						"left" : opts.listStartLeft
					});
				}
				if(opts.auto){
					opts.workInterval();
				}
				$arrowL.on("click", function(){
					if(opts.auto){
						clearInterval(opts.timer);
					}
					if(opts.conflict == 0){
						opts.preventViolentClick();
						opts.turnLeft();
					}
					if(opts.auto){
						opts.workInterval();
					}
				});
				$arrowR.on("click", function(){
					if(opts.auto){
						clearInterval(opts.timer);
					}
					if(opts.conflict == 0){
						opts.preventViolentClick();
						opts.turnRight();
					}
					if(opts.auto){
						opts.workInterval();
					}
				});
			});
		}
	});
	
})(jQuery);