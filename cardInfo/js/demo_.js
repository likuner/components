;(function($){
    
    $.fn.extend({
        
        pluginName1 : function(options){
            
            var defaults = {
                bgiURL : '___',
                name : '___',
                age : '___',
                star : '___',
                price : '___',
                clickCbk : function(){
                    alert('default_callback11111');
                }
            };
    
            var options = $.extend(defaults , options);
            
            var _this = $(this);
            
            return this.each(function(){
                
                //...
                var innerDiv = $('<div class="innerDivContent"></div>');
                innerDiv.css('backgroundImage', 'url(' + options.bgiURL + ')');
                
                var _herOrHisName = $('<span class="herOrHisName"></span>');
                _herOrHisName.text(options.name);
                innerDiv.append(_herOrHisName);
                
                var _herOrHisAge = $('<span class="herOrHisAge"><i></i>岁</span>');
                _herOrHisAge.find('i').text(options.age);
                innerDiv.append(_herOrHisAge);
                
                var _herOrHisStars = $('<span class="herOrHisStars"></span>');
                switch(options.star){
                    case 0:
                        _herOrHisStars.text('');
                        break;
                    case 0.5:
                        _herOrHisStars.text('☆');
                        break;
                    case 1:
                        _herOrHisStars.text('★');
                        break;
                    case 1.5:
                        _herOrHisStars.text('★☆');
                        break;
                    case 2:
                        _herOrHisStars.text('★★');
                        break;
                    case 2.5:
                        _herOrHisStars.text('★★☆');
                        break;
                    case 3:
                        _herOrHisStars.text('★★★');
                        break;
                    case 3.5:
                        _herOrHisStars.text('★★★☆');
                        break;
                    case 4:
                        _herOrHisStars.text('★★★★');
                        break;
                    case 4.5:
                        _herOrHisStars.text('★★★★☆');
                        break;
                    case 5:
                        _herOrHisStars.text('★★★★★');
                        break;
                    default:
                        _herOrHisStars.text('');
                }
                innerDiv.append(_herOrHisStars);
                
                var _priceTag = $('<span class="priceTag">¥<i></i></span>');
                _priceTag.find('i').text(options.price);
                innerDiv.append(_priceTag);
                
                _this.append(innerDiv);
                
                innerDiv.on('click', function(){
                    options.clickCbk();
                });
                
            });
            
        },
        
        pluginName2 : function(options){
            
            var defaults = {
                bgiURL : '___',
                name : '___',
                age : '___',
                star : '___',
                price : '___',
                clickCbk : function(){
                    alert('default_callback22222');
                }
            };
    
            var options = $.extend(defaults , options);
            
            var _this = $(this);
            
            return this.each(function(){
                
                //...
                var innerDiv = $('<div class="innerDivContent"></div>');
                innerDiv.css('backgroundImage', 'url(' + options.bgiURL + ')');
                
                var _herOrHisName = $('<span class="herOrHisName"></span>');
                _herOrHisName.text(options.name);
                innerDiv.append(_herOrHisName);
                
                var _herOrHisAge = $('<span class="herOrHisAge"><i></i>岁</span>');
                _herOrHisAge.find('i').text(options.age);
                innerDiv.append(_herOrHisAge);
                
                var _herOrHisStars = $('<span class="herOrHisStars"></span>');
                switch(options.star){
                    case 0:
                        _herOrHisStars.text('');
                        break;
                    case 0.5:
                        _herOrHisStars.text('☆');
                        break;
                    case 1:
                        _herOrHisStars.text('★');
                        break;
                    case 1.5:
                        _herOrHisStars.text('★☆');
                        break;
                    case 2:
                        _herOrHisStars.text('★★');
                        break;
                    case 2.5:
                        _herOrHisStars.text('★★☆');
                        break;
                    case 3:
                        _herOrHisStars.text('★★★');
                        break;
                    case 3.5:
                        _herOrHisStars.text('★★★☆');
                        break;
                    case 4:
                        _herOrHisStars.text('★★★★');
                        break;
                    case 4.5:
                        _herOrHisStars.text('★★★★☆');
                        break;
                    case 5:
                        _herOrHisStars.text('★★★★★');
                        break;
                    default:
                        _herOrHisStars.text('');
                }
                innerDiv.append(_herOrHisStars);
                
                var _priceTag = $('<span class="priceTag">¥<i></i></span>');
                _priceTag.find('i').text(options.price);
                innerDiv.append(_priceTag);
                
                _this.append(innerDiv);
                
                innerDiv.on('click', function(){
                    options.clickCbk();
                });
                
            });
            
        },
        
    });
    
        
})(jQuery);
