;(function($) {

    $.fn.extend({

        getOrgans : function(opts) {

            var defaults = {
                orgArr : []
            };

            var opts = $.extend(defaults, opts);

            var _this = $(this);

            var flagNext = false;

            var currentOrgId;
            var curOrgIdLevTwo;
            var curOrgIdLevThreePlus;
            
            var hasMoreData = false;

            function getThreePlus(curOrgIdLevTwo) {
                // _orgLevThreePlusWrapper.empty();
                for (var n = 0; n < opts.orgArr.length; n++) {
                    if (opts.orgArr[n].parentid != curOrgIdLevTwo) {
                        continue;
                    } else {
                        curOrgIdLevThreePlus = opts.orgArr[n].orgid;
                        var _orgLevThreePlusItem = $('<div class="orgLevOneItem"></div');

                        var _orgId = $('<span class="orgId"></span>');
                        _orgId.text(opts.orgArr[n].orgid);
                        _orgLevThreePlusItem.append(_orgId);

                        var _orgName = $('<span class="orgName"></span>');
                        _orgName.text(opts.orgArr[n].orgname);
                        _orgLevThreePlusItem.append(_orgName);

                        var _orgFlag = $('<span class="orgFlag"></span>');
                        _orgLevThreePlusItem.append(_orgFlag);
                        _orgLevThreePlusWrapper.append(_orgLevThreePlusItem);

                        for (var r = 0; r < opts.orgArr.length; r++) {
                            if (opts.orgArr[r].parentid != curOrgIdLevThreePlus) {
                                continue;
                            } else {
                                hasMoreData = true;
                                break;
                                // getThreePlus(curOrgIdLevThreePlus);
                            }
                        }
                    }
                    
                    if(hasMoreData == true){
                        getThreePlus(curOrgIdLevThreePlus);
                        hasMoreData = false;
                    }

                }
            };

            var _orgLevOneWrapper = $('<div class="orgLevOneWrapper"></div>');
            var _orgLevTwoWrapper = $('<div class="orgLevOneWrapper"></div>');
            var _orgLevThreePlusWrapper = $('<div class="orgLevOneWrapper"></div>');
            _this.append(_orgLevOneWrapper).append(_orgLevTwoWrapper).append(_orgLevThreePlusWrapper);

            return this.each(function() {

                if (opts.orgArr == undefined || opts.orgArr == null || opts.orgArr == []) {
                    alert(opts.orgArr);
                    var _hasNoData = $('<div class="hasNoData">无数据..</div>');
                    _this.append(_hasNoData);
                    // return;
                } else {
                    //循环遍历一级机构, parentid == null
                    _orgLevOneWrapper.empty();
                    for (var i = 0; i < opts.orgArr.length; i++) {
                        if (opts.orgArr[i].parentid != null) {
                            continue;
                        } else {
                            currentOrgId = opts.orgArr[i].orgid;
                            var _orgLevOneItem = $('<div class="orgLevOneItem"></div');

                            var _orgId = $('<span class="orgId"></span>');
                            _orgId.text(opts.orgArr[i].orgid);
                            _orgLevOneItem.append(_orgId);

                            var _orgName = $('<span class="orgName"></span>');
                            _orgName.text(opts.orgArr[i].orgname);
                            _orgLevOneItem.append(_orgName);

                            var _orgFlag = $('<span class="orgFlag"></span>');
                            for (var j = 0; j < opts.orgArr.length; j++) {
                                if (currentOrgId != opts.orgArr[j].parentid) {
                                    continue;
                                } else {
                                    flagNext = true;
                                    break;
                                }
                            }
                            // alert(flagNext);
                            if (flagNext == true) {
                                _orgFlag.addClass('flagNext');
                            }
                            _orgLevOneItem.append(_orgFlag);
                            flagNext = false;
                            _orgLevOneWrapper.append(_orgLevOneItem);

                        }

                    }

                    //点击一级机构节点获取二级机构
                    $(".orgLevOneItem").on("click", function() {
                        _orgLevTwoWrapper.empty();
                        _orgLevThreePlusWrapper.empty();
                        currentOrgId = $(this).find(".orgId").text();
                        for (var k = 0; k < opts.orgArr.length; k++) {
                            if (opts.orgArr[k].parentid != currentOrgId) {
                                continue;
                            } else {
                                curOrgIdLevTwo = opts.orgArr[k].orgid;
                                var _orgLevTwoItem = $('<div class="orgLevTwoItem"></div');

                                var _orgId = $('<span class="orgId"></span>');
                                _orgId.text(opts.orgArr[k].orgid);
                                _orgLevTwoItem.append(_orgId);

                                var _orgName = $('<span class="orgName"></span>');
                                _orgName.text(opts.orgArr[k].orgname);
                                _orgLevTwoItem.append(_orgName);

                                var _orgFlag = $('<span class="orgFlag"></span>');
                                for (var m = 0; m < opts.orgArr.length; m++) {
                                    if (curOrgIdLevTwo != opts.orgArr[m].parentid) {
                                        continue;
                                    } else {
                                        flagNext = true;
                                        break;
                                    }
                                }
                                if (flagNext == true) {
                                    _orgFlag.addClass('flagNext');
                                }
                                _orgLevTwoItem.append(_orgFlag);
                                flagNext = false;
                                _orgLevTwoWrapper.append(_orgLevTwoItem);

                                //点击二级机构节点递归获取三级以后的机构
                                _orgLevTwoItem.on("click", function() {
                                    // alert($(this).find('.orgName').text());
                                    curOrgIdLevTwo = $(this).find(".orgId").text();
                                    _orgLevThreePlusWrapper.empty();
                                    getThreePlus(curOrgIdLevTwo);

                                });

                            }
                        }
                    });

                }

            });

        },
    });

})(jQuery);
