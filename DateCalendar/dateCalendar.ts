class DateCalendar {
    private opts;
    constructor( target, options ){
        this.opts = {
            tar : typeof target === 'string' ? document.getElementById(target) : target,
			todayYear : 2018,
			todayMonth : 1,
			todayDate : 1,
			showingYear : new Date().getFullYear(),
			showingMonth : new Date().getMonth()+1,
			previngYear : 2017,
			previngMonth : 12,
			nextingYear : 2018,
			nextingMonth : 2,
			curMonthArr : [],
			prevMonthArr : [],
			nextMonthArr : [],
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
			isInit : 1,
			// firstSliding : 1,
			firstRender : true,
			firstRenderToday : true,
			initCtrlH : 75,
			finalCtrlH : 190
        };
        this.opts = this.merge( this.opts, options );

		this.init();
		this.renderDom();

		this.fillTable( this.opts.showingYear, this.opts.showingMonth, 'date-calendar-content-1' );
		this.fillTable( this.opts.previngYear, this.opts.previngMonth, 'date-calendar-content-2' );
		this.fillTable( this.opts.nextingYear, this.opts.nextingMonth, 'date-calendar-content-3' );

		this.initOneLine();

    }
    private init():void {
        //初始化
        //获取屏宽
        this.opts.winW = window.innerWidth || 
        document.documentElement.clientWidth || 
        document.body.clientWidth;
        //初始化今天的年月日
        this.opts.todayYear = new Date().getFullYear();
        this.opts.todayMonth = new Date().getMonth() + 1;
        this.opts.todayDate = new Date().getDate();

        //初始化控件显示的 前后 年月
        this.opts.previngYear = this.getPrevMonth( this.opts.showingYear, this.opts.showingMonth )[0];
        this.opts.previngMonth = this.getPrevMonth( this.opts.showingYear, this.opts.showingMonth )[1];
        this.opts.nextingYear = this.getNextMonth( this.opts.showingYear, this.opts.showingMonth )[0];
        this.opts.nextingMonth = this.getNextMonth( this.opts.showingYear, this.opts.showingMonth )[1];

        //初始化curMonthArr / prevMonthArr / nextMonthArr
        this.opts.curMonthArr = this.initMonthArr( this.opts.showingYear, this.opts.showingMonth );
        this.opts.prevMonthArr = this.initMonthArr( this.opts.previngYear, this.opts.previngMonth );
        this.opts.nextMonthArr = this.initMonthArr( this.opts.nextingYear, this.opts.nextingMonth );

        // console.info( this.opts );
    }
    private renderDom():void {
        //初始化渲染控件DOM
        let i = 0, size = 3, self = this,
        dateTitle = '<table class="date-table-title"><thead><tr>' +
                    '<th class="weekend">日</th><th>一</th><th>二</th>' +
                    '<th>三</th><th>四</th><th>五</th>' +
                    '<th class="weekend">六</th></tr></thead></table>',
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

        self.opts.initCallback( this.opts.todayYear, this.opts.todayMonth, this.opts.todayDate );					

    }
    private renderTable() {
        //初始化渲染表格
        let i = 0, size = 42, self = this,
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
    }
    private fillTable( year, month, dateCalendarId ):void {
        //向表格填充日期
        let self = this, 
        calendarDom = document.getElementById( dateCalendarId ),
        oTableList = calendarDom.getElementsByTagName( 'table' ),
        prevYearMonth = self.getPrevMonth( year, month ),
        nextYearMonth = self.getNextMonth( year, month );
        
        self.freshTds( oTableList[0], prevYearMonth[0], prevYearMonth[1] );
        self.freshTds( oTableList[1], year, month );
        self.freshTds( oTableList[2], nextYearMonth[0], nextYearMonth[1] );

        self.posiCenter();

    }
    private freshTds( tableDom, year, month ):void {
        //刷新表格日期数据
        let i = 0,  i_ = 0, self = this,
        oTable = tableDom,
        rowSum = self.getRowSum( year, month ),
        monthArr = self.initMonthArr( year, month ),
        oTrList = tableDom.getElementsByTagName( 'tr' ),
        oTdList = tableDom.getElementsByTagName( 'td' ),
        arrLen = monthArr.length,
        trLen = oTrList.length;

        // console.info( 'row: ' + rowSum );
        if ( rowSum === 4) {
            for ( ; i_<trLen; i_++ ) {
                if( ~oTrList[i_].className.indexOf( '-last-tr' ) ) {
                    if ( !~oTrList[i_].className.indexOf( 'tr-hidden' ) ) {
                        oTrList[i_].className += ' tr-hidden';
                    }
                }
            }
        } 
        else if ( rowSum === 5 ) {
            for ( ; i_<trLen; i_++ ) {
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
            tdItem.className = '';
            if ( item ) {
                if ( !~tdItem.className.indexOf( 'tditem' ) ) {
                    tdItem.className += ' tditem';
                }

                if ( item.isWorkday ) {
                    tdItem.className += ' workday';
                } else {
                    tdItem.className = tdItem.className.replace( /\s*workday/g, '' );
                }

                if ( item.isWeekend ) {
                    tdItem.className += ' weekend';
                } else {
                    tdItem.className = tdItem.className.replace( /\s*weekend/g, '' );
                }

                if( item.isToday ) {
                    // tdItem.className += ' today';
                    tdItem.className += ' clicked';
                } else {
                    tdItem.className = tdItem.className.replace( /\s*today/g, '' );
                }

                if ( item.day ) {
                    tdItem.innerText = item.day;
                } else {
                    tdItem.innerText = '';
                }

                if ( self.opts.firstRender ) {
                    if ( item.day == 1 && item.month == self.opts.todayMonth && item.year == self.opts.todayYear ) {
                        if ( ~tdItem.className.indexOf( 'clicked' ) ) {
                            tdItem.className = tdItem.className.replace( /\s*clicked/g, '' );
                        }
                        self.opts.firstRender = false;
                    }
                } else {
                    if ( item.day == 1 ) {
                        if ( !~tdItem.className.indexOf( 'clicked' ) ) {
                            tdItem.className += ' clicked';
                        }
                    }
                }

                if ( self.opts.firstRenderToday ) {
                    if ( item.day == self.opts.todayDate && item.month == self.opts.todayMonth && item.year == self.opts.todayYear ) {
                        if ( !~tdItem.className.indexOf( 'clicked' ) ) {
                            tdItem.className += ' clicked';
                        }
                        self.opts.firstRenderToday = false;
                    }
                } else {
                    if ( item.day == self.opts.todayDate && item.month == self.opts.todayMonth && item.year == self.opts.todayYear ) {
                        if ( ~tdItem.className.indexOf( 'clicked' ) ) {
                            tdItem.className = tdItem.className.replace( /\s*clicked/g, '' );
                        }
                    }
                }

                // if ( item.day == 1 && item.month == self.todayMonth && item.year == self.todayYear && self.opts.firstRender) {
                // 	if ( ~tdItem.className.indexOf( 'clicked' ) ) {
                // 		tdItem.className = tdItem.className.replace( /\s*clicked/g, '' );
                // 		self.opts.firstRender = false;
                // 	}
                // } else {
                // 	if ( item.day == 1 && !self.opts.firstRender ) {
                // 		if ( !~tdItem.className.indexOf( 'clicked' ) ) {
                // 			tdItem.className += 'clicked';
                // 		}
                // 	}
                // }

                tdItem.selfdata = JSON.stringify( item );
            }
            else {
                tdItem.innerText = '';
            }
        }
    }
    private initOneLine():void {
        let i = 0, self = this,
        oLayer = document.getElementById( 'date-calendar-content-1' ),
        // oTable = oLayer.children[1],
        oTable = oLayer.getElementsByTagName('table')[1],
        oTrs = oTable.getElementsByTagName( 'tr' ),
        trLen = oTrs.length,
        rowNum = this.getRowNumberOfToday(),
        outerWrapper = this.opts.tar;

        self.opts.firstSliding = true;

        oTable.style.height = '50px';
        oTable.style.paddingTop = '4px';
        oLayer.style.height = this.opts.initCtrlH + 'px';
        outerWrapper.style.height = this.opts.initCtrlH + 'px';
        for ( ; i<trLen; i++ ) {
            if ( i === rowNum ) {
                oTrs[i].className = oTrs[i].className.replace( /\s*init-hidden/g, '' );
            } else {
                if ( !~oTrs[i].className.indexOf( 'init-hidden' ) ) {
                    oTrs[i].className += ' init-hidden';
                }
            }
        }
    }
    private getRowNumberOfToday():number {
        //计算今天在控件第几行 从0开始
        let 
        day = this.opts.todayDate,
        month = this.opts.todayMonth,
        year = this.opts.todayYear,
        beginBlank = this.getBeginBlankSum( year, month ),
        num = day + beginBlank - 1;
        return Math.floor( num / 7 );
    }
    private posiCenter():void {
        //将3个层级相对屏幕水平居中显示
        let self = this,
        layer1 = document.getElementById( 'date-calendar-content-1' ),
        layer2 = document.getElementById( 'date-calendar-content-2' ),
        layer3 = document.getElementById( 'date-calendar-content-3' );
        layer1.style.transform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
        // layer1.style.msTransform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
        // layer1.style.mozTransform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
        layer1.style.webkitTransform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
        layer2.style.transform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
        // layer2.style.msTransform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
        // layer2.style.mozTransform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
        layer2.style.webkitTransform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
        layer3.style.transform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
        // layer3.style.msTransform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
        // layer3.style.mozTransform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
        layer3.style.webkitTransform = 'translate3d(-' + self.opts.winW + 'px, 0, 0)';
    }
    private pushToTop( num ):void {
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
    }
    private initMonthArr( year, month ) {
        //初始化某月的数组数据
        //数组中的一项包括： isToday, isWeekend, isSunday, isWorkday, year, month, day, ymdStr
        var beginBlankSum, endBlankSum, days, sum, _i = 0, i = 1, i_ = 0, monthTempArr = [], self = this;
        beginBlankSum = this.getBeginBlankSum( year, month );
        endBlankSum = this.getEndBlankSum( year, month );
        days = this.getDayPlainSumOfMonth( year, month );
        sum = beginBlankSum + days + endBlankSum;
        // console.info( beginBlankSum, endBlankSum, days, sum );
        for ( ; _i<beginBlankSum; _i++ ) {
            monthTempArr[monthTempArr.length] = '';
        }
        for ( ; i<=days; i++ ) {
            var obj = {
                'isToday' : self.isToday( year, month, i ),
                'isWeekend' : self.isWeekend( year, month, i ),
                'isSunday' : self.isSunday( year, month, i ),
                'isWorkday' : self.isWorkday( year, month, i ), //节假日如何计算？
                'week' : self.getWeek( year, month, i ),
                'year' : year,
                'month' : month,
                'day' : i,
                'ymdStr' : '' + year + '-' + month + '-' + i
            };
            monthTempArr[monthTempArr.length] = obj;
        }
        for ( ; i_<endBlankSum; i_++ ) {
            monthTempArr[monthTempArr.length] = '';
        }
        return monthTempArr;
    }
    private isWorkday( year, month, day ):boolean {
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
    }
    private bindEvent( selector, type, callback ):void {
        //绑定事件处理函数 选择器为 id 或 dom对象
        let tarDom:any;
        if ( typeof selector === 'string' ) {
            tarDom = document.getElementById( selector );
        } 
        else if ( selector instanceof Object ) {
            tarDom = selector;
        }
        else {
            return;
        }
        if (document.addEventListener) {
            tarDom.addEventListener( type,  callback.bind( this ), false );
        }
        // else if ( document.attachEvent ) {
        //     tarDom.attachEvent( 'on' + type,  callback.bind( this ) );
        // }
        else {
            tarDom[ 'on' + type ] = callback;
        }
    }
    private unbindEvent( selector, type, callback ):void {
        //解绑事件处理函数
        let tarDom;
        if ( typeof selector === 'string' ) {
            tarDom = document.getElementById( selector );
        } 
        else if ( selector instanceof Object ) {
            tarDom = selector;
        }
        else {
            return;
        }
        if (document.addEventListener) {
            tarDom.removeEventListener( type,  callback, false );
        }
        // else if ( document.attachEvent ) {
        //     tarDom.detachEvent( 'on' + type,  callback );
        // }
        else {
            tarDom[ 'on' + type ] = null;
        }
    }
    private _touchCallback( event ):void {
        //touch事件分发
        console.info( 'touch triggered' );
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
    }
    private _touchstartCallback( event ):void {	
        // event.preventDefault();					
        this.opts.beginX = event.touches['0'].clientX;
        this.opts.beginY = event.touches['0'].clientY;
        this.opts.startTime = new Date();
        if ( event.target.tagName === 'TD' ) {
            this.opts.domLayer = event.target.parentNode.parentNode.parentNode;
        } else if ( event.target.tagName === 'TR' ) {
            this.opts.domLayer = event.target.parentNode.parentNode;
        } else {
            // TABLE
            this.opts.domLayer = event.target.parentNode;
        }
    }
    private _touchmoveCallback( event ):void {
        let self = this;
        event = event || window.event;
        event.preventDefault();
        event.returnFalse = true;
        this.opts.endX = event.touches['0'].clientX;
        this.opts.endY = event.touches['0'].clientY;
        this.opts.offsetX = this.opts.endX - this.opts.beginX;
        this.opts.offsetY = this.opts.endY - this.opts.beginY;
        // console.info( event.target.tagName, self.opts.domLayer );
        if ( self.opts.firstSliding ) {
            self._touchmoveHandler( event );
            // console.warn( 'offsetX: ' + this.opts.offsetX, 'offsetY: ' + this.opts.offsetY );
            return;
        }
        // console.info( 'offsetX: ' + this.opts.offsetX, 'offsetY: ' + this.opts.offsetY );
        self.opts.domLayer.style.transform = 'translate3d(' + ( 0-self.opts.winW + self.opts.offsetX*1 ) + 'px, 0, 0)';
        self.opts.domLayer.style.msTransform = 'translate3d(' + ( 0-self.opts.winW + self.opts.offsetX*1 ) + 'px, 0, 0)';
        self.opts.domLayer.style.mozTransform = 'translate3d(' + ( 0-self.opts.winW + self.opts.offsetX*1 ) + 'px, 0, 0)';
        self.opts.domLayer.style.webkitTransform = 'translate3d(' + ( 0-self.opts.winW + self.opts.offsetX*1 ) + 'px, 0, 0)';
        self.opts.domLayer.style.transition = 'none';
        self.opts.domLayer.style.msTransition = 'none';
        self.opts.domLayer.style.mozTransition = 'none';
        self.opts.domLayer.style.webkitTransition = 'none';
    }
    private _touchmoveHandler( event ):void {
        var i = 0, self = this,
        oLayer = document.getElementById( 'date-calendar-content-1' ),
        oTable = oLayer.children[1],
        oTrs = oTable.getElementsByTagName( 'tr' ),
        trLen = oTrs.length,
        outerWrapper = this.opts.tar,
        movingHeight = self.opts.beginY + self.opts.offsetY,
        rowNum = this.getRowNumberOfToday();

        // console.info( self.opts.offsetY );
        // if ( self.opts.offsetY <= 35 ) {
        // 	return;
        // }
        // if ( movingHeight >= '180' ) {
        // 	return;
        // }

        // oTable.style.height = movingHeight + 'px';
        // oTable.style.marginTop = '0px';
        // oLayer.style.height = movingHeight + 'px';
        // outerWrapper.style.height = movingHeight + 'px';
        
    }
    private _touchendHandler( event ):void {
        let i = 0, self = this,
        oWrapper = document.getElementById('date-calendar-wrapper'),
        oLayer = document.getElementById( 'date-calendar-content-1' ),
        // oTable = oLayer.children[1],
        oTable = oLayer.getElementsByTagName('table')[1],
        oTrs = oTable.getElementsByTagName( 'tr' ),
        trLen = oTrs.length,
        outerWrapper = this.opts.tar;
        console.info( 'initSliding...' );

        if ( self.opts.offsetY <= 0 ) {
            return;
        }

        oTable.style.transition = 'height 0.2s ease-out';
        // oTable.style.msTransition = 'height 0.2s ease-out';
        // oTable.style.mozTransition = 'height 0.2s ease-out';
        oTable.style.webkitTransition = 'height 0.2s ease-out';

        oLayer.style.transition = 'height 0.2s ease-out';
        // oLayer.style.msTransition = 'height 0.2s ease-out';
        // oLayer.style.mozTransition = 'height 0.2s ease-out';
        oLayer.style.webkitTransition = 'height 0.2s ease-out';

        outerWrapper.style.transition = 'height 0.2s ease-out';
        outerWrapper.style.msTransition = 'height 0.2s ease-out';
        outerWrapper.style.mozTransition = 'height 0.2s ease-out';
        outerWrapper.style.webkitTransition = 'height 0.2s ease-out';

        oTable.style.height = '100%';
        oTable.style.paddingTop = '0px';
        oLayer.style.height = self.opts.finalCtrlH + 'px';
        // oLayer.parentNode.style.height = self.opts.finalCtrlH + 'px';
        oWrapper.style.height = self.opts.finalCtrlH + 'px';
        outerWrapper.style.height = self.opts.finalCtrlH + 30 + 'px';
        for ( ; i<trLen; i++ ) {
            oTrs[i].className = oTrs[i].className.replace( /\s*init-hidden/g, '' );
        }
        this.opts.firstSliding = false;
        this.opts.offsetX = 0;
        this.opts.offsetY = 0;
        this.opts.beginX = 0;
        this.opts.beginY = 0;
        this.opts.endX = 0;
        this.opts.endY = 0;
    }
    private _touchendCallback( event ):void {
        if ( this.opts.firstSliding ) {
            this._touchendHandler( event );
            return;
        }
        var boundry = this.opts.winW / 3, self = this;
        this.opts.endTime = new Date();
        if ( !this.opts.offsetX ) {
            //点击事件
            this._callback_( event );
            return;
        } 
        if ( self.opts.endTime - self.opts.startTime > 600 ) {
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
    }
    private animatingSlide( flag ):void {
        //动画效果
        let self = this, cachedYearMonth, rest = 100;
        self.opts.domLayer.style.transition = 'transform 0.2s ease-out';
        self.opts.domLayer.style.msTransition = 'transform 0.2s ease-out';
        self.opts.domLayer.style.mozTransition = 'transform 0.2s ease-out';
        self.opts.domLayer.style.webkitTransition = 'transform 0.2s ease-out';
        if ( flag === '1' ) {
            self.opts.domLayer.style.transform = 'translate3d(' + ( -2 * self.opts.winW ) + 'px, 0, 0)';
            self.opts.domLayer.style.msTransform = 'translate3d(' + ( -2 * self.opts.winW ) + 'px, 0, 0)';
            self.opts.domLayer.style.mozTransform = 'translate3d(' + ( -2 * self.opts.winW ) + 'px, 0, 0)';
            self.opts.domLayer.style.webkitTransform = 'translate3d(' + ( -2 * self.opts.winW ) + 'px, 0, 0)';
            cachedYearMonth = self.getNextMonth( self.opts.showingYear, self.opts.showingMonth );
            self.opts.showingYear = cachedYearMonth[0];
            self.opts.showingMonth = cachedYearMonth[1];
        } else if ( flag === '-1' ) {
            self.opts.domLayer.style.transform = 'translate3d(0, 0, 0)';
            self.opts.domLayer.style.msTransform = 'translate3d(0, 0, 0)';
            self.opts.domLayer.style.mozTransform = 'translate3d(0, 0, 0)';
            self.opts.domLayer.style.webkitTransform = 'translate3d(0, 0, 0)';
            cachedYearMonth = self.getPrevMonth( self.opts.showingYear, self.opts.showingMonth );
            self.opts.showingYear = cachedYearMonth[0];
            self.opts.showingMonth = cachedYearMonth[1];
        } else {
            self.opts.domLayer.style.transform = 'translate3d(' + ( -self.opts.winW ) + 'px, 0, 0)';
            self.opts.domLayer.style.msTransform = 'translate3d(' + ( -self.opts.winW ) + 'px, 0, 0)';
            self.opts.domLayer.style.mozTransform = 'translate3d(' + ( -self.opts.winW ) + 'px, 0, 0)';
            self.opts.domLayer.style.webkitTransform = 'translate3d(' + ( -self.opts.winW ) + 'px, 0, 0)';
        }
        //滑动完成之后的处理
        self.opts.previngYear = self.getPrevMonth( self.opts.showingYear, self.opts.showingMonth )[0];
        self.opts.previngMonth = self.getPrevMonth( self.opts.showingYear, self.opts.showingMonth )[1];
        self.opts.nextingYear = self.getNextMonth( self.opts.showingYear, self.opts.showingMonth )[0];
        self.opts.nextingMonth = self.getNextMonth( self.opts.showingYear, self.opts.showingMonth )[1];
        if ( flag === '1' ) { 
            if ( self.opts.domLayer.id === 'date-calendar-content-3' ) {
                setTimeout( function(){
                    self.pushToTop( 2 );
                    self.fillTable( self.opts.previngYear, self.opts.previngMonth, 'date-calendar-content-1' );
                    self.fillTable( self.opts.nextingYear, self.opts.nextingMonth, 'date-calendar-content-3' );
                }, rest );
            } else {
                // 'date-calendar-content-1' 'date-calendar-content-2' 
                setTimeout( function(){
                    self.pushToTop( 3 );
                    self.fillTable( self.opts.previngYear, self.opts.previngMonth, 'date-calendar-content-1' );
                    self.fillTable( self.opts.nextingYear, self.opts.nextingMonth, 'date-calendar-content-2' );
                }, rest );
            }
            self.opts.slideCallback( self.opts.showingYear, self.opts.showingMonth, 1 );
        } else if ( flag === '-1' ) {
            if ( self.opts.domLayer.id === 'date-calendar-content-1' ) {
                setTimeout( function(){
                    self.pushToTop( 2 );
                    self.fillTable( self.opts.previngYear, self.opts.previngMonth, 'date-calendar-content-1' );
                    self.fillTable( self.opts.nextingYear, self.opts.nextingMonth, 'date-calendar-content-3' );
                }, rest );
            } else {
                // 'date-calendar-content-2' 'date-calendar-content-3'
                setTimeout( function(){
                    self.pushToTop( 1 );
                    self.fillTable( self.opts.previngYear, self.opts.previngMonth, 'date-calendar-content-2' );
                    self.fillTable( self.opts.nextingYear, self.opts.nextingMonth, 'date-calendar-content-3' );
                }, rest );
            }
            self.opts.slideCallback( self.opts.showingYear, self.opts.showingMonth, 1 );
        }
    }
    private _callback_( event ):void {
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
    }
    private _clickCallback(target, data):void {
        //点击日期单元格的 内部处理函数 外部的在参数里
        console.info( target, data );
        let 
        i = 0,
        oTable = target.parentNode.parentNode.parentNode,
        tdList = oTable.getElementsByTagName( 'td' ),
        length = tdList.length;
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
        }
    }
    private getWeekOfFirstDay( year, month ):number {
        //某年某月的第一天星期几
        return new Date( year, month-1, 1 ).getDay();
    }
    private getWeekOfLastDay( year, month ):number {
        //某年某月的最后一天星期几
        return new Date( 
            year, 
            month-1, 
            this.getDayPlainSumOfMonth( year, month ) 
        ).getDay();
    }
    private getBeginBlankSum( year, month ):number {
        //获取某年某月第一天前的空白数
        return this.getWeekOfFirstDay( year, month );
    }
    private getEndBlankSum( year, month ):number {
        //获取某年某月最后一天后的空白数
        return 6 - this.getWeekOfLastDay( year, month );
    }
    private getDayPlainSumOfMonth( year, month ):number{
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
    }
    private getDayFormatedSumOfMonth( year, month ):number {
        //某年某月第一天前的空白数 加 最后一天后的空白数 加 当月天数 即为当月所占控件的总天数
        return this.getBeginBlankSum( year, month ) + 
               this.getEndBlankSum( year, month ) + 
               this.getDayPlainSumOfMonth( year, month );
    }
    private getRowSum ( year, month ):number {
        //某年某月占控件几行 至少占4行 最多占6行
        return this.getDayFormatedSumOfMonth( year, month ) / 7;
    }
    private getPrevMonth( year, month ):number[] {
        //获取当前月的上一月 当前月如果是1月 则上一月为上一年的12月
        return month === 1 ? [ year-1, 12 ] : [ year, month-1 ];
    }
    private getNextMonth( year, month ):number[] {
        //获取当前月的下一月 当前月如果是12月 则下一月为下一年的1月
        return month === 12 ? [ year+1, 1 ] : [ year, month+1 ];
    }
    private getWeek( year, month, day ):number {
        //获取某天是星期几
        return new Date( year, month-1, day ).getDay();
    }
    private isLeapYear( year ):boolean {
        //判断是否是闰年
        return ( year % 4 === 0 && year % 100 !== 0 ) || year % 400 === 0 ? true : false;
    }
    private isToday( year, month, day ):boolean {
        //判断某天是否是今天
        return !!( year === this.opts.todayYear && month === this.opts.todayMonth && day === this.opts.todayDate );
    }
    private isWeekend( year, month, day ):boolean {
        //判断某天是否是周末
        let week = new Date( year, month-1, day ).getDay();
        return ( week === 0 || week === 6 ) ? true : false;
    }
    private isSunday( year, month, day ):boolean {
        //判断某天是否是周日
        let week = new Date( year, month-1, day ).getDay();
        return week === 0 ? true : false;
    }
    private holdByZero( num ) {
        return num > 9 ? num : '0' + num;
    }
    private addClass( selector, classes ):void {
        //为dom元素新增类  selector为 id 或者 dom对象
        if ( this.hasClass( selector, classes ) ) {
            return;				
        }
        let 
        dom = typeof selector === 'string' ? document.getElementById( selector ) : selector,
        classArr = dom.className.split( /\s+/ );
        classArr[classArr.length] = classes;
        dom.className = classArr.join( ' ' );
    }
    private removeClass( selector, classes ):void {
        //为dom元素删除特定类  selector为 id 或者 dom对象
        if ( !this.hasClass( selector, classes ) ) {
            return;				
        }
        let 
        dom = typeof selector === 'string' ? document.getElementById( selector ) : selector,
        classStr = ' ' + dom.className.split( /\s+/ ).join( ' ' ) + ' ',
        removingClass = ' ' + classes + ' ';
        dom.className = classStr.replace( removingClass, '' ).replace( /^\s+|\s+$/g, '' );
    }
    private hasClass( selector, classes ):boolean {
        let 
        dom = typeof selector === 'string' ? document.getElementById( selector ) : selector,
        classArr = dom.className.split( /\s+/ );
        return !!~classArr.indexOf( classes );
    }
    private merge( obj, _obj ) {
        //合并参数对象
        if ( !( obj instanceof Object ) || !( _obj instanceof Object ) ) {
            return obj;
        }
        for ( var k in obj ) {
            for ( var _k in _obj ) {
                if( typeof _obj[_k] === 'function' ) {
                    obj[_k] = _obj[_k];
                }
                else if ( !( _obj[_k] instanceof Array ) &&  !( _obj[_k] instanceof Object ) ) {
                    obj[_k] = _obj[_k];
                }
                else if (  !( _obj[_k] instanceof Array ) && ( _obj[_k] instanceof Object ) ) {
                    obj[_k] = {};
                    arguments.callee( obj[k], _obj[_k] );
                }
                else if ( _obj[_k] instanceof Array ) {
                    obj[_k] = [];
                    arguments.callee( obj[k], _obj[_k] );
                }
            }
        }
        return obj;
    }

}