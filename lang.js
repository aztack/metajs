//javascript language extensions
(function(exports){
	//Modified from Crockford's String.prototype.supplant
	//see http://javascript.crockford.com/remedial.html

	exports.fmt = (function(){
		//array data extractor0
		function a(w,m,args){
			var x = args[+m];
			return typeof(x)=="function" ? x() : x;
		}
		
		//array data extractor1
		function b(w,m,args){
			var x = args.shift();
			return typeof(x)=="function" ? x() : x;
		}
		
		//object data extractor
		function o(w,m,args){
			var x = args[m] ? args[m] : w;
			return typeof(x)=="function" ? x() : x;
		}
		
		//format
		return function(fmt,args,shift){
			var f = args.splice ? (shift ? b : a) : o,
				fmt = fmt.splice ? fmt.join("") : fmt;
			return fmt.replace(/{([a-zA-Z0-9_$]+)}/g,function(w,m){
				return f(w,m,args);
			});
		};
	})();
	
	var useGetter = false
	function def(who,name,fn){
		if(useGetter && typeof(who.prototype.__defineGetter__)=="function"){
			who.prototype.__defineGetter__(name,fn);
		}else{
			who.prototype[name] = fn;
		}
	}
	
	function alias(who,name,exist){
		who.prototype[name] = who.prototype[exist];
	}
	//array
	def(Array,"first",function(){
		return this[0];
	});
	
	def(Array,"second",function(){
		return this[2];
	});
	
	def(Array,"last",function(){
		return this[this.length-1];
	});
	
	alias(Array,"each","forEach");

	Array.prototype.eachWithIndex = function(fn){
		for(var i=0;i<this.length;++i){
			fn(this[i],i);
		}
	};
	
	Array.prototype.map = function(fn){
		var r = [];
		for(var i=0;i<this.length;++i){
			r.push(fn(this[i],i));
		}
		return r;
	};
	
	Array.prototype.collect = function(fn){
		var r = [];
		for(var i=0;i<this.length;++i){
			if(fn(this[i],i))r.push(this[i]);
		}
		return r;
	};
	
	alias(Array,"select","collect");
	alias(Array,"inject","reduce");
	
	Array.prototype.reject = function(){
		var r = [];
		for(var i=0;i<this.length;++i){
			if(!fn(this[i],i))r.push(this[i]);
		}
		return r;
	};
	
	
	//object
	def(Object,"keys",function(){
		var r = [];
		for(var i in this){
			if(this.hasOwnProperty(i))r.push(i);
		}
		return r;
	});
	
	def(Object,"values",function(){
		var r = [];
		for(var i in this){
			if(this.hasOwnProperty(i))r.push(this[i]);
		}
		return r;
	});
	
	Object.prototype.each = function(fn){
		for(var i in this){
			if(this.hasOwnProperty(i))fn(i,this[i]);
		}
	};
	Object.prototype.toArray = function(){
		var r = [];
		for(var i in this){
			if(this.hasOwnProperty(i))r.push([i,this[i]]);
		}
		return r;
	};
	Object.prototype.size = function(){
		var s = 0;
		for(var i in this){
			if(this.hasOwnProperty(i))s++;
		}
		return s;
	};
	Object.fromArray = function(ks,vs,flag){
		var max = Math.max(ks.length,vs.length),
			min = Math.min(ks.length,vs.length),
			len = flag ? max : min,
			o = {};
		for(var i = 0;i<len;++I){
			o[ks[i]] = vs[i];
		}
		return o;
	};
	
	
	//string
	String.prototype.multiply = function(n,s){
		var r = [];
		while(n--)r.push(this);
		return r.join(s ? s : "")
	};
	
	String.prototype.format = function(data,shift){
		return fmt(this,data,shift);
	};
	String.prototype.capitalize = function(){
		return this[0].toUpperCase() + this.substr(1).toLowerCase();
	};
})(this);