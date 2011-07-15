/**
 * metajs core
 */
$FILE = "example.json";
(function(opts){
	load("lang.js");	//language extension
    load("jsb.js");
	var Scope_ = "exports",Scope = Scope_+".";
	var Top = opts.top;
	var _ = opts.doc();
	eval("var json = "+read($FILE));

	var code = [],c = "";
	if(typeof(json.namespaces)=="undefined"){
		throw Error("Every program unit must has one and only one namespace!");
	}
	code.__defineSetter__("$",function(v){this.push(v);});
	code.__defineSetter__("_$",function(v){this.push("\n"+v);});
	code.__defineSetter__("$_",function(v){this.push(v+"\n");});
	
	code.$ = _(json.description);
	code.$ = "(function(){";
	/**
	 * namespace
	 */
	var ns = json.namespaces.keys().first(),parts = ns.split(".");
	var parent = 'window';
	code.$ = "// "+ns;
	parts.each(function(part){
		code.$ = fmt([
			'if(typeof({parent}.{part})=="undefined"){',
			'	{parent}.{part} = {};',
			'}'
		],{parent:parent,part:part});
		parent = part;
	});
	code.$_ = fmt("var {0} = {1};",[Scope_,ns]);
	var Namespace = json.namespaces.values().first();
	
	/**
	 * constants
	 */
	code._$ = _("constants");
	Namespace.constants.each(function(v){		
		code.$ = fmt("{0}{1} = {2};",[(v.flag || Scope),v.name,v.value]);
	});
	
	/**
	 * variables
	 */
	code._$ = _("variables");
	Namespace.variables.each(function(v){		
		code.$ = fmt("{0}{1} = {2};",[(v.flag || Scope),v.name,v.value]);
	});
	/**
	 * functions
	 */
	code._$ = _("functions");
	Namespace.functions.each(function(v){
		code.$ = fmt("{0}{1} = {2};",[(v.flag || Scope),v.name,v.value]);
	});
	 
	/**
	 * modules
	 */
	code._$ = _("modules");
	Namespace.modules.each(function(m,module){		
		code.$ = fmt("{flag}{module} = {{functions}};",{
			ns:ns,module:m,functions:funcs,flag:(module.flag || Scope)
		});
		function funcs(){
			var t = [];	
			module.functions.each(function(k,v){
				var o = {doc:_(v.doc),name:k,fn:v.body};
				t.push(fmt("\n{doc}\n{name}:{fn}",o));
			});
			return t.join(",");
		}
	});
	
	/**
	 * interfaces
	 */
	code._$ = _("interfaces");
	Namespace.interfaces.each(function(name,iface){
		if(!iface.ctor)iface.ctor = (function(){}).toString();
		code.$ = fmt([
			"{doc}\n",
			"{scope}{name} = {ctor};"
		],{doc:_(iface.doc),ns:ns,name:name,ctor:iface.ctor,scope:Scope});
		
		iface.functions.each(function(n,fn){
			code.$ = fmt([
				"{doc}\n",
				"{scope}{iname}.prototype.{name} = {body};"
			],{
				doc:_(fn.doc),iname:name,name:n,body:fn.body,scope:Scope
			});
		});
	});
	/**
	 * classes
	 */
	code._$ = _("classes")
	Namespace.classes.each(function(name,klass){
		if(!klass.ctor)klass.ctor = (function(){}).toString();
		
		var hasPrivates = klass.privates.size()>0;
		if(hasPrivates){
			klass.ctor = klass.ctor.replace(/}$/,"this.__init__();}");
		}
		code.$ = fmt([
			"{doc}",
			"{scope}{kname} = {ctor}"
		],{doc:_(klass.doc),kname:name,ctor:klass.ctor,scope:Scope});
		
		if(hasPrivates){
			code.$ = "{scope}{kname}.prototype.__init__ = function(){{data}\n};".format(
				{scope:Scope,kname:name,data:klass.privates.toArray().map(function(e){
					var fname = e[0],fn = e[1];
					return fmt([
						"\n{doc}\n",
						"this.{name} = {fn};"
					],{doc:_(fn.doc),name:fname,fn:fn.body});
				}).join("")
			});
		}
		
		code.$ = fmt([
			"{scope}{kname}.prototype = new {base}();"
		],{kname:name,base:klass.extends,scope:Scope});
		
		klass.statics.each(function(fname,fn){
			code.$ = fmt([
				"{doc}",
				"{scope}{kname}.{name} = {fn};"
			],{doc:_(fn.doc),kname:name,name:fname,fn:fn.body,scope:Scope});
		});		
		
		klass.publics.each(function(fname,fn){
			code.$ = fmt([
				"{doc}",
				"{scope}{kname}.prototype.{name} = {fn};"
			],{doc:_(fn.doc),kname:name,name:fname,fn:fn.body,scope:Scope});
		});
		
		code.$ = fmt([
			'//mixin {inc}\n',
			'for(var i in {inc}){',
			'	if({inc}.hasOwnProperty(i)){{kname}.prototype[i] = {inc}.prototype[i];}',
			'}'
		],{inc:klass.include,kname:name});
	});
	
	code.$ = "})();";
	//dump
	print(js_beautify(code.join("\n")));
})({
	top:"window",
	doc:function(){return this._doc.jsdoc},
	_doc:{
		simple:function(d){
			var s = "";
			d.splice && (d = d.join(""));
			return "// "+d+"\n";
		},jsdoc:function(d){
			var s = [];
			if(d.splice){
				s.push("/**");
				d.each(function(e){s.push(" * "+e);});
				s.push(" */\n");
			}else{
				s.push("//"+d+"\n");
			}
			return s.join("\n");
		}
	}
});
