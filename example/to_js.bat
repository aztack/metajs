copy ..\lang.js lang.js
copy ..\jsb.js jsb.js
..\tool\jsv8 -f to_js.js>example.js
type example.js
del lang.js
del jsb.js