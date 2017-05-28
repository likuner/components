
//合并对象（深拷贝）
function merge(obj1, obj2){
	for(var key in obj2){
		if(obj2.hasOwnProperty(key)){
			if(typeof obj2[key] === "object"){
				obj1[key] = (obj2[key] instanceof Array) ? [] : {};
				arguments.callee(obj1[key], obj2[key]);
			}else{
				obj1[key] = obj2[key];
			}
		}
	}
	return obj1;
}

