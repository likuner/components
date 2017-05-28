	//对话框的基本html内容，绝对定位，高宽设置，背景图片，标题，两个按钮图 
	var hd_dialog_content =
	    "<ul id='hd_dialog' style='position:absolute;width:500px;height:290px;border-radius:10px;margin:0;padding:0;display:none;'>"+
            "<li id='dialog_lb_text' style='margin:0;padding:0;color:#333;font-size:40px;list-style:none;height:140px;background:#fff;border-radius:10px 10px 0 0;text-align:center;line-height:140px;overflow:hidden;'></li>"+
            "<li style='margin:0;padding:0;cursor:pointer;list-style:none;height:149px;background:#f4f7f7;border-top:1px solid #dae2e7;border-radius:0 0 10px 10px;text-align:center;'>"+
                "<span id='hd_dialog_ok' style='display:inline-block;width:200px;height:70px;background:#fe7400;color:#fff;font-size:30px;margin-top:40px;border-radius:10px;text-align:center;line-height:66px;padding:0;'>气体复测</span>"+
                "<span id='hd_dialog_cancel' style='display:inline-block;width:200px;height:70px;background:#18ca13;color:#fff;font-size:30px;margin:40px auto auto 40px;border-radius:10px;text-align:center;line-height:66px;padding:0;'>作业关闭</span>"+
            "</li>"+
        "</ul>";
	/*
		"<ul id='hd_dialog' style='position:absolute;width:31.25rem;height:18.125rem;border-radius:0.625rem;margin:0;padding:0;'>"+
			"<li id='dialog_lb_text' style='margin:0;padding:0;color:#333;font-size:2.5rem;list-style:none;height:8.75rem;background:#fff;border-radius:0.625rem 0.625rem 0 0;text-align:center;line-height:8.75rem;overflow:hidden;'></li>"+
			"<li style='margin:0;padding:0;cursor:pointer;list-style:none;height:9.3125rem;background:#f4f7f7;border-top:0.0625rem solid #dae2e7;border-radius:0 0 0.625rem 0.625rem;text-align:center;'>"+
				"<span id='hd_dialog_ok' style='display:inline-block;width:12.5rem;height:4.375rem;background:#fe7400;color:#fff;font-size:1.875rem;margin-top:2.5rem;border-radius:0.625rem;text-align:center;line-height:4.125rem;padding:0;'>气体复测</span>"+
				"<span id='hd_dialog_cancel' style='display:inline-block;width:12.5rem;height:4.375rem;background:#18ca13;color:#fff;font-size:1.875rem;margin:2.5rem auto auto 2.5rem;border-radius:0.625rem;text-align:center;line-height:4.125rem;padding:0;'>作业关闭</span>"+
			"</li>"+
		"</ul>";
    */
	var shadeDiv = 
		"<div id='dialog_shade' style='width:100%;height:100%;position:fixed;z-index:88888888;background:#333;opacity:0.4;display:none;'></div>";

	//text：标题，type：对话框类型，buttons: 按钮文本, funcOK/funcCancel: 回调函数
	function showhdDialog(text, buttons, funcOK, funcCancel) { 
		initDialog();
		var dialogid = "#hd_dialog";
		var dialogshade = "#dialog_shade";
		$(dialogid).fadeIn();
		$("#dialog_lb_text").html(text);
        
        
		switch (buttons.length) { 
			//展示信息的对话框，带一个确定键，点击后消失 
			case 1:             
			$("#hd_dialog_cancel").hide(); 
			$("#hd_dialog_ok").unbind(); 
			$(dialogshade).stop().fadeIn(200);
			$("#hd_dialog_ok").html(buttons[0]);
			$("#hd_dialog_ok").click(function () {
				$(dialogid).stop().fadeOut(200); 
				$(dialogshade).stop().fadeOut(200);
				return false;
			}); 
			break; 
			     
			//确认对话框，带确认取消键，确认则执行函数，否则不执行并消失 
			case 2:
			$("#hd_dialog_cancel").show(); 
			$("#hd_dialog_ok").unbind(); 
			$("#hd_dialog_cancel").unbind(); 
			$(dialogshade).stop().fadeIn(200);
			$("#hd_dialog_ok").html(buttons[0]);
			$("#hd_dialog_cancel").html(buttons[1]);
			$("#hd_dialog_ok").click(function () { 
				funcOK();
				$(dialogid).stop().fadeOut(200);
				$(dialogshade).stop().fadeOut(200);
			}); 
			$("#hd_dialog_cancel").click(function () { 
				funcCancel();
				$(dialogid).stop().fadeOut(200);
				$(dialogshade).stop().fadeOut(200);
			}); 
			break; 
			
			default:
			return false;
		} 
		
	} 


function initDialog() { 
	$("body").before(hd_dialog_content); 
	$("body").before(shadeDiv); 
	//计算恰当的中间位置 
	var top_percent = (window.innerHeight / 3) / window.innerHeight;
	var left_percent = (window.innerWidth / 2 - $("#hd_dialog").width() / 2) / window.innerWidth; 
	$("#hd_dialog").css("top", top_percent * 100 + "%"); 
	$("#hd_dialog").css("left", left_percent * 100 + "%"); 
	$("#hd_dialog").css("z-index", "99999999"); 
	$("#hd_dialog").stop().hide(); 
}