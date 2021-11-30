const colors = require("colors/safe");
let [startPoint, endPoint] = process.argv.slice(2);

function getPrimeNumber(a, n) {
	let res = [];
	if (a > n) {
		console.log(colors.magenta("Упс! Неверно указан диапазон! Попробуйте еще раз!"));
		return;
	}
	if (n <= 1) {
		console.log(colors.red("Упс! В указанном диапазоне нет простых чисел! Попробуйте указать другой диапазон!"));
		return;
	}

	if (((a && n) instanceof Number || typeof (a && n) === 'number') && !isNaN(a && n)) {
		nextPrime: for (let i = a; i <= n; i++) {
			if (i <= 1) continue nextPrime;
			for (let j = 2; j < i; j++) {
				if (i % j === 0) {
					continue nextPrime;
				}
			}
			res.push(i);
		}
	} else {
		console.log(colors.magenta("Упс! Неверно указан диапазон! Укажите числом значения диапазона!"));
		return;
	}

	if (Array.isArray(res) && res.length) {
		getSplitArray(res);
	} else {
		console.log(colors.red("В указанном диапазоне нет простых чисел! Укажите значение диапазона числом начиная от цифры 2!"));
	}
}

function getSplitArray(arr) {
	let splitArr = [];
	for (var i = 0; i < arr.length; i = i + 3) {
		let partOfArr = [];
		partOfArr.push(colors.green(arr[i]));
		if (typeof arr[i + 1] !== 'undefined') {
			partOfArr.push(colors.yellow(arr[i + 1]));
		}
		if (typeof arr[i + 2] !== 'undefined') {
			partOfArr.push(colors.red(arr[i + 2]));
		}
		splitArr.push(partOfArr);
	}
	console.log(splitArr.toString());
}

getPrimeNumber(Number(startPoint), Number(endPoint));