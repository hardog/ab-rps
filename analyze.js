'use strict';

const _ = require('underscore'),
	visual = require('./visual'),
	childProcess = require('child_process');

// the `-n` is change
let reqNCmdLine = (n) => `ab -n${n} http://localhost:3000/`;

let execPromise = (change) => {
	return new Promise((resolve, reject) => {
		childProcess.exec(reqNCmdLine(change), {timeout: 60000,}, (err, sout, serr) => {
			if(err){ reject(err); }
			resolve(sout);
		});
	});
};
// to extract RPS value
let rpsReg = /Requests per second\:\s+(\d+\.?\d+)/;
let allExecPromise = [];
// x axis unit
let testStep = 100;
// how many time to test
let testTimes = 15;
let finalResults = [];

for(let i = 0; i < testTimes; i++){
	allExecPromise.push(execPromise((i + 1)*testStep));
}

let limitParallelNum = (promises, limit) => {
	if(promises.length === 0){ return Promise.resolve(); }

	let runningPromises = promises.slice(0, limit);

	return Promise.all(runningPromises)
	.then((results) => {
		finalResults = finalResults.concat(results);
		return limitParallelNum(promises.slice(limit), limit);
	});
};

// Promise.all(allExecPromise)
Promise.resolve()
.then(() => limitParallelNum(allExecPromise, 10))
.then(() => {
	let axis = [];

	for(let i = 0; i < testTimes; i++){
		axis.push({
			x: (i + 1)*testStep,
			y: Math.round(rpsReg.exec(finalResults[i])[1])
		});
	}

	return Promise.resolve(axis);
})
.then((axis) => visual(axis, 'n'))
.catch((e) => {
	console.log(e.message || e.toString());
	console.log(e.stack);
});