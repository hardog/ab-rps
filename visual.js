'use strict';
let _ = require('underscore'),
	fs = require('fs'),
	Canvas = require('canvas');

module.exports = (originAxis, type) => {
	// init axis value
	let width = 600,
		height = 400,
		gap = 40,
		specifyYStep = 20;

	// to png
	let Image = Canvas.Image;
	let canvas = new Canvas(width, height);
	let ctx = canvas.getContext('2d');

	// clear
	ctx.beginPath();
	ctx.fillStyle = '#000';
	ctx.rect(0, 0, width, height);
	ctx.stroke();
	ctx.fill();

	// pre ready to draw
	ctx.lineWidth = 2;
	
	ctx.strokeStyle = "#fff";
	// ready axis
	ctx.beginPath();
	ctx.moveTo(gap, gap);
	ctx.lineTo(gap, height - gap);
	ctx.lineTo(width - gap, height - gap);
	ctx.stroke();

	ctx.fillStyle = "#f00";
	// x/y axis test
	ctx.font = '20px Helvetica';
	// x axis unit
	ctx.fillText('n', width - gap - 5, height - gap - 5);
	// y axis unit
	ctx.fillText('[#/sec] (mean)', gap / 2, gap / 2);

	let axis = _.sortBy(originAxis, 'x'),
		axisLen = axis.length,
		xMMs = _.pluck(axis, 'x'),
		yMMs = _.pluck(axis, 'y'),
		xMax = _.max(xMMs), xMin = _.min(xMMs),
		yMax = _.max(yMMs), yMin = _.min(yMMs),
		xStep = Math.round(xMax / xMin),
		yStep = Math.round((yMax - yMin) / specifyYStep);

	ctx.font = '14px Helvetica';
	// draw x axis units
	let xEveryStep = Math.round((width - 2 * gap)/xStep);
	// console.log('xEveryStep>', xEveryStep);
	for(let i = 0; i < axisLen; i++){
		ctx.fillText((i + 1)*xMin, (i === 0 ? gap - 10 : i*xEveryStep + gap), height - gap + 20);
	}
	
	// draw y axis units
	let yEveryStep = Math.round((height - 2 * gap)/yStep);
	for(let i = 0; i < axisLen; i++){
		ctx.fillText(i*specifyYStep + yMin, gap - 30, height - i*yEveryStep - 40);
	}

	// convert to real x/y axis value which meaning can draw line on image
	for(let i = 0; i < axisLen; i++){
		axis[i] = {
			x: Math.round((width - 2 * gap)*axis[i].x/xMax) + 40 - Math.round((width - 2 * gap)/xStep),
			y: height - gap - axis[i].y + yMin
		};
	}

	// output png
	ctx.strokeStyle = "#0f0";
	let preAxis = axis[0];
	ctx.beginPath();
	for(let i = 1; i < axisLen; i++){
		ctx.moveTo(preAxis.x, preAxis.y);
		ctx.lineTo(axis[i].x, axis[i].y);
		preAxis = axis[i];
	}
	ctx.stroke();


	fs.writeFile(`${type}.png`, canvas.toBuffer());
};