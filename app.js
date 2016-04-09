'use strict';

const koa = require('koa');
let app = koa();
let count = 0;

require('colors');
app.use(function *(){
	console.log(`request ${count++}`.green);

	let req = this.request,
		param = req.body || req.query,
		total = 0;

	for(let i = 0; i < 10; i++){
		total += i;
	}

	this.body = `${param.name || ''}-${param.age || ''}-${total}`;
});

app.listen(3000);
console.log('ready to receive request ...'.green);