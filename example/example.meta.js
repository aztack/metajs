load("metajs.js");
__([
	"file description",
	"@fileOverview: some text",
])

.namespace("BMap")

.constant("PI",3.14)
.variable("WM_PAINT",function(){return 'hello';})
.variable("TWOPI","2*PI",local)
.doc("The I interface")
.interface("I")
	.doc("ctor")
	.constructor(function(x,y){})
	
	.doc("f1's doc")
	.method("f1")
	
	.doc("f2's doc")
	.method("f2",function(){})
.end()


.module("M",local)
	.doc("test it")
	.method("test",function(){
		return "test";
	})
	.doc("say hello")
	.method("greeting",function(){
		return "hello world";
	})
.end()


.doc(['point that contains ','latitue/longitue value'])
.class("Point")
	.implements("I")
	.extends("B")
	.include("M")
	
.private("property")

	.doc('latitue')
	.property(Number,"lat",0)
	
	.doc('longitute')
	.property(Number,"lng",0)

.public("methods")
	.doc([
		'Point',
		'@param lat latitue',
		'@param lng longitute'
	])
	.sign("Number","Number")
	.constructor(function(lat,lng){
		this._lat = lat || 0;
		this._lng = lng || 0;
	})
	
	.doc('return latitute of the point')
	.method("lat",function(){
		//single line comment
		return this._lat;
	}).ret("Number")
		
	.doc('return longitute of the point')
	.method("lng",function(){
		return this._lng;
	})
	.ret("Number")
		
.static("factory method")
	
	.doc('the origin point')
	.property(Object,"ORIGIN",{lat:0,lng:0})
	
	.doc('get point from pixel on map')
	.sign("String")
	.method("fromPixel",function(encoded){
		
	})
	.ret(Number)
.end("Point")

.end("com.company.package").serialize("json")//namespace