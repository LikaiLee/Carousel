Welcome to Likai Lee's GitHub!
===================
# The First Project In GitHub --> JQuery旋转木马幻灯片特效
## CONTACTS ME : <likailee.cn@gmail.com>
<i class="icon-cog"></i> **使用方法** 
```html
<script src="js/jquery-1.9.1.min.js"></script> 
<script src="js/Carousel.js"></script> 
```
#### <i class="icon-file"></i> *调用
```html
$(function(){
			Carousel.init($("#carousel"));
			$("#carousel").init();
		});
```
#### <i class="icon-pencil"></i> *设置参数 
```html
<div class="poster-main" id="carousel" data-setting='{
							"width":1000,             幻灯片宽度
							"height":300,             幻灯片高度
							"posterWidth":600,        当前帧宽度
							"posterHeight":300,       当前帧高度
							"scale":0.8,              图片比例大小
							"speed":1000,             播放速度
							"autoPlay":true,          是否自动播放
							"delay":3000,             自动播放速度
							"verticalAlign":"middle"  垂直对齐方式
							}'> 
							
```
## License

Licensed under the MIT License
