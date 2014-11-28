/**
元素编辑
*/
var CP = {
	pC: ".p_canvas",
	pB: ".p_block",
	pBa: ".p_block_active",
	pBs: ".p_block_selected",
	pObj: ".p_obj",
	ele: null,
	init: function() {
		CP.tabs("#p_left_tabs");
		CP.tabToggle("#extend li dd");
		CP.pBlockActive();
		CP.addLayer();
		CP.bcolorSet();
		CP.fcolorSet(CP.pBs);
		CP.setting();
		$("#p_bar_5").hover(function() {
			if($(CP.pBs).length > 0){
				$(this).find("#f_opacity").show();
				CP.eleOpacitySet();
			}
		}, function() {
			$(this).find("#f_opacity").hide();
		})
		// if($(".p_obj").hasClass("p_block_selected")){
		// 	$("#p_bar_2").fadeIn();
		// 	$("#p_cut").click(function(){CP.cutEle()});
		// 	$("#p_copy").click(function(){CP.copyEle()});
		// 	$("#p_paste").click(function(){CP.pasteEle()});
		// 	$("#p_delete").click(function(){CP.delEle()});
		// }else{
		// 	$("#p_bar_2").hide();
		// }
		/**选择并插入元素*/
		new Dragdealer('e_op_slider', {
			css3: false,
			animationCallback: function(x, y) {
				$('#e_op_slider .value var').text(Math.round(x * 100));
			}
		});
		$(".p_c_box .inner").scroll(function(){
			if($(CP.pBa).length > 0){
				var tt = $(".p_c_box .inner").scrollTop();
				CP.ctrlTop();
			}
		})
		$(".p_children:visible").find("li").live("click", function() {
			var b = $(CP.pBa);
			var bl = $(CP.pB);
			var el = parseInt($(CP.pC).find(".p_obj").length) + 1;
			var _this = $(this);
			var c = _this.attr("style");
			var t = _this.parent().attr("data-type");
			if (bl.hasClass("p_block_active")) {
				$("#p_bar_2").fadeIn();
				if (t == "text") {
					var s = _this.html();
					b.append('<div id="block_' + el + '" data-ket="' + el + '" data-type="text" class="p_obj" data-drag="true" data-resize="true" data-rotate="true" data-opa="1"><div class="p_obj_txt" style="' + c + '">' + s + '：双击进行编辑</div></div>');
				} else if (t == "svg") {
					var s = _this.find("div").html();
					b.append('<div id="block_' + el + '" data-ket="' + el + '" data-type="svg" class="p_obj" data-drag="true" data-resize="true" data-rotate="true" data-opa="1" style="line-height:0">' + s + '</div>');
				} else if (t == "img") {
					var s = _this.find("img").attr("src");
					b.append('<div id="block_' + el + '" data-ket="' + el + '" data-type="img" class="p_obj" data-drag="true" data-resize="true" data-rotate="true" data-opa="1" style="line-height:0"><img src="' + s + '"/></div>');
				}
				$("#block_" + el).addClass("p_block_selected").siblings().removeClass("p_block_selected").parent().siblings().find(".p_block_selected").removeClass("p_block_selected");
				$("#block_" + el).trigger("click");
				CP.drag(CP.pBs);
				CP.resize(CP.pBs);
				CP.rotate(CP.pBs);
				CP.sBlockCtrl();
				CP.editTxt();
				$("#p_cut").click(function() {
					CP.cutEle()
				});
				$("#p_copy").click(function() {
					CP.copyEle()
				});
				$("#p_paste").click(function() {
					CP.pasteEle()
				});
				$("#p_delete").click(function() {
					CP.delEle()
				});
				CP.selSvg();
			} else {
				alert("请选择要编辑的区域!");
			}
		});
		/**键盘操作控制*/
		CP.keyHandle();
		$.Shortcuts.start();
	},
	ctrlTop:function(){
		var tt = $(".p_c_box .inner").scrollTop();
		var t = $(CP.pBa).offset().top+tt-80;
		$("#p_control").css({"display":"block","top":t+"px"});
		// console.log(t);
	},
	tabs: function(a) { //左侧导航切换
		$(a).find("li").click(function(e) {
			var _this = $(this);
			_this.addClass("active").siblings().removeClass("active");
			var tid = $(this).find("a").attr("href");
			$(tid).show().siblings().hide();
			if (tid == "#background") {
				e.preventDefault();
				var opVal = $(CP.pBa).find(".bgimage").css("opacity");
				if (opVal == "" || opVal == undefined) {
					return
				} else {
					CP.opacitySet();
				}
			}
			e.preventDefault();
		})
	},
	tabToggle: function(a) { //tab内上拉下拉
		$(a).find("a").click(function(e) {
			var _this = $(this);
			var _tHref = _this.attr("href");
			var _panel = $(_tHref).parent();
			if (_panel.hasClass("toggle")) {
				_panel.removeClass("toggle").find(".panel").slideUp();
			} else {
				_panel.addClass("toggle").siblings().removeClass("toggle").find(".panel").slideUp();
				$(".toggle").find(".panel").slideDown();
			}
			e.preventDefault();
		})
	},
	pBlockActive: function() { //选中编辑区域
		$(CP.pB).click(function() {
			$(this).addClass("p_block_active").siblings().removeClass("p_block_active");
			CP.ctrlTop();
			$("#p_control").css({"display":"block"});
			$(CP.pBa).children().click(function(e) {
				var _this = $(this);
				var _thisBg = _this.css("background-color");
				$(CP.pBs).removeClass("p_block_selected");
				_this.addClass("p_block_selected");
				var _thisOpacity = parseInt(_this.css("opacity") * 100);
				CP.drag(CP.pBs);
				CP.resize(CP.pBs);
				CP.rotate(CP.pBs);
				e.stopPropagation();
			});
			$(".p_c_box").click(function(e) {
				if ($(e.target).parents(CP.pC).length == 0) {
					var o = $(this);
					o.find(CP.pBa).removeClass("p_block_active");
					o.find(CP.pBs).removeClass("p_block_selected");
					$("#p_control").css({"display":"none"});
					o.find(CP.pBs).find("textarea").remove();
				}
			});
		})
	},
	pHover: function(a, b) {
		$(a).hover(function() {
			$(this).find(b).show();
		}, function() {
			$(this).find(b).hide();
		})
	},
	bcolorSet: function() { //背景颜色设置
		$(".color_set").find("span").colorpicker({
			fillcolor: true,
			event: 'mouseover',
			success: function(o, color) {
				$(".color_set span").css("backgroundColor", color);
				$(CP.pBa).find(".bgimage").css("backgroundColor", color);
			}
		});
		$(document).click(function(e) {
			if ($(e.target).parents(".color_set").length == 0) {
				var o = $(this);
				$("#_cclose").trigger("click");
			}
		});
	},
	fcolorSet: function(a) { //字体颜色设置
		$("#p_color").colorpicker({
			fillcolor: true,
			event: 'mouseover',
			success: function(o, color) {
				var t = $(a).attr("data-type");
				$("#p_color").css("backgroundColor", color);
				if(t == "text"){
					$(a).css("color", color);
				}else if(t == "svg"){
					$(a).find("svg").children().css("fill", color);
				}else{
					return
				}
			}
		});
		$(document).click(function(e) {
			if ($(e.target).parents("#p_color").length == 0) {
				var o = $(this);
				$("#_cclose").trigger("click");
			}
		});
	},
	opacitySet: function() { //背景透明度设置
		var op = $(CP.pBa).find(".bgimage").css("opacity");
		new Dragdealer('just-a-slider', {
			css3: false,
			animationCallback: function(x, y) {
				$('#just-a-slider .value var').text(Math.round(x * 100));
				$(CP.pBa).find(".bgimage").css({
					"opacity": Math.round(x * 100) / 100
				});
			}
		});
		$(CP.pBa).find(".bgimage").css({
			"opacity": op
		});
		$("#just-a-slider").find(".handle").css({
			"left": op * 100
		}).find(".value var").text(parseInt(op * 100));
		CP.pHover(".dragdealer .handle", "span");
	},
	eleOpacitySet: function() { //元素透明度设置
		var op = $(CP.pBa).find(".p_block_selected").attr("data-opa");
		new Dragdealer('e_op_slider', {
			css3: false,
			animationCallback: function(x, y) {
				$('#e_op_slider .value var').text(Math.round(x * 100));
				$(CP.pBa).find(".p_block_selected").children().not(".ui-resizable-handle,.ui-rotatable-handle").css({
					"opacity": Math.round(x * 100) / 100
				});
				$(CP.pBa).find(".p_block_selected").attr("data-opa",Math.round(x * 100) / 100);
			}
		});
		$(CP.pBa).find(".p_block_selected").children().not(".ui-resizable-handle,.ui-rotatable-handle").css({
			"opacity": op
		});
		$("#e_op_slider").find(".handle").css({
			"left": op * 100
		}).find(".value var").text(parseInt(op * 100));
		CP.pHover(".dragdealer .handle", "span");
	},
	drag: function(a) { //元素拖动
		var b = $(a).attr("data-drag");
		if (b == "true") {
			$(a).draggable({
				stop:function(){
					var h = $(a).parent().height();
					var ah = $(a).height();
					var prev = $(a).parent().prev();
					var next = $(a).parent().next();
					var t = parseInt($(a).css("top"));
					var pH = prev.height();
					var nct = t-h;
					var pct = pH+t;
					if(t > h-10 && next.length > 0){
						next.append($(a)).addClass("p_block_active").siblings().removeClass("p_block_active");
						next.find(".block_layer").remove();
						$(a).css("top",nct+"px");
					}else if(t < -ah+10 && prev.length > 0){
						prev.append($(a)).addClass("p_block_active").siblings().removeClass("p_block_active");
						prev.find(".block_layer").remove();
						$(a).css("top",pct+"px");
					}
				}
			});
		} else {
			return
		}
	},
	resize: function(a) { //元素缩放
		var b = $(a).attr("data-resize");
		if (b == "true") {
			$(a).resizable({
				handles: 'n,e,s,w,se,sw,ne,nw',
				stop: function() {
					var child = $(a).children().not(".ui-resizable-handle,.ui-rotatable-handle");
					var pH = child.height();
					var pW = child.width();
					var psH = $(a).height();
					var psW = $(a).width();
					if (psH < pH) {
						$(a).css({
							"height": pH
						});
					}
					if (psW < pW) {
						$(a).css({
							"width": pW
						});
					}
				}
			});
		} else {
			return
		}
	},
	rotate: function(a) { //元素旋转
		var b = $(a).attr("data-rotate");
		if (b == "true") {
			$(a).rotatable();
		} else {
			return
		}
	},
	addLayer: function() { //控制可编辑区域
		$(CP.pB).hover(function() {
			var _this = $(this);
			if (_this.hasClass("p_block_active")) {
				_this.find(".block_layer").remove();
			} else{
				if(_this.find(".block_layer").length == 0){
					_this.append('<div class="block_layer">点击进行编辑</div>');
				}else{
					return
				}
				
			}
		}, function() {
			if ($(".block_layer")) {
				$(this).find(".block_layer").remove();
			}
		});
		$(".block_layer").live("click", function() {
			$(this).remove();
		})
	},
	keyHandle: function() { //键盘控制
		$.Shortcuts.add({
			type: 'down',
			mask: 'delete',
			handler: function() {
				CP.delEle()
			}
		});
		$.Shortcuts.add({
			type: 'down',
			mask: 'ctrl+c',
			handler: function() {
				CP.copyEle()
			}
		});
		$.Shortcuts.add({
			type: 'down',
			mask: 'ctrl+x',
			handler: function() {
				CP.cutEle()
			}
		});
		$.Shortcuts.add({
			type: 'down',
			mask: 'ctrl+v',
			handler: function() {
				CP.pasteEle()
			}
		});
		$.Shortcuts.add({
			type: 'hold',
			mask: 'up',
			handler: function() {
				CP.upEle()
			}
		});
		$.Shortcuts.add({
			type: 'hold',
			mask: 'down',
			handler: function() {
				CP.downEle()
			}
		});
		$.Shortcuts.add({
			type: 'hold',
			mask: 'left',
			handler: function() {
				CP.leftEle()
			}
		});
		$.Shortcuts.add({
			type: 'hold',
			mask: 'right',
			handler: function() {
				CP.rightEle()
			}
		});
	},
	delEle: function() { //元素删除
		if ($(CP.pObj).hasClass("p_block_selected")) {
			$(CP.pBs).remove();
		} else {
			alert("没有选中元素！");
		}
	},
	copyEle: function() { //元素复制
		if ($(CP.pObj).hasClass("p_block_selected")) {
			CP.ele = $(CP.pBs).html();
		} else {
			alert("没有选中元素！");
		}
	},
	cutEle: function() { //元素剪切
		if ($(CP.pObj).hasClass("p_block_selected")) {
			CP.ele = $(CP.pBs).html();
			$(CP.pBs).remove();
		} else {
			alert("没有选中元素！");
		}
	},
	pasteEle: function() { //元素粘贴
		if ($(CP.pB).hasClass("p_block_active")) {
			if (CP.ele != "" && CP.ele != undefined) {
				var b = $(CP.pBa);
				var el = parseInt($(CP.pC).find(".p_obj").length) + 1;
				b.append('<div id="block_' + el + '" data-ket="' + el + '" class="p_obj" data-drag="true" data-resize="true" data-rotate="true">' + CP.ele + '</div>');
				$("#block_" + el).find(".ui-resizable-handle").remove().siblings(".ui-rotatable-handle").remove();
				$("#block_" + el).addClass("p_block_selected").siblings().removeClass("p_block_selected");
				$("#block_" + el).trigger("click");
				CP.drag(CP.pBs);
				CP.resize(CP.pBs);
				CP.rotate(CP.pBs);
				CP.editTxt();
			} else {
				alert("没有可粘贴的元素！");
			}
		} else {
			alert("没有选中编辑区域！");
		}
	},
	upEle: function() { //元素向上移动
		if ($(CP.pObj).hasClass("p_block_selected")) {
			var top = parseInt($(CP.pBs).css("top"));
			top--;
			$(CP.pBs).css("top", top + "px");
		}
	},
	downEle: function() { //元素向下移动
		if ($(CP.pObj).hasClass("p_block_selected")) {
			var top = parseInt($(CP.pBs).css("top"));
			top++;
			$(CP.pBs).css("top", top + "px");
		}
	},
	leftEle: function() { //元素向左移动
		if ($(CP.pObj).hasClass("p_block_selected")) {
			var left = parseInt($(CP.pBs).css("left"));
			left--;
			$(CP.pBs).css("left", left + "px");
		}
	},
	rightEle: function() { //元素向右移动
		if ($(CP.pObj).hasClass("p_block_selected")) {
			var left = parseInt($(CP.pBs).css("left"));
			left++;
			$(CP.pBs).css("left", left + "px");
		}
	},
	setting:function(){
		$("#p_control").find("li").each(function(i){
			var _t = $(this);
			_t.click(function(){
				if(i == 0){//添加画板
					var el = parseInt($(CP.pC).find(".p_block").length) + 1;
					var s = $(CP.pBa).attr("style");
					$(CP.pBa).after('<div id="p_block_'+ el +'" class="p_block" style="'+ s +'"><div id="block_'+ el +'_bgimage" data-ket="0" class="bgimage backrround_layer" data-drag="false" data-resize="false" style="background-color:#fff;opacity:1"></div></div>');
					$("#p_block_"+ el).addClass("p_block_active").siblings().removeClass("p_block_active");
					initPactive();
					var t = $("#p_block_"+ el).offset().top-80;
					$("#p_control").css({"top":t+"px"});
				}else if(i == 1){//删除画板
					if($(CP.pC).find(".p_block").length > 1){
						$(CP.pBa).remove();
						$("#p_control").hide();
					}else{
						alert("不能删除最后一个");
					}
				}else if(i == 2){//克隆画板
					var el = parseInt($(CP.pC).find(".p_block").length) + 1;
					var ol = parseInt($(CP.pC).find(".p_obj").length);
					var d = $(CP.pBa).clone().addClass("p_block_active").attr("id","p_block_"+el);
					$(CP.pBa).after(d);
					$(CP.pC).find(".p_block_selected").removeClass("p_block_selected");
					$("#p_block_"+ el).addClass("p_block_active").siblings().removeClass("p_block_active");
					for(var x = 0;x < ol;x++){
						$("#p_block_"+el).find(".p_obj").eq(x).attr("id","block_"+(ol+x+1));
					}
					initPactive();
					var t = $("#p_block_"+ el).offset().top-80;
					$("#p_control").css({"top":t+"px"});
				}else if(i == 3){//向上移动
					var prv = $(CP.pBa).prev();
					var t = $(".p_block_active").offset().top-80;
					if(prv.length > 0){
						prv.before($(CP.pBa));
						$("#p_control").css({"top":t+"px"});
					}
				}else if(i == 4){//向下移动
					var next = $(CP.pBa).next();
					var t = $(".p_block_active").offset().top-80;
					if(next.length > 0){
						next.after($(CP.pBa));
						$("#p_control").css({"top":t+"px"});
					}
				}else if(i == 5){
					return
				}
			})
		});
		function initPactive(){
			CP.pBlockActive();
			CP.addLayer();
			CP.bcolorSet();
			CP.fcolorSet(CP.pBs);
		}
	},
	sBlockCtrl:function(){
		var psL = $(CP.pC).find(".p_block_selected").length;
		var child = $(CP.pC).find(".p_block_selected").children().not(".ui-resizable-handle,.ui-rotatable-handle");
		if(psL > 0){
			$("#p_fliplr").toggle(function(){	
				child.css({"-moz-transform":"scaleX(-1)","-webkit-transform":"scaleX(-1)","-o-transform":"scaleX(-1)","transform":"scaleX(-1)","filter":"FlipH"});
			},function(){
				child.css({"-moz-transform":"scaleX(1)","-webkit-transform":"scaleX(1)","-o-transform":"scaleX(1)","transform":"scaleX(1)","filter":"none"});
			})
			$("#p_fliptb").toggle(function(){	
				child.css({"-moz-transform":"scaleY(-1)","-webkit-transform":"scaleY(-1)","-o-transform":"scaleY(-1)","transform":"scaleY(-1)","filter":"FlipV"});
			},function(){
				child.css({"-moz-transform":"scaleY(1)","-webkit-transform":"scaleY(1)","-o-transform":"scaleY(1)","transform":"scaleY(1)","filter":"none"});
			})
		}
		$("#p_layer").find("li").each(function(i){
			$(this).click(function(){
				if(i == 0){
					var par = $(CP.pBs).parent();
					par.append($(CP.pBs));
				}else if(i == 1){
					var next = $(CP.pBs).next();
					if(next.length > 0){
						next.after($(CP.pBs));
					}
				}else if(i == 2){
					var prv = $(CP.pBs).prev();
					if(prv.length > 0){
						prv.before($(CP.pBs));
					}
				}else if(i == 3){
					var par = $(CP.pBs).parent();
					par.prepend($(CP.pBs));
				}
			})
		})
	},
	selSvg:function(){
		// $(CP.pBs).find("svg").find("circle").click(function(e){
		// 	e.stopPropagation();
		// 	$(this).parents("svg").find(".s_seled").attr("class","");
		// 	$(this).attr("class","s_seled");
		// })
		// $(CP.pBs).find("svg").find("path").click(function(e){
		// 	e.stopPropagation();
		// 	$(this).parents("svg").find(".s_seled").attr("class","");
		// 	$(this).attr("class","s_seled");
		// })
		// $(CP.pBs).find("svg").find("rect").click(function(e){
		// 	e.stopPropagation();
		// 	$(this).parents("svg").find(".s_seled").attr("class","");
		// 	$(this).attr("class","s_seled");
		// })
		// $(CP.pBs).find("svg").find("ellipse").click(function(e){
		// 	e.stopPropagation();
		// 	$(this).parents("svg").find(".s_seled").attr("class","");
		// 	$(this).attr("class","s_seled");
		// })
		// $(CP.pBs).find("svg").find("polygon").click(function(e){
		// 	e.stopPropagation();
		// 	$(this).parents("svg").find(".s_seled").attr("class","");
		// 	$(this).attr("class","s_seled");
		// })
	},
	editTxt: function() { /文本编辑/
		$(CP.pBs).dblclick(function() {
			if ($(".p_obj_txt_textarea").length > 0) {
				return
			} else {
				var _this = $(this).find(".p_obj_txt");
				var _child = $(CP.pBs).children().not(".ui-resizable-handle,.ui-rotatable-handle");
				var s = _this.attr("style");
				_this.css({
					"visibility": "hidden"
				}).parent().append('<textarea id="p_edit_textarea" class="p_obj_txt_textarea" style="' + s + ';resize: none;">' + _this.html() + '</textarea>');
				var txt = _this.html();
				$("#p_edit_textarea").change(function() {
					txt = $(this).val();
				});
				$("#p_edit_textarea").blur(function() {
					_this.css({
						"visibility": ""
					}).html(txt);
					$(this).remove();
				});
				$("#f_sel").change(function() {
					var f_val = $(this).val();
					$(this).css("font-family", f_val);
					$(CP.pBs).find(".p_obj_txt,.p_edit_textarea").css("font-family", f_val);
				})
				$("#f_size_sel").change(function() {
					var s_val = $(this).val();
					$(CP.pBs).find(".p_obj_txt,.p_edit_textarea").css("font-size", s_val + "px");
					var pH = $(".p_obj_txt").height();
					$(CP.pBs).css("height", pH);
				})
				$("#p_bold").click(function() {
					if ($(CP.pObj).hasClass("p_block_selected")) {
						var s = $(".p_block_selected").css("font-weight");
						if (s == "bold") {
							$(CP.pBs).css("font-weight", "normal");
							_child.css("font-weight", "normal");
						} else {
							$(CP.pBs).css("font-weight", "bold");
							_child.css("font-weight", "bold");
						}
					}
				})
				$("#p_italic").click(function() {
					if ($(CP.pObj).hasClass("p_block_selected")) {
						var s = $(CP.pBs).css("font-style");
						if (s == "italic") {
							$(CP.pBs).css("font-style", "normal");
							_child.css("font-style", "normal");
						} else {
							$(CP.pBs).css("font-style", "italic");
							_child.css("font-style", "italic");
						}
					}
				})
				$("#f_center ul").find("li").each(function(i) {
					$(this).click(function() {
						if (i == 0) $(CP.pBs).css("text-align", "left"), _child.css("text-align", "left");
						if (i == 1) $(CP.pBs).css("text-align", "right"), _child.css("text-align", "right");
						if (i == 2) $(CP.pBs).css("text-align", "center"), _child.css("text-align", "center");
						if (i == 3) $(CP.pBs).css("text-align", "Justify"), _child.css("text-align", "justify");
					})
				})
			}
		})
	}
};
/**
公共js
*/
var CM = {
	init:function(){
		CP.init();
		LS.init();
		CM.setWH();
		CM.setCanvas();
	},
	setWH: function() {
		setBtop();
		$(window).resize(function() {
			setBtop();
		})
		function setBtop() {
			var barH = $("#edit_menu").height();
			$(".p_c_box").css({
				"top": barH
			});
		}
	},
	setCanvas:function(){
		$("#setting").find(".icon_advsettingW").toggle(function(){
			var cw = parseInt($(".p_canvas").width());
			var ov = null;
			for(var i = 0; i < 4;i++){
				ov = parseInt($(".c_width").find("option").eq(i).val());
				if(ov == cw){
					$(".c_width").find("option").eq(i).attr("selected","selected");
				}
			}
			$(this).parent().find(".p_set").slideDown();
		},function(){
			$(this).parent().find(".p_set").slideUp();
		})
		$(".c_width").change(function(){
			var opV = $(this).find("option:selected").val();
			$(".p_canvas").css("width",opV+"px");
		})
		$("#s_width").change(function(){
			var v = $(this).val();
			$(".p_canvas").css("width",v+"px");
		})
		$(".b_height").change(function(){
			var v = $(this).val();
			$(".p_block_active").css("height",v+"px");
		})
	}
}
//加载svg图形
var LS = loadSvg = {
	pChild:".p_children",
	init:function(){
		LS.smallSvgLoad();
	},
	smallSvgLoad:function(){//svg图像的加载
		var a = $(LS.pChild).find("li");
		var l = a.length;
		for(var i = 0; i < l; i++){
			var b = a.eq(i).find(".p_l_wrap");
			var id = b.attr("id");
			var u = b.attr("data-src");
			b.load(u,function(){
				for(var j = 0; j < l; j++){
					b = a.eq(j).find(".p_l_wrap");
					id = b.attr("id");
					var v = b.find("svg").attr({"id":id+"_svg","width":"100%","height":"100%","viewBox":"0 0 100 100","enable-background":"new 0 0 100 100","preserveAspectRatio":"none"});
					b.html(v);
				}
			});
		}
	}
}