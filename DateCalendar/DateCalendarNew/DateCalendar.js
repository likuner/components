

( function ( window, document, undefined ) {

	/* written by likun on 2018-04-03 */
	function DateCalendar ( target, options ) {

		if( !( this instanceof DateCalendar ) ) {
			return new DateCalendar( target, options );
		}
		
		//默认参数
		this.opts = {
			tar : typeof target === 'string' ? document.getElementById(target) : target,
			todayYear : new Date().getFullYear(),
			todayMonth : new Date().getMonth()+1,
			todayDate : new Date().getDate(),
			curYear : new Date().getFullYear(),
			curMonth : new Date().getMonth()+1,
			showingYear : new Date().getFullYear(),
			showingMonth : new Date().getMonth()+1,
			showingDay : new Date().getDate(),
			previngYear : 2017,
			previngMonth : 12,
			nextingYear : 2018,
			nextingMonth : 2,
			curMonthArr : [],
			prevMonthArr : [],
			nextMonthArr : [],
			curWeekArr : [],
			prevWeekArr : [],
			nextWeekArr : [],
			workdayArr : [],  //工作日数组 初始化时由接口提供
			clickCallback : function (/*json日期参数*/) {},
			slideCallback : function (/*year&month&day*/) {},
			initCallback : function (/*year&month&day*/) {},
			winW : 0,
			beginX : 0,
			beginY : 0,
			endX : 0,
			endY : 0,
			offsetX : 0,
			offsetY : 0,
			startTime : 0,
			endTime : 0,
			domLayer : '',
			initCtrlH : 65,
			finalCtrlH : 300,
			slideVertical : false,
			slideHorizontal : false,
			// initing : false,
			multiLine : false,
			isInit : true
		};

		this.opts = this.merge( this.opts, options );
		this.init();
		this.renderDom();
	}

	DateCalendar.prototype = {
		constructor : DateCalendar,
		init : function () {
			//初始化
			//获取屏宽
			this.opts.winW = window.innerWidth || 
							 document.documentElement.clientWidth || 
							 document.body.clientWidth;
			//同步当前日期
			this.opts.curYear = this.opts.showingYear;
			this.opts.curMonth = this.opts.showingMonth;
			//初始化控件显示的 前后 年月
			this.opts.previngYear = this.getPrevMonth( this.opts.showingYear, this.opts.showingMonth )[0];
			this.opts.previngMonth = this.getPrevMonth( this.opts.showingYear, this.opts.showingMonth )[1];
			this.opts.nextingYear = this.getNextMonth( this.opts.showingYear, this.opts.showingMonth )[0];
			this.opts.nextingMonth = this.getNextMonth( this.opts.showingYear, this.opts.showingMonth )[1];
			//初始化curMonthArr / prevMonthArr / nextMonthArr
			this.opts.curMonthArr = this.assembleMonthArr( this.opts.showingYear, this.opts.showingMonth );
			this.opts.prevMonthArr = this.assembleMonthArr( this.opts.previngYear, this.opts.previngMonth );
			this.opts.nextMonthArr = this.assembleMonthArr( this.opts.nextingYear, this.opts.nextingMonth );
			//初始化星期数组
			this.opts.curWeekArr = this.getCurWeekArr( this.opts.showingYear, this.opts.showingMonth, this.opts.showingDay );
			this.opts.prevWeekArr = this.getPrevWeekArr( this.opts.showingYear, this.opts.showingMonth, this.opts.showingDay );
			this.opts.nextWeekArr = this.getNextWeekArr( this.opts.showingYear, this.opts.showingMonth, this.opts.showingDay );
		},
		renderDom : function () {
			//初始化渲染控件DOM
			var i = 0, size = 3, self = this,
			dateTitle = '<table class="date-table-title" id="date-table-title" style="height:40px"><thead><tr>' +
						'<th class="weekend-">日</th><th>一</th><th>二</th>' +
						'<th>三</th><th>四</th><th>五</th>' +
						'<th class="weekend-">六</th></tr></thead></table>',
			wrapper = self.opts.tar,
			docFragment = document.createDocumentFragment(),
			oDateCalendarWrapper = document.createElement( 'div' ),
			oDateCalendarContent;

			oDateCalendarWrapper.id = 'date-calendar-wrapper';
			wrapper.innerHTML = dateTitle;
			//table 固定7列 最多6行 最少4行 最后两行视情况控制显隐 初始渲染6行7列
			for ( ; i<size; i++ ) {
				oDateCalendarContent = document.createElement( 'div' );
				oDateCalendarContent.style.width = self.opts.winW * 3 + 'px';  //宽为窗口宽度的3倍
				oDateCalendarContent.className = 'date-calendar-content';
				oDateCalendarContent.id = 'date-calendar-content-' + ( i + 1 );
				docFragment.appendChild( self.renderTable() );
				docFragment.appendChild( self.renderTable() );
				docFragment.appendChild( self.renderTable() );
				oDateCalendarContent.append( docFragment );
				oDateCalendarWrapper.appendChild( oDateCalendarContent );
			}
			wrapper.appendChild( oDateCalendarWrapper );

			// self.bindEvent( oDateCalendarWrapper, 'click', self._callback_ );
			self.bindEvent( oDateCalendarWrapper, 'touchstart', self._touchCallback );
			self.bindEvent( oDateCalendarWrapper, 'touchmove', self._touchCallback );
			self.bindEvent( oDateCalendarWrapper, 'touchend', self._touchCallback );

			if ( self.opts.multiLine ) {
				self.fillTable( self.opts.showingYear, self.opts.showingMonth, 'date-calendar-content-1' );
				self.fillTable( self.opts.previngYear, self.opts.previngMonth, 'date-calendar-content-2' );
				self.fillTable( self.opts.nextingYear, self.opts.nextingMonth, 'date-calendar-content-3' );
			} else {
				self.fillTableByWeek( self.opts.showingYear, self.opts.showingMonth, self.opts.showingDay, 'date-calendar-content-1' );
				self.fillTableByWeek( self.opts.prevWeekArr[0].year, self.opts.prevWeekArr[0].month, self.opts.prevWeekArr[0].day, 'date-calendar-content-2' );
				self.fillTableByWeek( self.opts.nextWeekArr[0].year, self.opts.nextWeekArr[0].month, self.opts.nextWeekArr[0].day, 'date-calendar-content-3' );
			}

			self.opts.initCallback( self.opts.showingYear, self.opts.showingMonth, self.opts.showingDay );
		},
		renderTable : function () {
			//初始化渲染表格
			var i = 0, size = 42, self = this,
			docFragment = document.createDocumentFragment(),
			oTable = document.createElement( 'table' );

			oTable.className = 'date-table-month';
			oTable.style.width = self.opts.winW + 'px';  //表宽为窗口宽度

			for ( ; i<size; i++ ) {
				if ( i % 7 === 0 ) {
					var oTr = document.createElement( 'tr' );
					if ( i === 28 ) {
						oTr.className = 'second-last-tr';
					}
					if ( i === 35 ) {
						oTr.className = 'end-last-tr';
					}
					docFragment.appendChild( oTr );
				}
				var oTd = document.createElement( 'td' );
				oTd.setAttribute( 'align', 'center' );
				oTd.setAttribute( 'valign', 'middle' );
				// oTd.className = 'clicked';
				oTd.innerText = '';
				oTr.appendChild( oTd );
			}
			oTable.appendChild( docFragment );
			return oTable;
		},
		fillTableByWeek : function ( year, month, day, dateCalendarId ) {
			var calendarDom = document.getElementById( dateCalendarId ),
			oTableList = calendarDom.getElementsByTagName( 'table' );
			curWeekArr = this.getCurWeekArr( year, month, day ),
			prevWeekArr = this.getPrevWeekArr( year, month, day ),
			nextWeekArr = this.getNextWeekArr( year, month, day ),
			innerWrapper = document.getElementById( 'date-calendar-wrapper' ),
			outerWrapper = this.opts.tar;

			this.freshTdsByWeek( oTableList[0], prevWeekArr );
			this.freshTdsByWeek( oTableList[1], curWeekArr );
			this.freshTdsByWeek( oTableList[2], nextWeekArr );
			this.posiCenter( calendarDom );
			oTableList[0].style.height = this.opts.initCtrlH + 'px';
			oTableList[1].style.height = this.opts.initCtrlH + 'px';
			oTableList[2].style.height = this.opts.initCtrlH + 'px';
			calendarDom.style.height = this.opts.initCtrlH + 'px';
			innerWrapper.style.height = this.opts.initCtrlH + 'px';
			outerWrapper.style.height = this.opts.initCtrlH + 40 + 'px';
			return [ prevWeekArr[0], nextWeekArr[0] ];
		},
		freshTdsByWeek : function ( tableDom, weekArr ) {
			var i = j = 0, 
			oTable = tableDom,
			oTrs = oTable.getElementsByTagName( 'tr' ),
			oTds = oTrs[0].getElementsByTagName('td'),
			trLen = oTrs.length,
			tdLen = oTds.length;
			for ( ; i<trLen; i++ ) {
				if ( i > 0 ) {
					if ( !~oTrs[i].className.indexOf( 'init-hidden' ) ) {
						oTrs[i].className += ' init-hidden';
					}
				} else {
					if ( ~oTrs[i].className.indexOf( 'init-hidden' ) ) {
						oTrs[i].className = oTrs[i].className.replace( /\s*init-hidden/g, '' );
					}
				}
			}
			for ( ; j<tdLen; j++ ) {
				var tdItem = oTds[j],
				weekItem = weekArr[j];
				tdItem.className = 'tditem';
				tdItem.innerText = weekItem.day;
				tdItem.selfdata = JSON.stringify( weekItem );

				if (  this.opts.isInit ) {
					if ( weekItem.day === this.opts.showingDay && weekItem.month === this.opts.showingMonth && weekItem.year === this.opts.showingYear ) {
						if ( !~tdItem.className.indexOf( 'clicked' ) ) {
							tdItem.className += ' clicked';
						}
						this.opts.isInit = false;
					}
				} else {
					if ( j === 0 ) {
						if ( !~tdItem.className.indexOf( 'clicked' ) ) {
							tdItem.className += ' clicked';
						}
					}
				}
				if ( weekItem.isToday ) {
					if ( !~tdItem.className.indexOf( 'today' ) ) {
						tdItem.className += ' today';
					}
				}
				if ( !weekItem.isCurrent ) {
					if ( !~tdItem.className.indexOf( 'weekend' ) ) {
						tdItem.className += ' weekend';
					}
				}
				// if ( weekItem.isWeekend ) {
				// 	if ( !~tdItem.className.indexOf( 'weekend' ) ) {
				// 		tdItem.className += ' weekend';
				// 	}
				// }
				if ( weekItem.isWorkday ) {
					tdItem.className += ' workday';
				}
			}
		},
		fillTable : function ( year, month, dateCalendarId ) {
			//向表格填充日期
			var calendarDom = document.getElementById( dateCalendarId ),
			oTableList = calendarDom.getElementsByTagName( 'table' ),
			prev = this.getPrevMonth( year, month ),
			next = this.getNextMonth( year, month ),
			innerWrapper = document.getElementById( 'date-calendar-wrapper' ),
			outerWrapper = this.opts.tar;

			this.freshTds( oTableList[0], prev[0], prev[1] );
			this.freshTds( oTableList[1], year, month, true );
			this.freshTds( oTableList[2], next[0], next[1] );
			this.posiCenter( calendarDom );
			oTableList[0].style.height = this.opts.finalCtrlH + 'px';
			oTableList[1].style.height = this.opts.finalCtrlH + 'px';
			oTableList[2].style.height = this.opts.finalCtrlH + 'px';
			calendarDom.style.height = this.opts.finalCtrlH + 'px';
			innerWrapper.style.height = this.opts.finalCtrlH + 'px';
			outerWrapper.style.height = this.opts.finalCtrlH + 40 + 'px';
		},
		freshTds : function ( tableDom, year, month, flag ) {
			//刷新表格日期数据
			var i = i_ = 0, self = this,
			oTable = tableDom,
			rowSum = self.getRowSum( year, month ),
			monthArr = self.assembleMonthArr( year, month ),
			oTrList = tableDom.getElementsByTagName( 'tr' ),
			oTdList = tableDom.getElementsByTagName( 'td' ),
			arrLen = monthArr.length,
			trLen = oTrList.length;

			if ( rowSum === 4) {
				for ( ; i_<trLen; i_++ ) {
					oTrList[i_].className = oTrList[i_].className.replace( /\s*init-hidden/g, '' );
					if( ~oTrList[i_].className.indexOf( '-last-tr' ) ) {
						if ( !~oTrList[i_].className.indexOf( 'tr-hidden' ) ) {
							oTrList[i_].className += ' tr-hidden';
						}
					}
				}
			} 
			else if ( rowSum === 5 ) {
				for ( ; i_<trLen; i_++ ) {
					oTrList[i_].className = oTrList[i_].className.replace( /\s*init-hidden/g, '' );
					if( ~oTrList[i_].className.indexOf( 'second-last-tr' ) ) {
						if ( ~oTrList[i_].className.indexOf( 'tr-hidden' ) ) {
							oTrList[i_].className = oTrList[i_].className.replace( /\s*tr-hidden/g, '');
						}
					}
					if( ~oTrList[i_].className.indexOf( 'end-last-tr' ) ) {
						if ( !~oTrList[i_].className.indexOf( 'tr-hidden' ) ) {
							oTrList[i_].className += ' tr-hidden';
						}
					}
				}
			}
			else {
				// row == 6
				for ( ; i_<trLen; i_++ ) {
					oTrList[i_].className = oTrList[i_].className.replace( /\s*init-hidden/g, '' );
					if( ~oTrList[i_].className.indexOf( '-last-tr' ) ) {
						if ( ~oTrList[i_].className.indexOf( 'tr-hidden' ) ) {
							oTrList[i_].className = oTrList[i_].className.replace( /\s*tr-hidden/g, '');
						}
					}
				}
			}
			for ( ; i<arrLen; i++ ) {
				var item =  monthArr[i];
				var tdItem = oTdList[i];
				tdItem.className = 'tditem';
				tdItem.innerText = item.day;
				tdItem.selfdata = JSON.stringify( item );
				if ( this.opts.isInit && flag ) {
					if ( item.day === this.opts.showingDay && item.month === this.opts.showingMonth && item.year === this.opts.showingYear ) {
						if ( !~tdItem.className.indexOf( 'clicked' ) ) {
							tdItem.className += ' clicked';
						}
						this.opts.isInit = false;
					}
					else {
						if ( ~tdItem.className.indexOf( 'clicked' ) ) {
							tdItem.className = tdItem.className.replace( /\s*clicked/g, '' );
						}
						this.opts.isInit = true;
					}
				} else {
					if ( item.day === 1 && item.isCurrent ) {
						if ( !~tdItem.className.indexOf( 'clicked' ) ) {
							tdItem.className += ' clicked';
						}
					} 
					else {
						if ( ~tdItem.className.indexOf( 'clicked' ) ) {
							tdItem.className = tdItem.className.replace( /\s*clicked/g, '' );
						}
					}
				}
				if ( item.isToday ) {
					if ( !~tdItem.className.indexOf( 'today' ) ) {
						tdItem.className += ' today';
					}
				}
				if ( !item.isCurrent ) {
					if ( !~tdItem.className.indexOf( 'weekend' ) ) {
						tdItem.className += ' weekend';
					}
				}
				/*
				if ( item.isWeekend ) {
					if ( !~tdItem.className.indexOf( 'weekend' ) ) {
						tdItem.className += ' weekend';
					}
				} 
				*/
				if ( item.isWorkday ) {
					tdItem.className += ' workday';
				} 
			}
		},
		posiCenter : function () {
			//将3个层级相对屏幕水平居中显示
			var self = this,
			layer1 = document.getElementById( 'date-calendar-content-1' ),
			layer2 = document.getElementById( 'date-calendar-content-2' ),
			layer3 = document.getElementById( 'date-calendar-content-3' );
			layer1.style.transform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
			layer1.style.webkitTransform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
			layer2.style.transform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
			layer2.style.webkitTransform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
			layer3.style.transform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
			layer3.style.webkitTransform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
		},
		pushToTop : function ( num ) {
			//置顶显示对应层
			var top = '9999', bottom = '8888',
			layer1 = document.getElementById( 'date-calendar-content-1' ),
			layer2 = document.getElementById( 'date-calendar-content-2' ),
			layer3 = document.getElementById( 'date-calendar-content-3' );
			if ( num === 2 ) {
				layer2.style.zIndex = top;
				layer1.style.zIndex = bottom;
				layer3.style.zIndex = bottom;
			} else if ( num === 3 ) {
				layer3.style.zIndex = top;
				layer1.style.zIndex = bottom;
				layer2.style.zIndex = bottom;
			} else {
				layer1.style.zIndex = top;
				layer2.style.zIndex = bottom;
				layer3.style.zIndex = bottom;
			}
		},
		bindEvent : function ( selector, type, callback ) {
			//绑定事件处理函数 选择器为 id 或 dom对象
			if ( typeof selector === 'string' ) {
				var tarDom = document.getElementById( selector );
			} 
			else if ( selector instanceof Object ) {
				var tarDom = selector;
			}
			else {
				return;
			}
			if (document.addEventListener) {
				tarDom.addEventListener( type,  callback.bind( this ), false );
			}
			else if ( document.attachEvent ) {
				tarDom.attachEvent( 'on' + type,  callback.bind( this ) );
			}
			else {
				tarDom[ 'on' + type ] = callback;
			}
		},
		unbindEvent : function ( selector, type, callback ) {
			//解绑事件处理函数
			if ( typeof selector === 'string' ) {
				var tarDom = document.getElementById( selector );
			} 
			else if ( selector instanceof Object ) {
				var tarDom = selector;
			}
			else {
				return;
			}
			if (document.addEventListener) {
				tarDom.removeEventListener( type,  callback, false );
			}
			else if ( document.attachEvent ) {
				tarDom.detachEvent( 'on' + type,  callback );
			}
			else {
				tarDom[ 'on' + type ] = null;
			}
		},
		_touchCallback : function ( event ) {
			//touch事件分发
			console.info( 'touch trigger' );
			var event = event || window.event, type = event.type;
			switch ( type ) {
				case 'touchstart':
					this._touchstartCallback(event);
					break;
				case 'touchmove':
					this._touchmoveCallback(event);
					break;
				case 'touchend':
					this._touchendCallback(event);
					break;
				default:
					//
			}
		},
		_touchstartCallback : function ( event ) {	
			// event.preventDefault();					
			this.opts.beginX = event.touches['0'].clientX;
			this.opts.beginY = event.touches['0'].clientY;
			this.opts.startTime = new Date() * 1;
			if ( event.target.tagName === 'TD' ) {
				this.opts.domLayer = event.target.parentNode.parentNode.parentNode;
			} else if ( event.target.tagName === 'TR' ) {
				this.opts.domLayer = event.target.parentNode.parentNode;
			} else {
				// TABLE
				this.opts.domLayer = event.target.parentNode;
			}
		},
		_touchmoveCallback : function ( event ) {
			var self = this;
			event = event || window.event;
			event.preventDefault();
			event.returnFalse = true;
			this.opts.endX = event.touches['0'].clientX;
			this.opts.endY = event.touches['0'].clientY;
			this.opts.offsetX = this.opts.endX - this.opts.beginX;
			this.opts.offsetY = this.opts.endY - this.opts.beginY;

			if ( !self.opts.slideVertical ) {
				if ( Math.abs( self.opts.offsetY ) >= Math.abs( self.opts.offsetX ) && !self.opts.slideHorizontal ) {
					self.opts.slideVertical = true;
					self.touchmoveVertical( event );
				} else {
					if ( self.opts.offsetX >= self.opts.winW || self.opts.offsetX <= -self.opts.winW ) {
						return;
					}
					self.opts.domLayer.style.transform = 'translate3d(' + ( 0-self.opts.winW + self.opts.offsetX*1 ) + 'px, 0, 0)';
					self.opts.domLayer.style.webkitTransform = 'translate3d(' + ( 0-self.opts.winW + self.opts.offsetX*1 ) + 'px, 0, 0)';
					self.opts.domLayer.style.transition = 'none';
					self.opts.domLayer.style.webkitTransition = 'none';
					self.opts.slideVertical = false;
					self.opts.slideHorizontal = true;
				}
			} else {
				self.opts.slideVertical = true;
				self.touchmoveVertical( event );
			}
		},
		touchmoveVertical : function ( event ) {
			var self = this,
			oLayer = document.getElementById( 'date-calendar-content-1' ),
			oTable = oLayer.children[1],
			oLayer2 = document.getElementById('date-calendar-content-2'),
			oLayer3 = document.getElementById('date-calendar-content-3'),
			innerWrapper = document.getElementById('date-calendar-wrapper'),
			outerWrapper = this.opts.tar;
			
			if ( self.opts.offsetY > 0 ) {
				return;
			}
			//修复BUG
			if ( !self.opts.multiLine && self.opts.offsetY <= 0 ) {
				return;
			} 
			if ( self.opts.finalCtrlH + self.opts.offsetY < self.opts.initCtrlH ) {
				return;
			}
			if ( oLayer2.style.zIndex == '9999' ) {
				oLayer = oLayer2;
			}
			if ( oLayer3.style.zIndex == '9999' ) {
				oLayer = oLayer3;
			}
			oTable = oLayer.children[1];

			oTable.style.height = self.opts.finalCtrlH + self.opts.offsetY + 'px';
			oLayer.style.height = self.opts.finalCtrlH + self.opts.offsetY + 'px';
			innerWrapper.style.height = self.opts.finalCtrlH + self.opts.offsetY + 'px';
			outerWrapper.style.height = self.opts.finalCtrlH + 40 + self.opts.offsetY + 'px';

			oTable.style.transition = 'none';
			oTable.style.webkitTransition = 'none';
			oLayer.style.transition = 'none';
			oLayer.style.webkitTransition = 'none';
			innerWrapper.style.transition = 'none';
			innerWrapper.style.webkitTransition = 'none';
			outerWrapper.style.transition = 'none';
			outerWrapper.style.webkitTransition = 'none';
		},
		touchendVertical : function ( event ) {
			var boundry = this.opts.winW / 6, self = this;
			this.opts.endTime = new Date() * 1;
			if ( self.opts.endTime - self.opts.startTime > 300 ) {
				//慢操作
				//修复BUG
				if ( self.opts.multiLine ) {
					if ( this.opts.offsetY <= -boundry ) {
						// <-- 过渡为一行
						self.animatingVertical( '1' );
					} 
					else {
						// -- 整月
						self.animatingVertical( '0' );
					}
				} else {
					if ( this.opts.offsetY >= boundry ) {
						// 整月
						self.animatingVertical( '0' );
					}
				}
			} 
			else {
				//快操作
				//修复BUG
				if ( self.opts.multiLine ) {
					if ( this.opts.offsetY < -100 ) {
						// 过渡为一行
						self.animatingVertical( '1' );
					} else {
						// 整月
						self.animatingVertical( '0' );
					}
				} else {
					if ( this.opts.offsetY > 30 ) {
						// 整月
						self.animatingVertical( '0' );
					}
				}
			}
			this.opts.offsetX = 0;
			this.opts.offsetY = 0;
			this.opts.slideVertical = false;
		},
		animatingVertical : function ( flag ) {
			var i = j = 0, self = this, 
			oTrs, oTds, trLen, tdLen, day, row, oTable,
			oLayer1 = document.getElementById('date-calendar-content-1'),
			oLayer2 = document.getElementById('date-calendar-content-2'),
			oLayer3 = document.getElementById('date-calendar-content-3'),
			innerWrapper = document.getElementById('date-calendar-wrapper'),
			outerWrapper = this.opts.tar;

			if ( oLayer2.style.zIndex == '9999' ) {
				oLayer1 = document.getElementById('date-calendar-content-2');
				oLayer2 = document.getElementById('date-calendar-content-1');
			}
			if ( oLayer3.style.zIndex == '9999' ) {
				oLayer1 = document.getElementById('date-calendar-content-3');
				oLayer2 = document.getElementById('date-calendar-content-1');
				oLayer3 = document.getElementById('date-calendar-content-2');
			}
			oTable = oLayer1.children[1];

			oTable.style.transition = 'height 0.2s ease-out';
			oTable.style.webkitTransition = 'height 0.2s ease-out';
			oLayer1.style.transition = 'height 0.2s ease-out';
			oLayer1.style.webkitTransition = 'height 0.2s ease-out';
			innerWrapper.style.transition = 'height 0.2s ease-out';
			innerWrapper.style.webkitTransition = 'height 0.2s ease-out';
			outerWrapper.style.transition = 'height 0.2s ease-out';
			outerWrapper.style.webkitTransition = 'height 0.2s ease-out';

			self.opts.isInit = true;
			if ( flag == 1 ) {
				oTable.style.height = this.opts.initCtrlH + 'px';
				oLayer1.style.height = this.opts.initCtrlH + 'px';
				innerWrapper.style.height = this.opts.initCtrlH + 'px';
				outerWrapper.style.height = this.opts.initCtrlH + 40 + 'px';

				self.opts.curWeekArr = self.getCurWeekArr( self.opts.showingYear, self.opts.showingMonth, self.opts.showingDay );
				self.opts.prevWeekArr = self.getPrevWeekArr( self.opts.showingYear, self.opts.showingMonth, self.opts.showingDay );
				self.opts.nextWeekArr = self.getNextWeekArr( self.opts.showingYear, self.opts.showingMonth, self.opts.showingDay );
				self.fillTableByWeek( self.opts.showingYear, self.opts.showingMonth, self.opts.showingDay, oLayer1.id );
				self.fillTableByWeek( self.opts.prevWeekArr[0].year, self.opts.prevWeekArr[0].month, self.opts.prevWeekArr[0].day, oLayer2.id );
				self.fillTableByWeek( self.opts.nextWeekArr[0].year, self.opts.nextWeekArr[0].month, self.opts.nextWeekArr[0].day, oLayer3.id );
				self.opts.multiLine = false;
			}
			else {
				oTable.style.height = this.opts.finalCtrlH + 'px';
				oLayer1.style.height = this.opts.finalCtrlH + 'px';
				innerWrapper.style.height = this.opts.finalCtrlH + 'px';
				outerWrapper.style.height = this.opts.finalCtrlH + 40 + 'px';
				//修复BUG
				if ( !self.opts.multiLine ) {
					self.opts.isClicked = false;
					self.opts.previngYear = self.getPrevMonth( self.opts.showingYear, self.opts.showingMonth )[0];
					self.opts.previngMonth = self.getPrevMonth( self.opts.showingYear, self.opts.showingMonth )[1];
					self.opts.nextingYear = self.getNextMonth( self.opts.showingYear, self.opts.showingMonth )[0];
					self.opts.nextingMonth = self.getNextMonth( self.opts.showingYear, self.opts.showingMonth )[1];
					self.fillTable( self.opts.showingYear, self.opts.showingMonth, oLayer1.id );
					self.fillTable( self.opts.previngYear, self.opts.previngMonth, oLayer2.id );
					self.fillTable( self.opts.nextingYear, self.opts.nextingMonth, oLayer3.id );
					self.opts.multiLine = true;
				}
			}
			self.opts.slideVertical = false;
		},
		_touchendCallback : function ( event ) {
			if ( this.opts.slideVertical ) {
				this.touchendVertical( event );
				return;
			}
			var boundry = this.opts.winW / 6, self = this;
			this.opts.endTime = new Date() * 1;
			if ( !this.opts.offsetX ) {
				//点击事件
				this._callback_( event );
				return;
			} 
			if ( self.opts.endTime - self.opts.startTime > 300 ) {
				//慢操作
				if ( this.opts.offsetX <= -boundry ) {
					// <-- 进入下一页
					self.animatingSlide( '1' );
				} else if ( this.opts.offsetX >= boundry ) {
					// --> 进入上一页
					self.animatingSlide( '-1' );
				} else {
					// -- 留在本页
					self.animatingSlide( '0' );
				}
			} 
			else {
				//快操作
				if ( this.opts.offsetX < -100 ) {
					self.animatingSlide( '1' );
				} else if ( this.opts.offsetX > 100 ) {
					self.animatingSlide( '-1' );
				} else {
					self.animatingSlide( '0' );
				}
			}
			this.opts.offsetX = 0;
			this.opts.offsetY = 0;
			this.opts.slideHorizontal = false;
		},
		animatingSlide : function ( flag ) {
			//动画效果
			var self = this, cachedYearMonth, /*cachedMonthArr,*/ cachedWeekArr, rest = 100;
			self.opts.domLayer.style.transition = 'transform 0.2s ease-out';
			self.opts.domLayer.style.webkitTransition = 'transform 0.2s ease-out';
			self.opts.isInit = false;
			if ( flag === '1' ) {
				self.opts.domLayer.style.transform = 'translate3d(' + ( -2 * self.opts.winW ) + 'px, 0, 0)';
				self.opts.domLayer.style.webkitTransform = 'translate3d(' + ( -2 * self.opts.winW ) + 'px, 0, 0)';
				if ( self.opts.multiLine ) {
					if ( self.opts.isClicked ) {
						cachedYearMonth = self.getNextMonth( self.opts.cacheYear, self.opts.cacheMonth );
						self.opts.isClicked = false;
					} else {
						cachedYearMonth = self.getNextMonth( self.opts.showingYear, self.opts.showingMonth );
					}
					self.opts.showingYear = cachedYearMonth[0];
					self.opts.showingMonth = cachedYearMonth[1];
					self.opts.showingDay = 1;
					self.opts.curYear = cachedYearMonth[0];
					self.opts.curMonth = cachedYearMonth[1];
				} else {
					cachedWeekArr = self.getNextWeekArr( self.opts.showingYear, self.opts.showingMonth, self.opts.showingDay );
					self.opts.showingYear = cachedWeekArr[0]['year'];
					self.opts.showingMonth = cachedWeekArr[0]['month'];
					self.opts.showingDay = cachedWeekArr[0]['day'];
					self.opts.curYear = self.opts.showingYear;
					self.opts.curMonth = self.opts.showingMonth;
				}
			} else if ( flag === '-1' ) {
				self.opts.domLayer.style.transform = 'translate3d(0, 0, 0)';
				self.opts.domLayer.style.webkitTransform = 'translate3d(0, 0, 0)';
				if ( self.opts.multiLine ) {
					if ( self.opts.isClicked ) {
						cachedYearMonth = self.getPrevMonth( self.opts.cacheYear, self.opts.cacheMonth );
						self.opts.isClicked = false;
					} else {
						cachedYearMonth = self.getPrevMonth( self.opts.showingYear, self.opts.showingMonth );
					}
					self.opts.showingYear = cachedYearMonth[0];
					self.opts.showingMonth = cachedYearMonth[1];
					self.opts.showingDay = 1;
					self.opts.curYear = cachedYearMonth[0];
					self.opts.curMonth = cachedYearMonth[1];
				} else {
					cachedWeekArr = self.getPrevWeekArr( self.opts.showingYear, self.opts.showingMonth, self.opts.showingDay );
					self.opts.showingYear = cachedWeekArr[0]['year'];
					self.opts.showingMonth = cachedWeekArr[0]['month'];
					self.opts.showingDay = cachedWeekArr[0]['day'];
					self.opts.curYear = self.opts.showingYear;
					self.opts.curMonth = self.opts.showingMonth;
				}
			} else {
				self.opts.domLayer.style.transform = 'translate3d(' + ( -self.opts.winW ) + 'px, 0, 0)';
				self.opts.domLayer.style.webkitTransform = 'translate3d(' + ( -self.opts.winW ) + 'px, 0, 0)';
			}
			//滑动完成之后的处理
			self.opts.curMonthArr = self.assembleMonthArr( self.opts.showingYear, self.opts.showingMonth );
			self.opts.prevMonthArr = self.assemblePrevMonthArr( self.opts.showingYear, self.opts.showingMonth );
			self.opts.nextMonthArr = self.assembleNextMonthArr( self.opts.showingYear, self.opts.showingMonth );
			self.opts.curWeekArr = self.getCurWeekArr( self.opts.showingYear, self.opts.showingMonth, self.opts.showingDay );
			self.opts.PrevWeekArr = self.getPrevWeekArr( self.opts.showingYear, self.opts.showingMonth, self.opts.showingDay );
			self.opts.NextWeekArr = self.getNextWeekArr( self.opts.showingYear, self.opts.showingMonth, self.opts.showingDay );
			self.opts.previngYear = self.getPrevMonth( self.opts.curYear, self.opts.curMonth )[0];
			self.opts.previngMonth = self.getPrevMonth( self.opts.curYear, self.opts.curMonth )[1];
			self.opts.nextingYear = self.getNextMonth( self.opts.curYear, self.opts.curMonth )[0];
			self.opts.nextingMonth = self.getNextMonth( self.opts.curYear, self.opts.curMonth )[1];
			if ( flag === '1' ) {
				if ( self.opts.domLayer.id === 'date-calendar-content-3' ) {
					setTimeout( function(){
						self.pushToTop( 2 );
						if ( self.opts.multiLine ) {
							self.fillTable( self.opts.previngYear, self.opts.previngMonth, 'date-calendar-content-1' );
							self.fillTable( self.opts.nextingYear, self.opts.nextingMonth, 'date-calendar-content-3' );
						} else {
							self.fillTableByWeek( self.opts.PrevWeekArr[0].year, self.opts.PrevWeekArr[0].month, self.opts.PrevWeekArr[0].day, 'date-calendar-content-1' );
							self.fillTableByWeek( self.opts.NextWeekArr[0].year, self.opts.NextWeekArr[0].month, self.opts.NextWeekArr[0].day, 'date-calendar-content-3' );
						}
					}, rest );
				} else {
					// 'date-calendar-content-1' 'date-calendar-content-2' 
					setTimeout( function(){
						self.pushToTop( 3 );
						if ( self.opts.multiLine ) {
							self.fillTable( self.opts.previngYear, self.opts.previngMonth, 'date-calendar-content-1' );
							self.fillTable( self.opts.nextingYear, self.opts.nextingMonth, 'date-calendar-content-2' );
						} else {
							self.fillTableByWeek( self.opts.PrevWeekArr[0].year, self.opts.PrevWeekArr[0].month, self.opts.PrevWeekArr[0].day, 'date-calendar-content-1' );
							self.fillTableByWeek( self.opts.NextWeekArr[0].year, self.opts.NextWeekArr[0].month, self.opts.NextWeekArr[0].day, 'date-calendar-content-2' );
						}
					}, rest );
				}
				self.opts.slideCallback( self.opts.showingYear, self.opts.showingMonth, self.opts.showingDay );
			} else if ( flag === '-1' ) {
				if ( self.opts.domLayer.id === 'date-calendar-content-1' ) {
					setTimeout( function(){
						self.pushToTop( 2 );
						if ( self.opts.multiLine ) {
							self.fillTable( self.opts.previngYear, self.opts.previngMonth, 'date-calendar-content-1' );
							self.fillTable( self.opts.nextingYear, self.opts.nextingMonth, 'date-calendar-content-3' );
						} else {
							self.fillTableByWeek( self.opts.PrevWeekArr[0].year, self.opts.PrevWeekArr[0].month, self.opts.PrevWeekArr[0].day, 'date-calendar-content-1' );
							self.fillTableByWeek( self.opts.NextWeekArr[0].year, self.opts.NextWeekArr[0].month, self.opts.NextWeekArr[0].day, 'date-calendar-content-3' );
						}
					}, rest );
				} else {
					// 'date-calendar-content-2' 'date-calendar-content-3'
					setTimeout( function(){
						self.pushToTop( 1 );
						if ( self.opts.multiLine ) {
							self.fillTable( self.opts.previngYear, self.opts.previngMonth, 'date-calendar-content-2' );
							self.fillTable( self.opts.nextingYear, self.opts.nextingMonth, 'date-calendar-content-3' );
						} else {
							self.fillTableByWeek( self.opts.PrevWeekArr[0].year, self.opts.PrevWeekArr[0].month, self.opts.PrevWeekArr[0].day, 'date-calendar-content-2' );
							self.fillTableByWeek( self.opts.NextWeekArr[0].year, self.opts.NextWeekArr[0].month, self.opts.NextWeekArr[0].day, 'date-calendar-content-3' );
						}
					}, rest );
				}
				self.opts.slideCallback( self.opts.showingYear, self.opts.showingMonth, self.opts.showingDay );
			}
		},
		_callback_ : function ( event ) {
			//私有方法 分发事件委托到处理函数
			var event = event || window.event, target = event.target;
			event.preventDefault();
			event.returnFalse = true;
			event.stopPropagation();
			event.cancelBubbles = true;
			if ( ~target.className.indexOf( 'tditem' ) ) {
				this._clickCallback( target, JSON.parse( target.selfdata ) );
				this.opts.clickCallback( JSON.parse( target.selfdata ) );
			}
		},
		_clickCallback : function (target, data) {
			//点击日期单元格的 内部处理函数 外部的在参数里
			var i = j = 0,
			oTable = target.parentNode.parentNode;
			oContent = target.parentNode.parentNode.parentNode,
			tdList = oContent.getElementsByTagName( 'td' ),
			length = tdList.length,
			oTds = oTable.getElementsByTagName( 'td' ),
			tdLen = oTds.length;

			this.opts.isClicked = true;
			//修复BUG
			if ( data.isCurrent ) {
				this.opts.cacheYear = data.year;
				this.opts.cacheMonth = data.month;
			} else {
				if ( data.day > 15 ) {
					this.opts.cacheYear = this.getNextMonth( data.year, data.month )[0];
					this.opts.cacheMonth = this.getNextMonth( data.year, data.month )[1];
				} else {
					this.opts.cacheYear = this.getPrevMonth( data.year, data.month )[0];
					this.opts.cacheMonth = this.getPrevMonth( data.year, data.month )[1];
				}
			}
			this.opts.showingYear = data.year;
			this.opts.showingMonth = data.month;
			this.opts.showingDay = data.day;
			/*
			for ( ; i<length; i++ ) {
				if ( tdList[i].selfdata ) {
					var selfdata = JSON.parse( tdList[i].selfdata );
					if ( selfdata.ymdStr === data.ymdStr ) {
						if ( !( ~tdList[i].className.indexOf( 'clicked' ) ) ) {
							tdList[i].className += ' clicked';
						}
					}
					else {
						tdList[i].className = tdList[i].className.replace( /\s*clicked/g, '' );
					}
				}
			}*/
			for ( ; j<tdLen; j++ ) {
				if ( oTds[j].selfdata ) {
					var selfdata = JSON.parse( oTds[j].selfdata );
					if ( selfdata.ymdStr === data.ymdStr ) {
						oTds[j].className += ' clicked';
					} else {
						oTds[j].className = oTds[j].className.replace( /\s*clicked/g, '' );
					}
				}
			}
		},
		isWorkday : function ( year, month, day ) {
			//判断某天是否是工作日 return true or false
			var i = 0, self = this, arrLen,
			workdayArr = self.opts.workdayArr,
			year = year,
			month = self.holdByZero( month ),
			day = self.holdByZero( day ),
			dateStr = year + '-' + month + '-' + day;
			if ( typeof workdayArr !== 'object' ) {
				return false;
			}
			if ( Object.prototype.toString.call( workdayArr ) !== '[object Array]' ) {
				return false;
			}
			arrLen = workdayArr.length;
			if ( arrLen < 1 ) {
				return false;
			}
			for ( ; i<arrLen; i++ ) {
				if ( workdayArr[i] === dateStr ) {
					return true;
				}
			}
			return false;
		},
		getRowNumberOfToday : function () {
			//计算今天在控件第几行 从0开始
			var 
			day = this.opts.todayDate,
			month = this.opts.todayMonth,
			year = this.opts.todayYear,
			beginBlank = this.getBeginBlankSum( year, month ),
			num = day + beginBlank - 1;
			return Math.floor( num / 7 );
		},
		getRowNumberOfDay : function ( year, month, day ) {
			//计算某天在控件第几行 从0开始
			//某天在控件的第几周 从0开始
			var day = day, month = month, year = year,
			beginBlank = this.getBeginBlankSum( year, month ),
			num = day + beginBlank - 1;
			return Math.floor( num / 7 );
		},
		getWeekOfFirstDay : function ( year, month ) {
			//某年某月的第一天星期几
			return new Date( year, month-1, 1 ).getDay();
		},
		getWeekOfLastDay : function ( year, month ) {
			//某年某月的最后一天星期几
			return new Date( 
				year, 
				month-1, 
				this.getDayPlainSumOfMonth( year, month ) 
			).getDay();
		},
		getBeginBlankSum : function ( year, month ) {
			//获取某年某月第一天前的空白数
			return this.getWeekOfFirstDay( year, month );
		},
		getEndBlankSum : function ( year, month ) {
			//获取某年某月最后一天后的空白数
			return 6 - this.getWeekOfLastDay( year, month );
		},
		getCurWeekArr : function ( year, month, day, tag/*up&down*/ ) {
			//返回某天的当前周数组
			var  tempArr = [],
			row = this.getRowNumberOfDay( year, month, day ),
			monthArr = this.assembleMonthArr( year, month );
			if ( tag === 'up' ) {
				row--;
			} else if ( tag === 'down' ) {
				row++;
			}
			var i = row * 7, size = i + 7;
			for( ;  i<size; i++ ) {
				tempArr.push( monthArr[i] );
			}
			return tempArr;
		},
		getPrevWeekArr : function ( year, month, day ) {
			//返回某天的上一周数组
			var tempArr = [],
			row = this.getRowNumberOfDay( year, month, day );
			if ( row > 0 ) {
				//即上一行
				tempArr = this.getCurWeekArr( year, month, day, 'up' );
				if ( tempArr[0]['month'] !== month ) {
					var i = 0, len = tempArr.length;
					for ( ; i<len; i++ ) {
						tempArr[i]['isCurrent'] = !tempArr[i]['isCurrent'];
					}
				}
			} else {
				var prev = this.getPrevMonth( year, month ), start = 0,
				prevMonthArr = this.assembleMonthArr( prev[0], prev[1] );
				if ( !this.getWeek( year, month, 1 ) ) {
					//如果本月第一天是星期日 则返回上月的最后一周
					start = prevMonthArr.length - 7;
				} else {
					//否则 返回上月的倒数第二周
					start = prevMonthArr.length - 14;
				}
				tempArr = prevMonthArr.splice( start, 7 );
			}
			return tempArr;
		},
		getNextWeekArr : function ( year, month, day ) {
			//返回某天的下一周数组
			var tempArr = [],
			sum = this.getRowSum( year, month ),
			row = this.getRowNumberOfDay( year, month, day );
			if ( sum - row !== 1 ) {
				//即下一行
				tempArr = this.getCurWeekArr( year, month, day, 'down' );
			} else {
				var lastDay = this.getDayPlainSumOfMonth( year, month ),
				next = this.getNextMonth( year, month ),
				nextMonthArr = this.assembleMonthArr( next[0], next[1] );
				if ( this.getWeek( year, month, lastDay ) == 6 ) {
					//如果本月最后一天是星期六 则返回下月的第一周
					tempArr = nextMonthArr.splice( 0, 7 );
					if ( tempArr[0]['month'] === month ) {
						var i = 0, len = tempArr.length;
						for ( ; i<len; i++ ) {
							tempArr[i]['isCurrent'] = !tempArr[i]['isCurrent'];
						}
					}
				} else {
					//否则返回下月的第二周
					tempArr = nextMonthArr.splice( 7, 7 );
				}
			}
			return tempArr;
		},
		assembleMonthArr : function ( year, month ) {
			var prevArr = this.getBeginBlankDaysArr( year, month ),
			currArr = this.getCurMonthArr( year, month ),
			nextArr = this.getEndBlankDaysArr( year, month );
			return prevArr.concat(currArr, nextArr);
		},
		assemblePrevMonthArr : function ( year, month ) {
			var prevYear = this.getPrevMonth( year, month )[0],
			prevMonth = this.getPrevMonth( year, month )[1];
			return this.assembleMonthArr( prevYear, prevMonth );
		},
		assembleNextMonthArr : function ( year, month ) {
			var nextYear = this.getNextMonth( year, month )[0],
			nextMonth = this.getNextMonth( year, month )[1];
			return this.assembleMonthArr( nextYear, nextMonth );
		},
		getCurMonthArr : function ( year, month ) {
			//初始化某月的数组数据
			var i = 1, tempArr = [],
			days = this.getDayPlainSumOfMonth( year, month );
			for ( ; i<=days; i++ ) {
				tempArr[i-1] = {
					'isCurrent' : true,
					'isToday' : this.isToday( year, month, i ),
					'isWeekend' : this.isWeekend( year, month, i ),
					'isSunday' : this.isSunday( year, month, i ),
					'isWorkday' : this.isWorkday( year, month, i ),
					'week' : this.getWeek( year, month, i ),
					'year' : year,
					'month' : month,
					'day' : i,
					'ymdStr' : '' + year + '-' + month + '-' + i
				};
			}
			return tempArr;
		},
		getBeginBlankDaysArr : function ( year, month ) {
			//某月开头空格是哪年哪月的哪几天 _倒序_
			var tempArr = [],
			startBlankSum = this.getBeginBlankSum( year, month ),
			prevMonth = this.getPrevMonth( year, month ), //array
			daySumPrevMonth = this.getDayPlainSumOfMonth( prevMonth[0], prevMonth[1] ),
			i = tag = daySumPrevMonth - startBlankSum + 1;
			for ( ; i<=daySumPrevMonth; i++ ) {
				tempArr[i-tag] = {
					'isCurrent' : false,
					'isToday' : this.isToday( prevMonth[0], prevMonth[1], i ),
					'isWeekend' : this.isWeekend( prevMonth[0], prevMonth[1], i ),
					'isSunday' : this.isSunday( prevMonth[0], prevMonth[1], i ),
					'isWorkday' : this.isWorkday( prevMonth[0], prevMonth[1], i ),
					'week' : this.getWeek( prevMonth[0], prevMonth[1], i ),
					'year' : prevMonth[0],
					'month' : prevMonth[1],
					'day' : i,
					'ymdStr' : '' + prevMonth[0] + '-' + prevMonth[1] + '-' + i
				};
			}
			return tempArr;
		},
		getEndBlankDaysArr : function ( year, month ) {
			//某月尾部空格是哪年哪月的哪几天
			var i = 1, tempArr = [],
			endBlankSum = this.getEndBlankSum( year, month ),
			nextMonth = this.getNextMonth( year, month ), //array
			daySumNextMonth = this.getDayPlainSumOfMonth( nextMonth[0], nextMonth[1] );
			for ( ; i<=endBlankSum; i++ ) {
				tempArr[i-1] = {
					'isCurrent' : false,
					'isToday' : this.isToday( nextMonth[0], nextMonth[1], i ),
					'isWeekend' : this.isWeekend( nextMonth[0], nextMonth[1], i ),
					'isSunday' : this.isSunday( nextMonth[0], nextMonth[1], i ),
					'isWorkday' : this.isWorkday( nextMonth[0], nextMonth[1], i ),
					'week' : this.getWeek( nextMonth[0], nextMonth[1], i ),
					'year' : nextMonth[0],
					'month' : nextMonth[1],
					'day' : i,
					'ymdStr' : '' + nextMonth[0] + '-' + nextMonth[1] + '-' + i
				};
			}
			return tempArr;
		},
		getDayPlainSumOfMonth : function ( year, month ){
			//获取某月的实际天数
			if ( month === 2 ) {
				return this.isLeapYear( year ) ? 29 : 28;
			}
			else if ( month === 4 || month === 6 || month === 9 || month === 11 ) {
				return 30;
			}
			else {
				return 31;
			}
		}, 
		getDayFormatedSumOfMonth : function ( year, month ) {
			//某年某月第一天前的空白数 加 最后一天后的空白数 加 当月天数 即为当月所占控件的总天数
			return this.getBeginBlankSum( year, month ) + 
				   this.getEndBlankSum( year, month ) + 
				   this.getDayPlainSumOfMonth( year, month );
		},
		getRowSum : function ( year, month ) {
			//某年某月占控件几行 至少占4行 最多占6行
			//某月有几个星期
			return this.getDayFormatedSumOfMonth( year, month ) / 7;
		},
		getPrevMonth : function ( year, month ) {
			//获取当前月的上一月 当前月如果是1月 则上一月为上一年的12月
			return month === 1 ? [ year-1, 12 ] : [ year, month-1 ];
		},
		getNextMonth : function ( year, month ) {
			//获取当前月的下一月 当前月如果是12月 则下一月为下一年的1月
			return month === 12 ? [ year+1, 1 ] : [ year, month+1 ];
		},
		getWeek : function ( year, month, day ) {
			//获取某天是星期几
			return new Date( year, month-1, day ).getDay();
		},
		isLeapYear : function ( year ) {
			//判断是否是闰年
			return ( year % 4 === 0 && year % 100 !== 0 ) || year % 400 === 0 ? true : false;
		},
		isToday : function ( year, month, day ) {
			//判断某天是否是今天
			return !!( year === this.opts.todayYear && month === this.opts.todayMonth && day === this.opts.todayDate );
		},
		isWeekend : function ( year, month, day ) {
			//判断某天是否是周末
			var week = new Date( year, month-1, day ).getDay();
			return ( week === 0 || week === 6 ) ? true : false;
		},
		isSunday : function ( year, month, day ) {
			//判断某天是否是周日
			var week = new Date( year, month-1, day ).getDay();
			return week === 0 ? true : false;
		},
		holdByZero : function ( num ) {
			return num > 9 ? num : '0' + num;
		},
		addClass : function ( selector, classes ) {
			//为dom元素新增类  selector为 id 或者 dom对象
			if ( this.hasClass( selector, classes ) ) {
				return;				
			}
			var 
			dom = typeof selector === 'string' ? document.getElementById( selector ) : selector,
			classArr = dom.className.split( /\s+/ );
			classArr[classArr.length] = classes;
			dom.className = classArr.join( ' ' );
		},
		removeClass : function ( selector, classes ) {
			//为dom元素删除特定类  selector为 id 或者 dom对象
			if ( !this.hasClass( selector, classes ) ) {
				return;				
			}
			var 
			dom = typeof selector === 'string' ? document.getElementById( selector ) : selector,
			classStr = ' ' + dom.className.split( /\s+/ ).join( ' ' ) + ' ',
			removingClass = ' ' + classes + ' ';
			dom.className = classStr.replace( removingClass, '' ).replace( /^\s+|\s+$/g, '' );
		},
		hasClass : function ( selector, classes ) {
			var 
			dom = typeof selector === 'string' ? document.getElementById( selector ) : selector,
			classArr = dom.className.split( /\s+/ );
			return !!~classArr.indexOf( classes );
		},
		merge : function ( obj,  _obj ) {
			//合并参数对象
			if ( !( obj instanceof Object ) || !( _obj instanceof Object ) ) {
				return obj;
			}
			for ( var _k in _obj ) {
				if( typeof _obj[_k] === 'function' ) {
					obj[_k] = _obj[_k];
				}
				else if ( !( _obj[_k] instanceof Array ) &&  !( _obj[_k] instanceof Object ) ) {
					obj[_k] = _obj[_k];
				}
				else if (  !( _obj[_k] instanceof Array ) && ( _obj[_k] instanceof Object ) ) {
					obj[_k] = {};
					arguments.callee( obj[_k], _obj[_k] );
				}
				else if ( _obj[_k] instanceof Array ) {
					obj[_k] = [];
					arguments.callee( obj[_k], _obj[_k] );
				}
			}
			return obj;
		}
	};
	//将日历控件构造器挂载到全局上下文
	window.DateCalendar = DateCalendar;

} ) ( window, document );




