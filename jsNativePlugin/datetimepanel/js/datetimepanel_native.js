;(function(window,document){
	var _this;
	var datetime = function(dom,options){
		_this = this;
		
		if(!(this instanceof datetime)) return new datetime(dom,options);
		
		this.opts = {date:true, time:true, week:true};
		if(options) this.opts = this.merge(this.opts,options);
		
		if((typeof dom)==="string") this.targetdom = document.querySelector(dom);
		else this.targetdom = dom;
		this.workInterval();
//		this.init();
	};
	datetime.prototype = {
		constructor : datetime,
		init : function(){
			var now = new Date();
            this.year = now.getFullYear();
            this.month = this.format(now.getMonth()+1);
            this.day = this.format(now.getDate());
            this.hour = this.format(now.getHours());
            this.minute = this.format(now.getMinutes());
            this.second = this.format(now.getSeconds());
            var i = now.getDay();
            var arr = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
            this.week = arr[i];
            this.struct();
		},
		merge : function(obj1, obj2){
			for(var k in obj2){
				obj1[k] = obj2[k];
			}
			return obj1;
		},
		format : function(n){
			if(n==undefined || n==null || isNaN(n)) return;
			if(n<=9) return "0" + n;
			if(n>9) return n;
		},
		struct : function(){
			this.setStyle();
			if(!this.opts.date && this.opts.time && this.opts.week) this.targetdom.innerHTML = this.hour + ":" + this.minute + ":" + this.second + " " +this.week;
			else if(this.opts.date && !this.opts.time && this.opts.week) this.targetdom.innerHTML = this.year + "年" + this.month + "月" + this.day + "日 " + this.week;
			else if(this.opts.date && this.opts.time && !this.opts.week) this.targetdom.innerHTML = this.year + "年" + this.month + "月" + this.day + "日 " + this.hour + ":" + this.minute + ":" + this.second;
			else if(!this.opts.date && !this.opts.time && this.opts.week) this.targetdom.innerHTML = this.week;
			else if(!this.opts.date && this.opts.time && !this.opts.week) this.targetdom.innerHTML = this.hour + ":" + this.minute + ":" + this.second;
			else if(this.opts.date && !this.opts.time && !this.opts.week) this.targetdom.innerHTML = this.year + "年" + this.month + "月" + this.day + "日";
			else this.targetdom.innerHTML = this.year + "年" + this.month + "月" + this.day + "日 " + this.hour + ":" + this.minute + ":" + this.second + " " +this.week;
//			this.workInterval(); //循环调用，内存泄露
		},
		setStyle : function(){
			this.targetdom.style.cssText = "background:#eee;border:1px solid #333;text-align:center;color:#333;"
		},
		workInterval : function(){
			setInterval(function(){ _this.init() }, 1000);
		}
	};
	window.datetime = datetime;
})(window,document);
