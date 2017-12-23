;(function(window, document, undefined){

	var Slider = function (option){
		this.opts = {
			img: [{imgurl:'img/jd1.jpg',imglink:'http://www.baidu.com'},{imgurl:'img/jd2.jpg',imglink:''},{imgurl:'img/jd3.jpg',imglink:''},{imgurl:'img/jd4.jpg',imglink:''},{imgurl:'img/jd5.jpg',imglink:''}],
			ratio: 2.3235294117647,
			dom: 'slider-wrapper',
		};
		this.init();
		this.renderDom();
		this.initEvent();
	}
	Slider.prototype = {
		constructor: Slider,
		init: function(){
			//当前图片的索引
			this.idx = 0;
			this.width = window.innerWidth;
			this.height = window.innerWidth / this.opts.ratio;
			this.img = JSON.parse(JSON.stringify(this.opts.img));
			this.len = this.opts.img.length;
			this.tar = document.getElementById(this.opts.dom);
			this.list = document.createElement('ul');
			this.list.style.cssText = 'width:'+ this.width +'px;height:'+ this.height +'px';
			this.list.id = 'slider-list';
			console.info(this.width, this.height);
		},
		renderDom: function(){
			var imgs = this.img;
			for(var i=0, len=this.len; i<len; i++){
				var oli = document.createElement('li');
				var oa = document.createElement('a');
				var oimg = document.createElement('img');
				oli.style.cssText = 'width:100%;height:100%;-webkit-transform:translate3d('+ i*this.width +'px,0,0)';
				oimg.style.cssText = 'width:100%;height:100%';
				if(imgs[i].hasOwnProperty('imglink') && imgs[i].imglink){
					oa.href = imgs[i].imglink;
				}else{
					oa.href = '#';
				}
				if(imgs[i].hasOwnProperty('imgurl')){
					oimg.src = imgs[i].imgurl;
				}
				oli.appendChild(oa);
				oa.appendChild(oimg);
				this.list.appendChild(oli);
			}
			this.tar.appendChild(this.list);
		},
		initEvent: function(){
			var self = this;
			var outer = self.list;
			var lis = outer.getElementsByTagName('li');
			var handler = function(evt){
				var event = evt;
				var type = event.type;
				// console.info(type,event);
				switch(type){
					case 'touchstart':
						self.startX = event.touches[0].pageX;
						self.offsetX = 0;
						self.statTime = Date.now();
						return false;
						break;
					case 'touchmove':
						event.preventDefault();
						self.offsetX = event.touches[0].pageX - self.startX;
						var p = self.idx - 1;
						var n = self.idx + 3;
						for(p; p<n; p++){
							lis[p] && (lis[p].style.webkitTransform = 
								'translate3d('+ ((p-self.idx)*self.width + self.offsetX) +'px,0,0)');
							lis[p] && (lis[p].style.webkitTransition = 'none');
						}
						return false;
						break;
					case 'touchend':
						var boundry = self.width/6;
						var endTime = Date.now();
						if(self.offsetX >= boundry){
							//进入上一页
							self.go('-1');
						}else if(self.offsetX <= -boundry){
							//进入下一页
							self.go('1');
						}else{
							//留在本页
							self.go('0');
						}
						return false;
						break;
				}
			};
			outer.addEventListener('touchstart', handler);
			outer.addEventListener('touchmove', handler);
			outer.addEventListener('touchend', handler);
		},
		go: function(n){
			var self = this;
			var idx = self.idx;
			var cidx;
			var outer = self.list;
			var lis = outer.getElementsByTagName('li');
			var len = lis.length;

			if(typeof n == 'number'){
				cidx = idx;
			}else if(typeof n == 'string'){
				cidx = idx + n*1;
			}

			//防止索引超出
			if(cidx > len-1){
				cidx = len-1;
			}else if(cidx < 0){
				cidx = 0;
			}

			self.idx = cidx;

			lis[cidx] && (lis[cidx].style.webkitTransition = '-webkit-transform 0.2s ease-out');
			lis[cidx-1] && (lis[cidx-1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
			lis[cidx+1] && (lis[cidx+1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

			lis[cidx] && (lis[cidx].style.webkitTransform = 'translate3d(0,0,0)');
			lis[cidx-1] && (lis[cidx-1].style.webkitTransform = 'translate3d(-'+ self.width +'px,0,0)');
			lis[cidx+1] && (lis[cidx+1].style.webkitTransform = 'translate3d('+ self.width +'px,0,0)');

		},
		merge: function(){

		}
	};
	window.Slider = Slider;

})(window, document, undefined);