;(function(window,document,undefined){
	//模仿jquery
	var $ = function(dom){
		if(!(this instanceof $)){
			return new $(dom);                            //需要注意 return new $(dom);
		}
		if(dom == undefined || dom == null || dom == ""){
			return;
		}
		this.idFlag = false;
		var regId = /^#/;
		var regClass = /^\./;
		var regTagName = /^\w/;
		if(regId.test(dom)){
			this.idFlag = true;
			var domId = dom.replace(regId, "");
			this.tarDom = document.getElementById(domId);
		}
		if(regClass.test(dom)){
			this.idFlag = false;
			var domClass = dom.replace(regClass, "");
			this.tarDom = document.getElementsByClassName(domClass);
		}
		if(regTagName.test(dom)){
			this.idFlag = false;
			this.tarDom  = document.getElementsByTagName(dom);
		}
	};

	$.prototype = {
		constructor : $,  //需要注意
		addEvent : function(eventType, fn){
			if(this.idFlag){
				if(window.addEventListener){
					this.tarDom.addEventListener(eventType, fn);
					return this;                                 //保证链式操作, retuen this;
				}
				if(window.attachEvent){
					this.tarDom.attachEvent("on"+eventType, fn);
					return this;
				}
				return;
			}
			if(window.addEventListener){
				for(var i=0, len=this.tarDom.length; i<len; i++){
					this.tarDom[i].addEventListener(eventType, fn);
				}
				return this;
			}else if(window.attachEvent){
				for(var j=0, len_=this.tarDom.length; i<len_; i++){
					this.tarDom[i].attachEvent(eventType, fn);
				}
				return this;
			}
		},
		setStyle : function(styleKey, styleValue){
			if(arguments.length < 2){
				return;
			}
			if(this.idFlag){
				this.tarDom.style[arguments[0]] = arguments[1];
				return this;
			}
			for(var i=0, len=this.tarDom.length; i<len; i++){
				this.tarDom[i].style[arguments[0]] = arguments[1];
			}
			return this;
		}
	};

	window.$ = $;    //与外界发生联系
})(window,document);