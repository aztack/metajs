(function(_G){
	load("lang.js");
	var endl = "\r\n";
	var $ = {
		namespaces:{},		
	};
	/**
	 * the program unit
	 */
	//flags
	_G.local = "var ";
	var u = _G.__ = function(desc){
		$.description = desc;
		return u;
	};
	var keyword = function(){
		return u;
	};
	u.serialize = function(format){
		format = format.toLowerCase()
		if(format=="json"){
			print(JSON.stringify($));
		}else if(format=="jsdoc"){
		}else if(format=="js"){
		}else{
			print("Unsupported format:"+format);
		}
	};
	
	u.__ = function(){return u;};
	u.state = ["global"];
	u.end = function(){
		u.state.pop();
		return u;
	};
	
	u.namespace = function(ns){
		var doc = u._doc;
		u.state.push("namespace");		
		u.cur = u._namespace = $.namespaces[ns] = {
			//order is important
			constants:[],
			variables:[],
			local:[],
			functions:[],
			modules:{},
			interfaces:{},
			classes:{}			
		};
		u._doc = undefined;
		return u;
	};
	u.constant = function(c,value,flag){
		var doc = u._doc;
		u._namespace.constants.push({flag:flag,doc:doc,name:c,value:value.toString()});
		u._doc = undefined;
		return u;
	};
	u.variable = function(c,value,flag){
		var doc = u._doc;
		u._namespace.constants.push({flag:flag,doc:doc,name:c,value:value.toString()});
		u._doc = undefined;
		return u;
	};
	u.module = function(m,flag){
		var doc = u._doc;
		u.cur = u._module = u._namespace.modules[m] = {flag:flag,functions:{}};
		u._doc = undefined;
		return u;
	};
	u.class = function(c,flag){
		var doc = u._doc;
		u.state.push("class");
		u.cur = u._class = u._namespace.classes[c] = {
			flag:flag,doc:doc,statics:{},publics:{},privates:{},properties:{}
		};
		u._doc = undefined;
		return u;
	};
	u.interface = function(i,flag){
		var doc = u._doc;
		u.state.push("interface")
		u.cur = u._interface = u._namespace.interfaces[i] = {
			flag:flag,functions:{},doc:doc
		};
		u._doc = undefined;
		return u;
	};
	u.method = function(name,fn,flag){
		var doc = u._doc;
		var s = u.state.last();
		if(s == "global"){
			u.cur.functions[name] =	{name:name,body:fn.toString(),doc:doc};
		}else if(s == "namespace"){
			u.cur.functions[name] = {name:name,body:fn.toString(),doc:doc,flag:flag};
		}else if(s == "module"){
			u.cur.functions[name] = {name:name,body:fn.toString(),doc:doc};
		}else if(s == "interface"){
			u.cur.functions[name] = {name:name,body:fn.toString(),doc:doc};
		}else if(s == "class"){
			u.cur.functions[name] = {name:name,body:fn.toString(),doc:doc};
		}else if(s == "@static"){
			u.cur.statics[name] =	{name:name,body:fn.toString(),doc:doc};
		}else if(s == "@private"){
			u.cur.privates[name] =	{name:name,body:fn.toString(),doc:doc};
		}else if(s == "@public"){
			u.cur.publics[name] =	{name:name,body:fn.toString(),doc:doc};
		}
		u._doc = undefined;
		return u;
	};
	u.property = function(type,name,value,flag){
		var doc = u._doc;
		var s = u.state.last();
		if(s != "class" && s!="@public" && s!="@private" && s!="@static"){
			throw Error("Only class can has property!");
		}
		var v = "publics"
		s=="@private" ? v = "privates" : v = "statics";
		var body = typeof(value)=="function" ? value.toString() : JSON.stringify(value);
		u.cur[v][name] = {type:type,body:body,doc:doc}
		u._doc = undefined;
		return u;
	};
	u.event = function(){
		//TODO
		return u;
	};
	u.implements = function(i){
		var s = u.state.last();
		if(s != "class"){
			throw Error("Only class can implements");
		}
		u.cur.implements = i;
		//TODO
		return u;
	};
	u.extends = function(c){
		var s = u.state.last();
		if(s != "class"){
			throw Error("Only class can extends");
		}
		u.cur.extends = c;
		//TODO
		return u;
	};
	u.include = function(m){
		var s = u.state.last();
		if(s != "class" && s != "module"){
			throw Error("Only class/module can include");
		}
		if(u.cur.include == undefined)u.cur.include = [];
		u.cur.include.push(m);
		//TODO
		return u;
	};
	u.constructor = function(ctor){
		var doc = u._doc;
		var s = u.state.last();
		if(s != "@static" && s != "@public" && s != "@private" && s!= "interface"){
			throw Error("Only class/interface can has constructor");
		}
		u.cur.ctor = ctor.toString();
		u._doc = undefined;
		return u;
	};
	u.destructor = function(dtor){
		var doc = u._doc;
		var s = u.state.last();
		if(s != "@static" && s != "@public" && s != "@private" && s!= "interface"){
			throw Error("Only class/interface can has destructor");
		}
		u.cur.dtor = dtor;
		u._doc = undefined;
		return u;
	};
	u.public = function(){
		var s = u.state.last();
		if(s == "@private" || s == "@static"){
			u.state.pop();
		}
		u.state.push("@public");
		return u;
	};
	u.private = function(){
		var s = u.state.last();
		if(s == "@public" || s == "@static"){
			u.state.pop();			
		}		
		u.state.push("@private");
		return u;
	};
	u.static = function(){
		var s = u.state.last();
		if(s == "@public" || s ==  "@private"){
			u.state.pop();			
		}
		u.state.push("@static");
		return u;
	};
	u.doc = function(d){
		u._doc = d;
		return u;
	};
	u.sign = function(){
		return u;
	}
	u.ret = function(){
		return u;
	}
})(this);