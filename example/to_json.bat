
copy ..\jsb.js jsb.js
copy ..\lang.js lang.js
copy ..\metajs.js metajs.js

..\tool\jsv8 -f example.meta.js>example.json
..\tool\prettyprint.rb example.json>example.pp.json
type example.pp.json

del jsb.js
del lang.js
del metajs.js

