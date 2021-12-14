///////МОЙ ВАРИАНТ РЕШЕНИЯ (ПРОВЕРЕН НА БОЛЬШОМ ФАЙЛЕ весом 2Гб)

const fs = require('fs');

const readStream = fs.createReadStream('./access.log', 'utf8');
const writeStream1 = fs.createWriteStream('./89.123.1.41_requests.log');
const writeStream2 = fs.createWriteStream('./34.48.240.111_requests.log');

const {
	Transform
} = require('stream');

const transformStream1 = new Transform({
	transform(chunk, encoding, callback) {
		const transformedChunk = chunk.toString();

		let reg = new RegExp(`^.*(89.123.1.41).*$`, 'gm');
		let result = transformedChunk.match(reg);

		result.forEach(element => {
			this.push(element + "\n");
		});
		callback();
	}
});
const transformStream2 = new Transform({
	transform(chunk, encoding, callback) {
		const transformedChunk = chunk.toString();

		let reg = new RegExp(`^.*(34.48.240.111).*$`, 'gm');
		let result = transformedChunk.match(reg);

		result.forEach(element => {
			this.push(element + "\n");
		});
		callback();
	}
});
readStream.pipe(transformStream1).pipe(writeStream1);
readStream.pipe(transformStream2).pipe(writeStream2);


///////ОПТИМАЛЬНОЕ РЕШЕНИЕ

// const fs = require('fs')
// const readline = require('readline')

// const readStream = fs.createReadStream('./access.log', 'utf8')
// const writeStream1 = fs.createWriteStream('./89.123.1.41_requests.log')
// const writeStream2 = fs.createWriteStream('./34.48.240.111_requests.log')

// let numStr = 0

// const rl = readline.createInterface({
// 	input: readStream,
// 	terminal: true
// });

// rl.on('line', (line) => {
// 	// сделать получение ip из строки и проверку через includes
// 	if (line.includes("89.123.1.41")) {
// 		writeStream1.write(line + "\n")
// 	}

// 	if (line.includes("34.48.240.111")) {
// 		writeStream2.write(line + "\n")
// 	}

// 	console.log(++numStr)
// })