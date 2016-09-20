/**
 * jQuery Carousel.js 
 * 旋转木马
 * https://github.com/LikaiLee/Carousel
 * MIT licensed
 * 
 * Author LikaiLee  HDU
 * Copyright (C) 2016 
 */
; (function($) {
    var Carousel = function(poster) {
        var me = this;
        this.poster = poster;
        this.posterItemMain = poster.find(".poster-list"); 
        this.nextBtn = poster.find(".poster-next-btn");
        this.prevBtn = poster.find(".poster-prev-btn");
        this.posterItems = poster.find(".poster-item");
        //偶数张
        if (this.posterItems.size() % 2 == 0) {
            this.posterItemMain.append(this.posterItems.eq(0).clone());
            this.posterItems = this.posterItemMain.children();
        };
        this.posterFirstItem = this.posterItems.first(); //第一个幻灯片
        this.posterLastItem = this.posterItems.last(); //最后/上一个幻灯片
        this.rotateFlag = true;

        //默认配置参数
        this.setting = {
            "width": 1000,//幻灯片总宽
            "height": 270,//幻灯片总高
            "posterWidth": 640, //第一帧宽度 --> 当前显示
            "posterHeight": 270, //第一帧高度 --> 当前显示
            "scale": 0.8, //记录显示比例关系	
            "speed": 1000,
            "autoPlay": true,
            "delay": 2000,//自动播放间隔时间
            "verticalAlign": "bottom" //top bottom middle
        };
        $.extend(this.setting, this.getSetting());
        this.setSettingValue();
        this.setPosterPos();
        this.nextBtn.click(function() {
            if (me.rotateFlag) {
                me.rotateFlag = false;
                me.carouselRotate("right");
            };

        });
        this.prevBtn.click(function() {
            if (me.rotateFlag) {
                me.rotateFlag = false;
                me.carouselRotate("left");
            };
        });
        if (this.setting.autoPlay) {
            this.autoPlay();
            this.poster.hover(function() {
                clearInterval(me.timer);
            },
            function() {
                me.autoPlay();
            });
        };

    };
    Carousel.prototype = {
        autoPlay: function() {
            var self = this;
            this.timer = setInterval(function() {
                self.nextBtn.click();
            },
            this.setting.delay);
        },

        //
        /**
         * [carouselRotate 旋转切换效果]
         * @param  {[type]} dir [方向]
         * @return {[type]}     [description]
         */
        carouselRotate: function(dir) {
            var _this_ = this;
            var zIndexArr = [];
            if (dir === "left") {
                this.posterItems.each(function() {
                    var self = $(this),
                    prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem,
                    width = prev.width(),
                    height = prev.height(),
                    zIndex = prev.css("z-index"),
                    opacity = prev.css("opacity"),
                    left = prev.css("left"),
                    top = prev.css("top");
                    zIndexArr.push(zIndex);
                    self.animate({
                        width: width,
                        height: height,
                        //zIndex:zIndex,
                        opacity: opacity,
                        left: left,
                        top: top
                    },
                    _this_.setting.speed,
                    function() {
                        _this_.rotateFlag = true;
                    });
                });
                //zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
                this.posterItems.each(function(i) {
                    $(this).css("zIndex", zIndexArr[i]);
                });
            } else if (dir === "right") {
                this.posterItems.each(function() {
                    var self = $(this),
                    next = self.next().get(0) ? self.next() : _this_.posterFirstItem,
                    width = next.width(),
                    height = next.height(),
                    zIndex = next.css("z-index"),
                    opacity = next.css("opacity"),
                    left = next.css("left"),
                    top = next.css("top");
                    zIndexArr.push(zIndex);
                    self.animate({
                        width: width,
                        height: height,
                        //zIndex:zIndex,
                        opacity: opacity,
                        left: left,
                        top: top
                    },
                    _this_.setting.speed,
                    function() {
                        _this_.rotateFlag = true;
                    });
                });
                //zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
                this.posterItems.each(function(i) {
                    $(this).css("zIndex", zIndexArr[i]);
                });
            }
        },

        /**
         * [setPosterPos 设置剩余帧的位置关系]
         * 
         */
        setPosterPos: function() {
            var self = this;
            //返回所有li  从已有的数组中返回选定的元素 
            var sliceItems = this.posterItems.slice(1),
            sliceSize = sliceItems.size() / 2,
            //返回第 0 - 2个li 右边幻灯片
            rightSlice = sliceItems.slice(0, sliceSize),
            //z-index 
            level = Math.floor(this.posterItems.size() / 2),
            //左边个数
            leftSlice = sliceItems.slice(sliceSize);
             //设置右边帧的位置关系 宽度 高度 top
            var rw = this.setting.posterWidth, //宽度
            rh = this.setting.posterHeight,//高度
            //间隙 = ((总宽 - 首张)/2)/右边张数
            gap = ((this.setting.width - this.setting.posterWidth) / 2) / level;
            //除去第一张后左右的宽度
            var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
            var fixOffsetLeft = firstLeft + rw; //第一张 + 左边宽度
            rightSlice.each(function(i) {
                level--; //z-index 逐个递减
                rw = rw * self.setting.scale; //缩放
                rh = rh * self.setting.scale; //缩放
                var j = i;
                $(this).css({
                    zIndex: level,
                    width: rw,
                    height: rh,
                    opacity: 1 / (++j),
                    // 1、1/1 2、1/2 
                    left: fixOffsetLeft + (++i) * gap - rw,
                    //第一张 + 左边宽度 + 总gap - 当前宽度
                    top: self.setVerticalAlign(rh)
                    //(self.setting.height - rh)/2 		//总高 - 第一张高度
                });
            });
            /**
             * [设置左边帧的位置关系 宽度 高度 top]
             * @param  {[type]} i) {     循环次数   }
             * @return {[type]}    [description]
             */
            var lw = rightSlice.last().width(),
            lh = rightSlice.last().height(),
            oloop = Math.floor(this.posterItems.size() / 2);
            
            leftSlice.each(function(i) {

                $(this).css({
                    zIndex: i,
                    width: lw,
                    height: lh,
                    opacity: 1 / oloop,
                    // 1、1/1 2、1/2 
                    left: i * gap,
                    //个数 * gap
                    top: self.setVerticalAlign(lh)
                    //(self.setting.height - lh)/2 	//总高 - 第一张高度
                });
                lw = lw / self.setting.scale;
                lh = lh / self.setting.scale;
                oloop--;
            });
        },
        /**
         * [setVerticalAlign 设置垂直排列对齐]
         * @param {[type]} height [幻灯片高度]
         * 
         */
        setVerticalAlign: function(height) {
            var verticalType = this.setting.verticalAlign,
            top = 0;
            if (verticalType === "middle") {
                top = (this.setting.height - height) / 2;
            } else if (verticalType === "top") {
                top = 0;
            } else if (verticalType === "bottom") {
                top = this.setting.height - height;
            } else {
                top = (this.setting.height - height) / 2;
            };

            return top;
        },

        /**
         * [setSettingValue 使用配置数值控制基本数值 ]
         * 
         */
        setSettingValue: function() {
            //幻灯片宽高
            this.poster.css({
                width: this.setting.width,
                height: this.setting.height,
                zIndex: this.posterItems.size() / 2,
            });
            //可使用 ul{width:100%;height:100%;}代替
            this.posterItemMain.css({
                width: this.setting.width,
                height: this.setting.height,

            });
            //计算按钮宽度
            var w = (this.setting.width - this.setting.posterWidth) / 2;
            //alert(this.posterItems.size()/2);
            this.prevBtn.css({
                width: w,
                height: this.setting.height,
                zIndex: Math.ceil(this.posterItems.size() / 2),
            });
            this.nextBtn.css({
                width: w,
                height: this.setting.height,
                zIndex: Math.ceil(this.posterItems.size() / 2),
            });
            //第一张
            this.posterFirstItem.css({
                width: this.setting.posterWidth,
                height: this.setting.posterHeight,
                left: w,
                zIndex: Math.floor(this.posterItems.size() / 2),
            });
        },
        getSetting: function() {
            var setting = this.poster.attr("data-setting");
            if (setting && setting != "") {
                return $.parseJSON(setting);
            } else {
                return [];
            }
        }
    };
    Carousel.init = function(posters) {
        var _this_ = this;
        posters.each(function() {
            new _this_($(this));
        });
    };
    window.Carousel = Carousel;
})(jQuery);
