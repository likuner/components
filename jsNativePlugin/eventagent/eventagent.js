window.onload = function(){

	/**
		事件委托或者叫事件代理, 即利用事件冒泡，
		只指定一个事件处理程序，就能管理相同类型的所有事件，
		事件的三个阶段：1、事件捕获；2、事件目标；3、事件冒泡
		可以用事件对象的 event.eventPhase 属性获取事件阶段
	**/
	var list = document.getElementById("list");
	list.addEventListener("click", function(e){
		var e = e || window.event;
		var target = e.target || e.srcElement;
		if(target.nodeName.toLowerCase() == "li"){
			console.info(e.eventPhase);
			console.info(target.id);
		}else{
			console.info(target.nodeName.toLowerCase() + "\n" + e.eventPhase);
		}
	});

	var newLi = document.createElement("li");
	newLi.id = "li6";
	newLi.innerHTML = 6;
	list.appendChild(newLi);

}